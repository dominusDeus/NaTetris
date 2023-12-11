import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex text-3xl">TETRIS</div>
      <Link
        href="/game"
        className="flex flex-1 flex-col items-center justify-center justify-self-center"
      >
        START GAME
      </Link>
    </main>
  )
}
