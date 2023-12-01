import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="text-3xl flex">TETRIS</div>
      <Link
        href="/game"
        className="justify-self-center flex flex-col flex-1 items-center justify-center"
      >
        START GAME
      </Link>
    </main>
  );
}
