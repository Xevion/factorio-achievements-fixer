mod dirs;
mod format;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            dirs::find_save_files,
            dirs::choose_best_save_directory,
        ])
        // .on_window_event(|_window, event| {
        //     use tauri::WindowEvent;
        //     match event {
        //         WindowEvent::CloseRequested { api, .. } => {
        //             api.prevent_close();
        //         }
        //         _ => {}
        //     }
        // })
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|_app_handle, event| match event {
        // tauri::RunEvent::ExitRequested { api, .. } => {
        //     println!("Exit requested");
        //     api.prevent_exit();
        // }
        _ => {}
    });
}
