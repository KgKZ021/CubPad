import { Note } from '../types/note';

/**
 * Checks if the app is currently running inside Tauri Desktop
 */
export function isTauriEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    '__TAURI_INTERNALS__' in window ||
    '__TAURI__' in window ||
    Boolean((window as unknown as { isTauri?: boolean }).isTauri)
  );
}

/**
 * Converts a note title and ID into a safe, recognizable file name: e.g. "welcome-to-cub-pad_note_123.json"
 */
export function getNoteFileName(title: string, id: string): string {
  const sanitizedTitle = (title || 'untitled')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 32);

  return `${sanitizedTitle || 'note'}_${id}.json`;
}

/**
 * Saves a single Note to the local filesystem via Tauri IPC (or logs in browser mode)
 */
export async function saveNoteToDisk(note: Note): Promise<boolean> {
  if (!isTauriEnvironment()) {
    return false;
  }

  try {
    const { invoke } = await import('@tauri-apps/api/core');
    const fileName = getNoteFileName(note.title, note.id);
    const noteJson = JSON.stringify(note, null, 2);

    await invoke('save_note', {
      fileName,
      noteJson,
    });
    return true;
  } catch (err) {
    console.warn('[TauriStorage] saveNoteToDisk fallback/error:', err);
    return false;
  }
}

/**
 * Loads all Note files from ~/Documents/CubPad/Notes/ via Tauri IPC
 */
export async function loadAllNotesFromDisk(): Promise<Note[] | null> {
  if (!isTauriEnvironment()) {
    return null;
  }

  try {
    const { invoke } = await import('@tauri-apps/api/core');
    const rawNotesJson = await invoke<string[]>('load_all_notes');

    if (!Array.isArray(rawNotesJson) || rawNotesJson.length === 0) {
      return null;
    }

    const loadedNotes: Note[] = [];
    for (const jsonStr of rawNotesJson) {
      try {
        const parsed = JSON.parse(jsonStr) as Note;
        if (parsed && parsed.id && parsed.title) {
          loadedNotes.push(parsed);
        }
      } catch (parseErr) {
        console.warn('[TauriStorage] Failed to parse note JSON:', parseErr);
      }
    }

    // Sort by updatedAt descending
    loadedNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return loadedNotes.length > 0 ? loadedNotes : null;
  } catch (err) {
    console.warn('[TauriStorage] loadAllNotesFromDisk fallback/error:', err);
    return null;
  }
}

/**
 * Deletes a note file from ~/Documents/CubPad/Notes/
 */
export async function deleteNoteFromDisk(noteId: string, title?: string): Promise<boolean> {
  if (!isTauriEnvironment()) {
    return false;
  }

  try {
    const { invoke } = await import('@tauri-apps/api/core');
    const fileName = getNoteFileName(title || '', noteId);

    await invoke('delete_note_file', {
      fileName,
    });
    return true;
  } catch (err) {
    console.warn('[TauriStorage] deleteNoteFromDisk fallback/error:', err);
    return false;
  }
}
