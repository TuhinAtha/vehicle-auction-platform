import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"
import { CreateAuctionForm } from "@/features/auctions"

export default function NewAuctionPage() {
  return (
    <Page>
      <PageHeader>
        <h1 className="text-lg font-semibold">New auction</h1>
      </PageHeader>
      <PageContent>
        <CreateAuctionForm />
      </PageContent>
    </Page>
  )
}
