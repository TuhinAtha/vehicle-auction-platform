import type { SearchParams } from "@/types/next"

import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"

export default async function DealerHomePage({}: {
  searchParams: SearchParams
}) {
  return (
    <Page>
      <PageHeader breadcrumbs={[{ label: "Home" }]} />
      <PageContent>Dealer Home Page</PageContent>
    </Page>
  )
}
