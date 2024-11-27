mod dirs;
mod format;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            dirs::find_save_files,
            dirs::choose_best_save_directory,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
