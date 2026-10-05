import Link from "next/link"
import { Fragment } from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export const PageHeader = ({
  breadcrumbs,
  children,
}: Readonly<{
  breadcrumbs: { label: string; href?: string }[]
  children?: React.ReactNode
}>) => {
  return (
    <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="md:hidden" />
      <Separator
        orientation="vertical"
        className="mr-1 md:hidden data-vertical:h-4 data-vertical:self-center"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map(({ label, href }, index) => (
            <Fragment key={label}>
              {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
              <BreadcrumbItem
                className={
                  index < breadcrumbs.length - 1
                    ? "hidden md:inline-flex"
                    : undefined
                }
              >
                {index === breadcrumbs.length - 1 ? (
                  <h1>
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  </h1>
                ) : href ? (
                  <BreadcrumbLink render={<Link href={href} />}>
                    {label}
                  </BreadcrumbLink>
                ) : (
                  label
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </header>
  )
}
