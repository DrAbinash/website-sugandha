import path from "path";

/**
 * Where uploaded photos are stored.
 * In Docker this is /app/data/uploads — inside the same persistent volume
 * as the database, so photos survive container rebuilds.
 */
export function getUploadsDir(): string {
  return process.env.UPLOADS_DIR || path.join(process.cwd(), "data", "uploads");
}
