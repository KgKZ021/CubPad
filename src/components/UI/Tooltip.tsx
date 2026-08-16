import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  label: string;
  shortcut?: string | string[];
  description?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delayMs?: number;
  children: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  label,
  shortcut,
  description,
  position = 'bottom',
  delayMs = 250,
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delayMs);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Format shortcut strings
  const shortcuts = Array.isArray(shortcut) ? shortcut : shortcut ? [shortcut] : [];

  // Position classes
  let positionClasses = '';
  switch (position) {
    case 'top':
      positionClasses = 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      break;
    case 'left':
      positionClasses = 'right-full top-1/2 -translate-y-1/2 mr-2';
      break;
    case 'right':
      positionClasses = 'left-full top-1/2 -translate-y-1/2 ml-2';
      break;
    case 'bottom':
    default:
      positionClasses = 'top-full left-1/2 -translate-x-1/2 mt-2';
      break;
  }

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 pointer-events-none whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-[#2B231D] text-white text-xs shadow-xl border border-[#4A3B32]/60 animate-in fade-in zoom-in-95 duration-150 ${positionClasses}`}
          style={{ minWidth: 'max-content' }}
        >
          <div className="flex items-center gap-1.5 font-medium">
            <span>{label}</span>
            {shortcuts.length > 0 && (
              <div className="flex items-center gap-1 ml-1">
                {shortcuts.map((sc, i) => (
                  <kbd
                    key={i}
                    className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white/15 text-amber-200 border border-white/10 rounded shadow-2xs"
                  >
                    {sc}
                  </kbd>
                ))}
              </div>
            )}
          </div>
          {description && (
            <p className="text-[10px] text-[#CBBBB0] font-normal mt-0.5 leading-tight max-w-[200px] whitespace-normal">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
