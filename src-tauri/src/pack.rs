use std::{env, path::PathBuf};
use rand::Rng;
use zip::ZipArchive;

struct UnpackResult {
    levels: Vec<PathBuf>,
}

fn get_tempdir() -> PathBuf {
    let mut tempdir = env::temp_dir();

    // Generate a random suffix for the tempdir
    let suffix: String = (0..6)
    .map(|_| rand::thread_rng().gen_range(b'A'..=b'z') as char)
    .collect();

    tempdir.push(format!("factorio_achievements_fixer.{}", suffix));
    tempdir
}

fn unpack(src: PathBuf, dest: PathBuf) -> Result<UnpackResult, String> {
    // Ensure the src and dest paths exist
    if !src.exists() {
        return Err("Source path does not exist".to_string());
    } else if !dest.exists() {
        return Err("Destination path does not exist".to_string());
    }

    // Ensure src is zlib compressed .zip, and dest is a directory
    if src.extension() != Some("zip".as_ref()) {
        return Err("Source path is not a .zip file".to_string());
    } else if !dest.is_dir() {
        return Err("Destination path is not a directory".to_string());
    }

    // Unpack the src to dest
    let file = std::fs::File::open(src);
    if file.is_err() {
        return Err("Failed to open source file: ".to_string() + &file.err().unwrap().to_string());
    
    }
    let mut archive = ZipArchive::new(file.unwrap()).unwrap();

    // archive.extract();

    // Return pathbufs for each level file of the unpacked archive

    Err("Not implemented".to_string())
}

fn pack(src: PathBuf, dest: PathBuf) -> Result<usize, String> {
    // Ensure src exists, ensure dest does not exist (but parent folder does)
    // Ensure src is a directory, and dest is a .zip file
    // Pack the src to dest
    Err("Not implemented".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
fn test_get_tempdir_uniqueness() {
    use std::collections::HashSet;
    
    // Generate 1000 paths
    let mut paths = HashSet::new();
    let mut filenames = Vec::with_capacity(1000);
    
    for i in 0..1000 {
        let path = get_tempdir();
        
        // Ensure UTF-8 valid filename compatibility
        let filename = path.file_name()
            .and_then(|n| n.to_str())
            .unwrap_or_else(|| panic!("Path {} should have valid UTF-8 filename", i));
            
        filenames.push(filename.to_string());
        
        // Insert path into set and ensure it wasn't already present
        assert!(paths.insert(path.clone()), 
            "Duplicate path found at iteration {}: {}", i, filename);
    }
    
    // Verify we got exactly 1000 unique paths
    assert_eq!(paths.len(), 1000, 
        "Expected 1000 unique paths, got {}", paths.len());
    }
}