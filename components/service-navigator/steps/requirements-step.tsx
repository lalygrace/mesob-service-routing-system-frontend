import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/service-navigator/types";

export function RequirementsStep({
  service,
  checked,
  onCheckedChange,
}: {
  service: Service | null;
  checked: Record<string, boolean>;
  onCheckedChange: (next: Record<string, boolean>) => void;
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

  const total = service.requirements.length;
  const completeCount = service.requirements.filter((r) => checked[r]).length;
  const isReady = total > 0 && completeCount === total;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <p className="text-sm font-medium text-foreground">Readiness</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {completeCount} of {total} required items confirmed.
        </p>
        <p
          className={cn(
            "mt-2 text-sm font-medium",
            isReady ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {isReady
            ? "You look ready. Proceed to the counter."
            : "Missing items? You can still proceed and ask for help."}
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-base">Required documents</CardTitle>
          <CardDescription>
            Check what you already have with you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {service.requirements.map((req) => (
            <div
              key={req}
              className="flex items-start gap-3 rounded-lg border border-border p-3"
            >
              <Checkbox
                id={`req-${service.id}-${req}`}
                checked={Boolean(checked[req])}
                onCheckedChange={(v) =>
                  onCheckedChange({ ...checked, [req]: Boolean(v) })
                }
              />
              <Label
                htmlFor={`req-${service.id}-${req}`}
                className="cursor-pointer text-sm leading-6"
              >
                {req}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
