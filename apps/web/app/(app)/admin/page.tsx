import type { SearchParams } from "@/types/next"

import { Page } from "@/components/Page"

export default async function AdminHomePage({}: {
  searchParams: SearchParams
}) {
  return <Page>Admin Home Page</Page>
}
