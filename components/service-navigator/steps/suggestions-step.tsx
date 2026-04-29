import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MatchCandidate } from "@/lib/service-navigator/types";

export function SuggestionsStep({
  candidates,
  userText,
  selectedId,
  onSelect,
}: {
  candidates: MatchCandidate[];
  userText: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <p className="text-sm font-medium text-foreground">You said</p>
        <p className="mt-1 text-sm text-muted-foreground">{userText}</p>
      </div>

      <div className="grid gap-3">
        {candidates.map((c) => {
          const service = c.service;
          const isSelected = selectedId === service.id;

          return (
            <Card
              key={service.id}
              className={cn(
                "transition-colors",
                isSelected ? "border-ring ring-2 ring-ring/20" : undefined,
              )}
            >
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">{service.title}</CardTitle>
                <CardDescription>{service.authority}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {service.locationHint}
                </p>
                <Button
                  type="button"
                  size="lg"
                  className="h-12"
                  onClick={() => onSelect(service.id)}
                >
                  {isSelected ? "Selected" : "Select"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {candidates.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No suggestions yet. Go back and describe your problem differently.
        </p>
      ) : null}
    </div>
  );
}
