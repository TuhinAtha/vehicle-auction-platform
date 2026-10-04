import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"
import { CreateVehicleForm } from "@/features/vehicles"

export default function NewVehiclePage() {
  return (
    <Page>
      <PageHeader>
        <h1 className="text-lg font-semibold">New vehicle</h1>
      </PageHeader>
      <PageContent>
        <CreateVehicleForm />
      </PageContent>
    </Page>
  )
}
