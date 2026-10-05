export const LoadError = ({ children }: { children: React.ReactNode }) => (
  <p role="alert" className="text-sm text-destructive">
    {children}
  </p>
)
