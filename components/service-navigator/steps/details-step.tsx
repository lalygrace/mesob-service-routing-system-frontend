import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Service } from "@/lib/service-navigator/types";

export function DetailsStep({ service }: { service: Service | null }) {
  if (!service) {
    return (
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base">No service selected</CardTitle>
          <CardDescription>
            Go back and select one of the suggestions.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <InfoCard title="Authority" value={service.authority} />
      <InfoCard title="Location" value={service.locationHint} />
      <InfoCard title="Fee" value={service.feeHint} />
      <InfoCard title="Processing time" value={service.durationHint} />
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-base">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
