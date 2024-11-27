use human_bytes::human_bytes;
use humanize_duration::prelude::DurationExt;
use humanize_duration::Unit;
use humanize_duration::{types::DurationParts, unit, Formatter, Truncate};
use serde::Serialize;
use simple_home_dir::home_dir;
use std::fs;
use std::fs::metadata;

struct SlimFormatter;

unit!(MyYear, "y", "y");
unit!(MyMonth, "mon", "mon");
unit!(MyDay, "d", "d");
unit!(MyHour, "h", "h");
unit!(MyMinute, "m", "m");
unit!(MySecond, "s", "s");
unit!(MyMillis, "ms", "ms");
unit!(MyMicro, "mms", "mms");
unit!(MyNano, "ns", "ns");

impl Formatter for SlimFormatter {
    fn get(&self, truncate: Truncate) -> Box<dyn Unit> {
        match truncate {
            Truncate::Nano => Box::new(MyNano),
            Truncate::Micro => Box::new(MyMicro),
            Truncate::Millis => Box::new(MyMillis),
            Truncate::Second => Box::new(MySecond),
            Truncate::Minute => Box::new(MyMinute),
            Truncate::Hour => Box::new(MyHour),
            Truncate::Day => Box::new(MyDay),
            Truncate::Month => Box::new(MyMonth),
            Truncate::Year => Box::new(MyYear),
        }
    }

    fn format(
        &self,
        f: &mut std::fmt::Formatter<'_>,
        parts: DurationParts,
        truncate: Truncate,
    ) -> std::fmt::Result {
        self.format_default(f, parts, truncate)
    }
}

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

#[derive(Serialize, Debug)]
struct SaveFile {
    name: String,
    path: String,
    size: String,
    last_modified: String,
    #[serde(skip_serializing)]
    modified_delta: usize,
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

    // Collect all save files
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
                        let modified = metadata.modified();
                        if modified.is_err() {
                            continue;
                        }

                        let modified_elapsed = match modified.unwrap().elapsed() {
                            Ok(elapsed) => elapsed,
                            Err(_) => continue,
                        };
                        let modified_elapsed_secs = modified_elapsed.as_secs();

                        let human_last_modified = if modified_elapsed_secs < 60 {
                            if modified_elapsed_secs < 10 {
                                "just now".to_string()
                            } else {
                                "< 1min".to_string()
                            }
                        } else {
                            modified_elapsed
                                .human_with_format(
                                    match modified_elapsed_secs / 60 {
                                        m if m < 60 => Truncate::Minute,
                                        m if m < 60 * 36 => Truncate::Hour,
                                        m if m < 60 * 24 * 31 => Truncate::Day,
                                        m if m < 60 * 24 * 31 * 18 => Truncate::Month,
                                        _ => Truncate::Year,
                                    },
                                    SlimFormatter,
                                )
                                .to_string()
                                .replace(" ", "")
                                + " ago"
                        };

                        save_files.push(SaveFile {
                            name: file_name.to_string(),
                            size: human_bytes(metadata.len() as f64),
                            path: file_path.to_str().unwrap().to_string(),
                            last_modified: human_last_modified,
                            modified_delta: modified_elapsed_secs as usize,
                        });
                    }
                }
            }
        }
    }

    // Sort the save files by last modified time
    save_files.sort_by(|a, b| a.modified_delta.cmp(&b.modified_delta));

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
