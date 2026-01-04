pub mod error;
pub mod models;
pub mod schema;
pub mod utils;

use diesel::r2d2::{self, ConnectionManager};
use diesel::sqlite::SqliteConnection;
use diesel_migrations::{EmbeddedMigrations, MigrationHarness, embed_migrations};
use tauri::AppHandle;

pub use error::DbError;

use crate::database::utils::get_database_path;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations");

pub type DbPool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

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
