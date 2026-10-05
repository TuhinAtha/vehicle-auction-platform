import type { AuctionDetailAdmin } from "@repo/shared"

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

export const BidsTable = ({ auction }: { auction: AuctionDetailAdmin }) => {
  const { bids } = auction

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bids ({bids.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Dealer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Placed</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {bids.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  No bids yet.
                </TableCell>
              </TableRow>
            ) : (
              bids.map((bid, index) => (
                <TableRow key={bid.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {bid.dealer.name}
                  </TableCell>
                  <TableCell className="font-medium tabular-nums">
                    {price.format(bid.amount)}
                  </TableCell>
                  <TableCell>
                    {shortDatetime.format(new Date(bid.createdAt))}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {bid.id === auction.winningBidId ? (
                      <span className="text-green-700 dark:text-green-300">
                        Winning bid
                      </span>
                    ) : (
                      index === 0 && "Highest"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
