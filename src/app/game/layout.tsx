export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[url('/bg-viewport.jpg')] bg-cover">
      <div className={"flex min-h-screen flex-col justify-center"}>{children}</div>
    </div>
  )
}
