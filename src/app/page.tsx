import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex flex-col text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to Al-Hikmah</h1>
        <p className="text-xl mb-8">Your learning journey starts here</p>

        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
