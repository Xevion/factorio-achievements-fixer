// Scan level files for pattern
// Provide list of patterns to user for patch options, byte offsets with changes
// Byte offset will be single, as Map Editor/Command byte offsets don't change order
use std::path::PathBuf;

// State is required in order to track the patterns scanned, and ensure that level files are correctly closed/moved when exiting the application.
struct Patcher {
    src_archive: Option<PathBuf>,
    working_dir: Option<PathBuf>,
    patch: Option<Patch>,
}


struct Patch {
    // The relative path to the s   pecific level file being patched
    file: PathBuf,
    // The byte offset (from the start of the file) of the first (earliest) 8 byte 0xFF pattern ('fblock')
    fblock_pattern_index: u64,
    // The customizable marker pattern offset, specifically of the achievement byte that would be modified by the patch.
    marker_pattern_offset: u64,
}

impl Patcher {
    // Create a new Patcher instance
    pub fn new() -> Self {
        Patcher {
            src_archive: None,
            working_dir: None,
            patch: None,
            // Initialize any required fields here
        }
    }

    // Cleanup method to ensure level files are correctly closed/moved
    pub fn cleanup(&self) {
        // Perform cleanup operations here
    }
}

