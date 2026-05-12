import { UserButton } from "@clerk/nextjs";
import { AppNav } from "@/components/app-nav";

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-20 flex w-full shrink-0 items-center justify-between gap-3 border-b border-black px-4 py-2">
      <AppNav />

      <div className="flex items-center gap-3">
        <UserButton />
      </div>
    </header>
  );
}
