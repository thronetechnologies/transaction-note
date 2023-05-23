// services IDs
export const AUTH_GROUP_ID = 'auth_consumer';
export const IDENTITY_GROUP_ID = 'identity_consumer';
export const NOTIFICATION_GROUP_ID = 'notification_consumer';

// Encryption variables
export const ENCRYPTION_ALGORITHM = 'encryption_algorithm';
export const CRYPTO = 'crypto';
export const ALGORITHM = {
  /**
   * GCM is an authenticated encryption mode that
   * not only provides confidentiality but also
   * provides integrity in a secured way
   * */
  BLOCK_CIPHER: 'aes-256-gcm',

  /**
   * 128 bit auth tag is recommended for GCM
   */
  AUTH_TAG_BYTE_LEN: 16,

  /**
   * NIST recommends 96 bits or 12 bytes IV for GCM
   * to promote interoperability, efficiency, and
   * simplicity of design
   */
  IV_BYTE_LEN: 12,

  /**
   * Note: 256 (in algorithm name) is key size.
   * Block size for AES is always 128
   */
  KEY_BYTE_LEN: 32,

  /**
   * To prevent rainbow table attacks
   * */
  SALT_BYTE_LEN: 16,
};

// Prometheus Variables
export const REGISTRY = 'REGISTRY';
export const HISTOGRAM = 'HISTOGRAM';
export const GUAGE = 'GUAGE';
export const DEFAULT_METRICS = 'DEFAULT_METRICS';
export const COLLECT_DEFAULT_METRIC = 'COLLECT_DEFAULT_METRIC';
export const COUNTER = 'COUNTER';
export const PUSHGATEWAY = 'PUSHGATEWAY';
export const HISTOGRAM_HTTP_RESPONSE_TIME = 'HISTOGRAM_HTTP_RESPONSE_TIME';

export const histogramObj = {
  name: `http_request_duration_seconds`,
  help: `Duration of HTTP requests in seconds`,
  labelNames: ['method', 'route', 'code', 'requestid'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
};

// Email variable
