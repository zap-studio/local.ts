//! Database error types.

use diesel::r2d2::PoolError;

/// Database error type for Tauri commands.
#[derive(Debug, thiserror::Error)]
pub enum DbError {
    #[error("Database connection error: {0}")]
    Connection(#[from] PoolError),

    #[error("Database query error: {0}")]
    Query(#[from] diesel::result::Error),

    #[error("Migration error: {0}")]
    Migration(String),

    #[error("Database initialization error: {0}")]
    Init(String),

    #[error("Invalid data: {0}")]
    InvalidData(String),
}

// Implement Serialize for DbError so it can be returned from Tauri commands
impl serde::Serialize for DbError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
