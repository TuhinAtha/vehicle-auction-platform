import { AppBar } from "@/components/app-bar"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <AppBar
        navs={[
          { path: "/admin", text: "Auctions", exact: true },
          { path: "/admin/vehicles", text: "Vehicles" },
        ]}
      />
      {children}
    </>
  )
}
