pub mod error;
pub mod models;
pub mod schema;

use diesel::r2d2::{self, ConnectionManager};
use diesel::sqlite::SqliteConnection;
use diesel_migrations::{EmbeddedMigrations, MigrationHarness, embed_migrations};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

pub use error::DbError;

/// Embedded migrations that run automatically on startup.
/// Migrations are compiled into the binary from the `migrations/` directory.
pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations");

/// Type alias for the connection pool.
pub type DbPool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

/// Get the database file path for the application.
fn get_database_path(app: &AppHandle) -> Result<PathBuf, DbError> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| DbError::Init(format!("Failed to get app data directory: {}", e)))?;

    // Ensure the directory exists
    fs::create_dir_all(&app_data_dir)
        .map_err(|e| DbError::Init(format!("Failed to create app data directory: {}", e)))?;

    Ok(app_data_dir.join("local.db"))
}

/// Initialize the database connection pool and run migrations.
///
/// This function:
/// 1. Determines the database path in the app's data directory
/// 2. Creates a connection pool with r2d2
/// 3. Runs any pending migrations automatically
///
/// The database file is created automatically if it doesn't exist.
pub fn init(app: &AppHandle) -> Result<DbPool, DbError> {
    let db_path = get_database_path(app)?;
    let db_url = db_path.to_string_lossy().to_string();

    log::info!("Initializing database at: {}", db_url);

    // Create connection manager
    let manager = ConnectionManager::<SqliteConnection>::new(&db_url);

    // Build connection pool
    let pool = r2d2::Pool::builder()
        .max_size(10)
        .build(manager)
        .map_err(|e| DbError::Init(format!("Failed to create connection pool: {}", e)))?;

    // Run migrations
    let mut conn = pool.get()?;
    conn.run_pending_migrations(MIGRATIONS)
        .map_err(|e| DbError::Migration(e.to_string()))?;

    log::info!("Database initialized successfully");

    Ok(pool)
}
