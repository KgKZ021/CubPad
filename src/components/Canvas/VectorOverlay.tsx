import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNoteZustandStore } from '../../stores/useNoteZustandStore';
import { VectorShape } from '../../types/note';

interface VectorOverlayProps {
  noteId: string;
}

interface DraftPoint {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const PALETTE_COLORS = ['#4A3B32', '#D97736', '#6A8E7F', '#4A5568'];

export const VectorOverlay: React.FC<VectorOverlayProps> = ({ noteId }) => {
  const {
    getActiveNote,
    activeDrawingTool,
    setActiveDrawingTool,
    drawingColor,
    drawingStrokeWidth,
    drawingIsDashed,
    addVectorShape,
    undoLastVectorShape,
    deleteVectorShape,
  } = useNoteZustandStore();

  const activeNote = getActiveNote();
  const shapes: VectorShape[] = activeNote?.vectorShapes || activeNote?.content?.vectors || [];

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draft, setDraft] = useState<DraftPoint | null>(null);
  const [hoveredShapeId, setHoveredShapeId] = useState<string | null>(null);
  const isDrawing = draft !== null;

  // Keyboard shortcut listener (Cmd+Z / Ctrl+Z to undo vector, Escape to exit draw mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeDrawingTool === 'none') return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        undoLastVectorShape(noteId);
      } else if (e.key === 'Escape') {
        setActiveDrawingTool('none');
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [activeDrawingTool, noteId, undoLastVectorShape, setActiveDrawingTool]);

  // Smart Snapping calculation
  const calculateSnappedCoords = useCallback(
    (startX: number, startY: number, rawX: number, rawY: number, isShift: boolean): { endX: number; endY: number } => {
      const dx = rawX - startX;
      const dy = rawY - startY;
      const distance = Math.hypot(dx, dy);

      if (distance < 2) {
        return { endX: rawX, endY: rawY };
      }

      const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

      if (isShift) {
        // Snap to nearest 45 degree angle increment
        const snappedAngleDeg = Math.round(angleDeg / 45) * 45;
        const snappedRad = (snappedAngleDeg * Math.PI) / 180;
        return {
          endX: startX + distance * Math.cos(snappedRad),
          endY: startY + distance * Math.sin(snappedRad),
        };
      }

      // Subtle ±6° horizontal underline snapping
      if (Math.abs(angleDeg) <= 6 || Math.abs(angleDeg) >= 174) {
        return { endX: rawX, endY: startY };
      }

      // Subtle ±6° vertical divider snapping
      if (Math.abs(angleDeg - 90) <= 6 || Math.abs(angleDeg + 90) <= 6) {
        return { endX: startX, endY: rawY };
      }

      return { endX: rawX, endY: rawY };
    },
    []
  );

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (activeDrawingTool === 'none' || activeDrawingTool === 'eraser') return;
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    try {
      (e.target as Element).setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture is not supported
    }

    setDraft({
      startX: x,
      startY: y,
      endX: x,
      endY: y,
    });
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draft || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    const snapped = calculateSnappedCoords(
      draft.startX,
      draft.startY,
      rawX,
      rawY,
      e.shiftKey
    );

    setDraft((prev) => (prev ? { ...prev, endX: snapped.endX, endY: snapped.endY } : null));
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draft) return;

    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    const dx = draft.endX - draft.startX;
    const dy = draft.endY - draft.startY;
    const distance = Math.hypot(dx, dy);

    // Only commit if line length > 6px to avoid accidental tiny dots
    if (distance >= 6 && (activeDrawingTool === 'line' || activeDrawingTool === 'arrow')) {
      const newShape: VectorShape = {
        id: `vec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: activeDrawingTool,
        startX: Math.round(draft.startX),
        startY: Math.round(draft.startY),
        endX: Math.round(draft.endX),
        endY: Math.round(draft.endY),
        color: drawingColor,
        strokeWidth: drawingStrokeWidth,
        isDashed: drawingIsDashed,
      };

      addVectorShape(noteId, newShape);
    }

    setDraft(null);
  };

  const handlePointerCancel = () => {
    setDraft(null);
  };

  const isInteractive = activeDrawingTool !== 'none';

  return (
    <svg
      ref={svgRef}
      className={`absolute inset-0 w-full h-full z-20 ${
        isInteractive
          ? activeDrawingTool === 'eraser'
            ? 'pointer-events-auto cursor-cell'
            : 'pointer-events-auto cursor-crosshair'
          : 'pointer-events-none'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{ touchAction: isInteractive ? 'none' : 'auto' }}
    >
      <defs>
        {/* Organic Hand-drawn Styled Arrowhead Markers for each Palette Color */}
        {PALETTE_COLORS.map((color) => {
          const colorKey = color.replace('#', '');
          return (
            <React.Fragment key={colorKey}>
              {/* Standard 2px Marker */}
              <marker
                id={`arrowhead-${colorKey}`}
                viewBox="0 0 12 12"
                refX="10"
                refY="6"
                markerWidth="8"
                markerHeight="8"
                orient="auto-start-reverse"
                markerUnits="strokeWidth"
              >
                <path
                  d="M 2 2 C 4.5 4.5, 6 5.5, 10 6 C 6 6.5, 4.5 7.5, 2 10 C 3.5 7, 3.5 5, 2 2 Z"
                  fill={color}
                  stroke={color}
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </marker>

              {/* Bold 4px Marker */}
              <marker
                id={`arrowhead-bold-${colorKey}`}
                viewBox="0 0 12 12"
                refX="10"
                refY="6"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
                markerUnits="strokeWidth"
              >
                <path
                  d="M 2 2.2 C 4.5 4.5, 6 5.5, 10 6 C 6 6.5, 4.5 7.5, 2 9.8 C 3.5 7, 3.5 5, 2 2.2 Z"
                  fill={color}
                  stroke={color}
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </marker>
            </React.Fragment>
          );
        })}
      </defs>

      {/* Render Committed Shapes */}
      {shapes.map((shape) => {
        const colorKey = (shape.color || '#4A3B32').replace('#', '');
        const markerId = shape.strokeWidth >= 3 ? `arrowhead-bold-${colorKey}` : `arrowhead-${colorKey}`;
        const isHoveredInEraser = activeDrawingTool === 'eraser' && hoveredShapeId === shape.id;

        return (
          <g
            key={shape.id}
            className={`transition-opacity duration-150 ${
              activeDrawingTool === 'eraser' ? 'pointer-events-auto cursor-pointer group' : 'pointer-events-none'
            }`}
            onPointerEnter={() => activeDrawingTool === 'eraser' && setHoveredShapeId(shape.id)}
            onPointerLeave={() => activeDrawingTool === 'eraser' && setHoveredShapeId(null)}
            onClick={(e) => {
              if (activeDrawingTool === 'eraser') {
                e.stopPropagation();
                deleteVectorShape(noteId, shape.id);
                setHoveredShapeId(null);
              }
            }}
          >
            {/* Invisible Wide Hitbox for easy clicking with eraser */}
            {activeDrawingTool === 'eraser' && (
              <line
                x1={shape.startX}
                y1={shape.startY}
                x2={shape.endX}
                y2={shape.endY}
                stroke="transparent"
                strokeWidth={Math.max(shape.strokeWidth + 16, 20)}
                strokeLinecap="round"
              />
            )}

            {/* Eraser Hover Glow Highlight */}
            {isHoveredInEraser && (
              <line
                x1={shape.startX}
                y1={shape.startY}
                x2={shape.endX}
                y2={shape.endY}
                stroke="#EF4444"
                strokeWidth={shape.strokeWidth + 6}
                strokeOpacity="0.4"
                strokeLinecap="round"
              />
            )}

            {/* Actual Vector Line or Arrow */}
            <line
              x1={shape.startX}
              y1={shape.startY}
              x2={shape.endX}
              y2={shape.endY}
              stroke={isHoveredInEraser ? '#EF4444' : shape.color}
              strokeWidth={shape.strokeWidth}
              strokeDasharray={shape.isDashed ? '6 5' : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd={shape.type === 'arrow' ? `url(#${markerId})` : undefined}
              style={{
                filter: 'drop-shadow(0px 1px 1px rgba(74, 59, 50, 0.08))',
              }}
            />
          </g>
        );
      })}

      {/* Render Live Ghost Preview while drawing */}
      {isDrawing && draft && (
        <g className="pointer-events-none">
          {/* Subtle guide halo */}
          <line
            x1={draft.startX}
            y1={draft.startY}
            x2={draft.endX}
            y2={draft.endY}
            stroke={drawingColor}
            strokeWidth={drawingStrokeWidth + 4}
            strokeOpacity="0.15"
            strokeLinecap="round"
          />

          {/* Ghost Vector Shape */}
          <line
            x1={draft.startX}
            y1={draft.startY}
            x2={draft.endX}
            y2={draft.endY}
            stroke={drawingColor}
            strokeWidth={drawingStrokeWidth}
            strokeDasharray={drawingIsDashed ? '6 5' : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.85"
            markerEnd={
              activeDrawingTool === 'arrow'
                ? `url(#${
                    drawingStrokeWidth >= 3
                      ? `arrowhead-bold-${drawingColor.replace('#', '')}`
                      : `arrowhead-${drawingColor.replace('#', '')}`
                  })`
                : undefined
            }
          />
        </g>
      )}
    </svg>
  );
};
