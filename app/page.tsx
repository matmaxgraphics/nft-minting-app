import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="min-h-screen w-full max-w-3xl py-32 px-16 bg-white dark:bg-black">
        <h1 className="mb-12">Mint your NFT</h1>
        <Link href="/mint" className="bg-blue-500 p-4">Go to Mint Page</Link>
      </main>
    </div>
  );
}
