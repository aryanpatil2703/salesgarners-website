/**
 * Structured logger utility for standardizing telemetry and log output across API routes and services.
 * Ensures production code avoids naked console statements while preserving auditability.
 */

const LOG_LEVELS = {
  DEBUG: 10,
  INFO: 20,
  WARN: 30,
  ERROR: 40,
};

const CURRENT_LEVEL = process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;

/**
 * Formats structured log output as JSON or structured string depending on the runtime environment.
 * @param {'DEBUG' | 'INFO' | 'WARN' | 'ERROR'} level - Log severity level
 * @param {string} message - Descriptive log message
 * @param {Record<string, unknown>} [meta] - Optional structured metadata
 */
function logEntry(level, message, meta = {}) {
  if (LOG_LEVELS[level] < CURRENT_LEVEL) return;

  const timestamp = new Date().toISOString();
  const payload = {
    timestamp,
    level,
    message,
    ...meta,
  };

  // Direct to stderr for errors, stdout for standard info/debug
  if (level === 'ERROR') {
    process.stderr.write(`[${timestamp}] [${level}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}\n`);
  } else {
    process.stdout.write(`[${timestamp}] [${level}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}\n`);
  }
}

/**
 * Dedicated production logger instance.
 */
export const logger = {
  /**
   * Logs informational messages regarding normal lifecycle events.
   * @param {string} msg - Informational message
   * @param {Record<string, unknown>} [meta] - Associated contextual telemetry
   */
  info: (msg, meta) => logEntry('INFO', msg, meta),

  /**
   * Logs warnings that do not stop execution but warrant operator attention.
   * @param {string} msg - Warning message
   * @param {Record<string, unknown>} [meta] - Associated contextual telemetry
   */
  warn: (msg, meta) => logEntry('WARN', msg, meta),

  /**
   * Logs runtime exceptions and operational failures with stack traces.
   * @param {string} msg - Error description
   * @param {Record<string, unknown>} [meta] - Error details or caught exceptions
   */
  error: (msg, meta) => logEntry('ERROR', msg, meta),

  /**
   * Logs diagnostic details for local debugging.
   * @param {string} msg - Debug message
   * @param {Record<string, unknown>} [meta] - Detailed debugging information
   */
  debug: (msg, meta) => logEntry('DEBUG', msg, meta),
};

