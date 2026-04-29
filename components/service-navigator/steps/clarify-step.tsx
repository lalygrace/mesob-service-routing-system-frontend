import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Decision } from "@/lib/service-navigator/types";

export function ClarifyStep({
  decision,
  onPick,
}: {
  decision: Decision;
  onPick: (serviceIds: string[]) => void;
}) {
  if (decision.mode !== "clarify" || !decision.clarify) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-base">
            {decision.clarify.question}
          </CardTitle>
          <CardDescription>
            Choose one option. This keeps the flow fast.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {decision.clarify.options.map((option) => (
            <Button
              key={option.id}
              type="button"
              variant="outline"
              size="lg"
              className="h-12 justify-start"
              onClick={() => onPick(option.serviceIds)}
            >
              {option.label}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
