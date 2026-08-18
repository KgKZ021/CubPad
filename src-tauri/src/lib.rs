use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

/// Resolves or creates the local notes storage directory: `~/Documents/CubPad/Notes/`
fn get_notes_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let docs_dir = app
        .path()
        .document_dir()
        .or_else(|_| app.path().app_data_dir())
        .map_err(|e| format!("Failed to resolve documents directory: {}", e))?;

    let notes_dir = docs_dir.join("CubPad").join("Notes");
    if !notes_dir.exists() {
        fs::create_dir_all(&notes_dir)
            .map_err(|e| format!("Failed to create notes directory at {:?}: {}", notes_dir, e))?;
    }
    Ok(notes_dir)
}

/// Saves a serialized note JSON file to `~/Documents/CubPad/Notes/`
#[tauri::command]
fn save_note(app: AppHandle, file_name: String, note_json: String) -> Result<(), String> {
    let notes_dir = get_notes_dir(&app)?;
    let safe_name = if file_name.ends_with(".json") {
        file_name
    } else {
        format!("{}.json", file_name)
    };
    let file_path = notes_dir.join(safe_name);
    fs::write(&file_path, note_json)
        .map_err(|e| format!("Failed to write note file at {:?}: {}", file_path, e))?;
    Ok(())
}

/// Reads and loads all `.json` note files from `~/Documents/CubPad/Notes/`
#[tauri::command]
fn load_all_notes(app: AppHandle) -> Result<Vec<String>, String> {
    let notes_dir = get_notes_dir(&app)?;
    let mut notes = Vec::new();

    let entries = fs::read_dir(&notes_dir)
        .map_err(|e| format!("Failed to read notes directory at {:?}: {}", notes_dir, e))?;

    for entry in entries.flatten() {
        let path = entry.path();
        if path.is_file() && path.extension().map_or(false, |ext| ext == "json") {
            if let Ok(content) = fs::read_to_string(&path) {
                notes.push(content);
            }
        }
    }

    Ok(notes)
}

/// Deletes the corresponding note file from `~/Documents/CubPad/Notes/`
#[tauri::command]
fn delete_note_file(app: AppHandle, file_name: String) -> Result<(), String> {
    let notes_dir = get_notes_dir(&app)?;
    let safe_name = if file_name.ends_with(".json") {
        file_name
    } else {
        format!("{}.json", file_name)
    };
    let file_path = notes_dir.join(safe_name);
    if file_path.exists() {
        fs::remove_file(&file_path)
            .map_err(|e| format!("Failed to delete note file at {:?}: {}", file_path, e))?;
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            save_note,
            load_all_notes,
            delete_note_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
