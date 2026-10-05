import type { SearchParams } from "@/types/next"

import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"

export default async function AdminHomePage({}: {
  searchParams: SearchParams
}) {
  return (
    <Page>
      <PageHeader breadcrumbs={[{ label: "Home" }]} />
      <PageContent>Admin Home Page</PageContent>
    </Page>
  )
}
