export const UPLOADS_PATH = '/uploads'
export const VEHICLE_PHOTOS_PATH = `${UPLOADS_PATH}/vehicles`
export const VEHICLE_PHOTO_PATH_PATTERN =
  /^\/uploads\/vehicles\/[0-9a-f-]{36}\.(jpg|png|webp)$/

export const VEHICLE_PHOTO_MAX_COUNT = 10

export const VEHICLE_PHOTO_MAX_BYTES = 5 * 1024 * 1024

/** Accepted MIME types and the extension each one is saved with */
export const VEHICLE_PHOTO_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}
