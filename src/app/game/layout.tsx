export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[url('/bg-viewport.jpg')] bg-cover min-h-screen">
      <div className={"min-h-screen flex flex-col justify-center"}>
        {children}
      </div>
    </div>
  );
}
