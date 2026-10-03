export const PageContent = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className="mt-12 flex min-h-svh p-6">
      <div className="flex w-full flex-col gap-4 text-sm leading-loose">
        {children}
      </div>
    </div>
  )
}
