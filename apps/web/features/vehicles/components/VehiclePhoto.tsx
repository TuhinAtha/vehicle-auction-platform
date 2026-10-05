import type { Vehicle } from "@repo/shared"
import { Car } from "lucide-react"
import Image from "next/image"

export const VehiclePhoto = ({
  vehicle,
}: {
  vehicle: Pick<Vehicle, "photos" | "make" | "model">
}) => {
  const photo = vehicle.photos.at(0)

  return (
    <div className="relative flex aspect-16/10 items-center justify-center bg-muted text-muted-foreground">
      {photo ? (
        <Image
          src={photo}
          alt={`${vehicle.make} ${vehicle.model}`}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        <Car className="size-10" aria-hidden />
      )}
    </div>
  )
}
