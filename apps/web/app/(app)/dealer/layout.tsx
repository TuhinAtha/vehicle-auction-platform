import { AppBar } from "@/components/app-bar"

export default function DealerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <AppBar
        displayMode="dealer"
        navs={[
          { path: "/dealer/auctions", text: "Auctions", exact: true },
          { path: "/dealer/mybids", text: "My bids" },
        ]}
      />
      {children}
    </>
  )
}
