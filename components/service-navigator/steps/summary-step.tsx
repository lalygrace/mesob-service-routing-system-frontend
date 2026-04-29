import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Service } from "@/lib/service-navigator/types";

export function SummaryStep({
  service,
  requirementsCheckedCount,
  requirementsTotal,
  onConfirm,
}: {
  service: Service | null;
  requirementsCheckedCount: number;
  requirementsTotal: number;
  onConfirm: () => void;
}) {
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
    <div className="space-y-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-base">You’re going to</CardTitle>
          <CardDescription>{service.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-sm font-medium text-foreground">Where to go</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {service.locationHint}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-sm font-medium text-foreground">What to bring</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {requirementsCheckedCount} of {requirementsTotal} items confirmed.
            </p>
          </div>

          <Button type="button" size="lg" className="h-12" onClick={onConfirm}>
            Confirm & finish
          </Button>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        This screen is the final “handoff” to the physical counter.
      </p>
    </div>
  );
}
