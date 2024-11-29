use std::path::PathBuf;

/// Represents a test case for a save file, including its name and expected hash.
struct SaveTest<'a> {
    name: &'a str,
    hash: &'a str,
}

/// A list of save file test cases with their expected hashes.
const SAVE_TESTS: &[SaveTest] = &[
    SaveTest {
        name: "editor.zip",
        hash: "c96410d91fe288ac",
    },
    SaveTest {
        name: "clean.zip",
        hash: "39d1ab41dbde47de",
    },
    SaveTest {
        name: "editor_and_commands.zip",
        hash: "4b295332d250ac8d",
    },
    SaveTest {
        name: "commands.zip",
        hash: "c6d15f0204a046b3",
    },
    SaveTest {
        name: "commands_and_editor.zip",
        hash: "48c12910855c03a7",
    },
];

/// Constructs the full path to a save file given its filename.
///
/// # Arguments
///
/// * `filename` - The name of the save file.
///
/// # Returns
///
/// A `PathBuf` representing the full path to the save file.
fn get_save(filename: &str) -> PathBuf {
    return PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("resources/saves").join(filename);
}

/// Tests that the hashes of the save files match the expected hashes defined in `SAVE_TESTS`.
///
/// This test reads each save file, computes its hash using the xxHash algorithm,
/// and asserts that the computed hash matches the expected hash.
/// This test is useful as a regression test to ensure that the save files have not been modified.
#[test]
fn test_hashes() {
    for save in SAVE_TESTS {
        let save_path = get_save(save.name);
        let hash = xxhash_rust::xxh3::xxh3_64(&std::fs::read(save_path).unwrap());

        let expected_hash = u64::from_str_radix(save.hash, 16).unwrap();
        assert_eq!(hash, expected_hash, "Hash mismatch for {}", save.name);
    }
}