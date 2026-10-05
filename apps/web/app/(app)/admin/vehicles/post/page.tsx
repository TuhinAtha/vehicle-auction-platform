import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"
import { CreateVehicleForm } from "@/features/vehicles"

export default function NewVehiclePage() {
  return (
    <Page>
      <PageHeader
        breadcrumbs={[
          { label: "Vehicles", href: "/admin/vehicles" },
          { label: "New vehicle" },
        ]}
      />
      <PageContent>
        <CreateVehicleForm />
      </PageContent>
    </Page>
  )
}
