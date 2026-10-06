import type { VehicleAuction } from "@repo/shared"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { price, shortDatetime } from "@/lib/intl"
import { AuctionResultBadge } from "./AuctionResultBadge"
import { AuctionStatusBadge } from "./AuctionStatusBadge"

export const VehicleAuctionHistory = ({
  auctions,
}: {
  auctions: VehicleAuction[]
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Auctions ({auctions.length})</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bidding</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reserve price</TableHead>
            <TableHead>Highest bid</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auctions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground">
                No auctions yet.
              </TableCell>
            </TableRow>
          ) : (
            auctions.map((auction) => (
              <TableRow key={auction.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/admin/auctions/${auction.id}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {shortDatetime.format(new Date(auction.startsAt))} –{" "}
                    {shortDatetime.format(new Date(auction.endsAt))}
                  </Link>
                </TableCell>
                <TableCell>
                  {auction.status === "ENDED" ? (
                    <AuctionResultBadge result={auction.result} />
                  ) : (
                    <AuctionStatusBadge status={auction.status} />
                  )}
                </TableCell>
                <TableCell className="tabular-nums">
                  {price.format(auction.reservePrice)}
                </TableCell>
                <TableCell className="tabular-nums">
                  {auction.highestBid
                    ? price.format(auction.highestBid.amount)
                    : "No bids"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
)
