"use client"

import {
  VEHICLE_PHOTO_MAX_BYTES,
  VEHICLE_PHOTO_MAX_COUNT,
  VEHICLE_PHOTO_TYPES,
} from "@repo/shared"
import { X } from "lucide-react"
import Image from "next/image"
import { type ChangeEvent, useState } from "react"
import { useController } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { uploadVehiclePhoto } from "../data/mutations"
import type { VehicleFormValues } from "../lib/vehicleFormSchema"

const MAX_MEGABYTES = VEHICLE_PHOTO_MAX_BYTES / 1024 / 1024

export const VehiclePhotosField = () => {
  const { field } = useController<VehicleFormValues, "photos">({
    name: "photos",
  })
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>()
  const photos = field.value

  const onFilesPicked = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])]
    event.target.value = ""
    setError(undefined)

    if (photos.length + files.length > VEHICLE_PHOTO_MAX_COUNT) {
      setError(`A vehicle can have up to ${VEHICLE_PHOTO_MAX_COUNT} photos.`)
      return
    }
    if (files.some((file) => file.size > VEHICLE_PHOTO_MAX_BYTES)) {
      setError(`Each photo can be up to ${MAX_MEGABYTES} MB.`)
      return
    }

    setIsUploading(true)
    const results = await Promise.allSettled(files.map(uploadVehiclePhoto))
    setIsUploading(false)

    const uploaded = results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value.path] : []
    )
    field.onChange([...photos, ...uploaded])
    if (uploaded.length < files.length) {
      setError(
        `${files.length - uploaded.length} of ${files.length} photos couldn't be uploaded. Please try again.`
      )
    }
  }

  return (
    <Field data-invalid={!!error} className="sm:col-span-3">
      <FieldLabel htmlFor="photos">Photos (optional)</FieldLabel>
      <Input
        id="photos"
        type="file"
        multiple
        accept={Object.keys(VEHICLE_PHOTO_TYPES).join(",")}
        disabled={isUploading || photos.length >= VEHICLE_PHOTO_MAX_COUNT}
        onChange={onFilesPicked}
        aria-describedby="photos-hint"
      />
      <FieldDescription id="photos-hint">
        {isUploading
          ? "Uploading…"
          : `Up to ${VEHICLE_PHOTO_MAX_COUNT} photos, ${MAX_MEGABYTES} MB each. JPEG, PNG or WebP. The first one is shown on cards.`}
      </FieldDescription>
      {error && <FieldError>{error}</FieldError>}

      {photos.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {photos.map((photo, index) => (
            <li
              key={photo}
              className="relative aspect-16/10 overflow-hidden rounded-md bg-muted"
            >
              <Image
                src={photo}
                alt={`Photo ${index + 1}`}
                fill
                sizes="(min-width: 640px) 150px, 33vw"
                className="object-cover"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon-xs"
                className="absolute top-1 right-1"
                aria-label={`Remove photo ${index + 1}`}
                onClick={() =>
                  field.onChange(photos.filter((other) => other !== photo))
                }
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Field>
  )
}
