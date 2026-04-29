import { AppHeader } from "@/components/app-shell/app-header";
import { ServiceNavigator } from "@/components/service-navigator/service-navigator";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <main className="flex-1 bg-muted/20">
        <ServiceNavigator />
      </main>
    </div>
  );
}
