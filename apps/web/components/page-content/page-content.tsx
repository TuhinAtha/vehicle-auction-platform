export const PageContent = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className="mt-12 flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        {children}
      </div>
    </div>
  )
}
