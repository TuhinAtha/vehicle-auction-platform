import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"

export default function AdminVehiclePage() {
  return (
    <Page>
      <PageHeader
        breadcrumbs={[
          { label: "Vehicles", href: "/admin/vehicles" },
          { label: "Vehicle" },
        ]}
      />
      <PageContent>
        <div>Admin Vehicle</div>
      </PageContent>
    </Page>
  )
}
