export const PageContent = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <section className="flex flex-col gap-4 p-6 text-sm leading-loose">
      {children}
    </section>
  )
}
