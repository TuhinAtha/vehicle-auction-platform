import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { BadRequestException } from '@nestjs/common'
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface.js'
import {
  UPLOADS_PATH,
  VEHICLE_PHOTO_MAX_BYTES,
  VEHICLE_PHOTO_TYPES,
} from '@repo/shared'
import { diskStorage } from 'multer'

export const UPLOADS_DIR = join(process.cwd(), UPLOADS_PATH)

export const vehiclePhotoUpload: MulterOptions = {
  storage: diskStorage({
    destination: join(UPLOADS_DIR, 'vehicles'),
    filename: (_req, file, callback) =>
      callback(null, `${randomUUID()}.${VEHICLE_PHOTO_TYPES[file.mimetype]}`),
  }),
  limits: { fileSize: VEHICLE_PHOTO_MAX_BYTES },
  fileFilter: (_req, file, callback) =>
    file.mimetype in VEHICLE_PHOTO_TYPES
      ? callback(null, true)
      : callback(
          new BadRequestException('photo must be a JPEG, PNG or WebP image'),
          false,
        ),
}
