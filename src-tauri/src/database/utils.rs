/// Helper function to convert bool to SQLite integer
/// SQLite uses INTEGER for boolean values (0 = false, 1 = true)
pub fn bool_to_int(b: bool) -> i32 {
    if b {
        1
    } else {
        0
    }
}

/// Helper function to convert SQLite integer to bool
pub fn int_to_bool(i: i32) -> bool {
    i != 0
}
