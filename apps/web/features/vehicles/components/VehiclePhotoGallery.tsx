import type { Vehicle } from "@repo/shared"
import Image from "next/image"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export const VehiclePhotoGallery = ({
  vehicle,
}: {
  vehicle: Pick<Vehicle, "photos" | "make" | "model">
}) => {
  const { photos } = vehicle

  if (photos.length === 0) return null

  return (
    <Carousel
      aria-label="Vehicle photos"
      className="overflow-hidden rounded-xl"
    >
      <CarouselContent>
        {photos.map((photo, index) => (
          <CarouselItem key={photo}>
            <div className="relative aspect-16/10 bg-muted">
              <Image
                src={photo}
                alt={`${vehicle.make} ${vehicle.model}, photo ${index + 1} of ${photos.length}`}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {photos.length > 1 && (
        <>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </>
      )}
    </Carousel>
  )
}
