use human_bytes::human_bytes;
use serde::Serialize;
use simple_home_dir::home_dir;
use std::fs;
use std::fs::metadata;
use time::OffsetDateTime;

#[cfg(target_os = "windows")]
fn get_save_directories() -> Vec<String> {
    let mut save_directories: Vec<String> = Vec::new();

    if let Some(home_dir) = home_dir() {
        let save_path = home_dir.join("AppData\\Roaming\\Factorio\\saves");
        if save_path.exists() {
            save_directories.push(save_path.to_str().unwrap().to_string());
        }
    }

    save_directories
}

#[cfg(target_os = "linux")]
fn get_save_directories() -> Vec<String> {
    let mut save_directories = Vec::new();

    if let Some(home_dir) = home_dir() {
        let normal_save_path = home_dir.join(".factorio/saves");
        if normal_save_path.exists() {
            save_directories.push(save_path.to_str().unwrap().to_string());
        }

        let flatpak_save_path = home_dir.join(".var/app/com.valvesoftware.Steam/.factorio/saves");
        if flatpak_save_path.exists() {
            save_directories.push(flatpak_save_path.to_str().unwrap().to_string());
        }
    }

    save_directories
}

#[cfg(target_os = "macos")]
fn get_save_directories() -> Vec<String> {
    let mut save_directories = Vec::new();

    if let Some(home_dir) = home_dir() {
        let save_path = home_dir.join("Library/Application Support/factorio/saves");
        if save_path.exists() {
            save_directories.push(save_path.to_str().unwrap().to_string());
        }
    }

    save_directories
}

struct SaveFileInternal {
    path: String,
    last_modified: usize,
}

#[derive(Serialize, Debug)]
struct SaveFile {
    name: String,
    path: String,
    size: String,
    last_modified: String,
}

#[tauri::command]
fn choose_best_save_directory() -> Option<String> {
    let save_directories = get_save_directories();
    let mut best_directory: Option<String> = None;
    let mut max_zip_files = 0;

    for dir in save_directories {
        if let Ok(entries) = fs::read_dir(&dir) {
            let zip_file_count = entries
                .filter_map(Result::ok)
                .filter(|entry| {
                    entry
                        .file_name()
                        .to_str()
                        .map_or(false, |name| name.ends_with(".zip"))
                })
                .count();
            if zip_file_count > max_zip_files {
                max_zip_files = zip_file_count;
                best_directory = Some(dir);
            }
        }
    }

    best_directory
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn find_save_files() -> Vec<SaveFile> {
    let save_directories = get_save_directories();
    let mut save_files = Vec::new();

    for dir in save_directories {
        println!("Save directory found: {}", dir);
        if let Ok(entries) = fs::read_dir(dir) {
            for entry in entries.flatten() {
                if let Some(file_name) = entry.file_name().to_str() {
                    if !file_name.ends_with(".zip") {
                        continue;
                    }

                    let file_path = entry.path();
                    if let Ok(metadata) = metadata(&file_path) {
                        let size = human_bytes(metadata.len() as f64);
                        let last_modified =
                            Into::<OffsetDateTime>::into(metadata.modified().unwrap())
                                .format(
                                    &time::format_description::parse(
                                        "[year]-[month]-[day] [hour]:[minute]:[second]",
                                    )
                                    .unwrap(),
                                )
                                .unwrap();
                        save_files.push(SaveFile {
                            name: file_name.to_string(),
                            path: file_path.to_str().unwrap().to_string(),
                            size,
                            last_modified,
                        });
                    }
                }
            }
        }
    }

    save_files
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            find_save_files,
            choose_best_save_directory
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
