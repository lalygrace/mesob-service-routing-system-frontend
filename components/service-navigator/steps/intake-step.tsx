import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export type IntakeMethod = "voice" | "type" | "categories";

export function IntakeStep({
  onPick,
}: {
  onPick: (method: IntakeMethod) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label className="text-base">How can we help you today?</Label>
        <p className="text-sm text-muted-foreground">
          Choose the easiest option. You can complete this in under a minute.
        </p>
      </div>

      <div className="grid gap-3">
        <ActionButton
          title="Speak your problem"
          description="Fastest option if you don’t want to type."
          onClick={() => onPick("voice")}
        />
        <ActionButton
          title="Type your problem"
          description="Good if the place is noisy."
          onClick={() => onPick("type")}
        />
        <ActionButton
          title="Browse categories"
          description="Choose from common service areas."
          onClick={() => onPick("categories")}
        />
      </div>
    </div>
  );
}

function ActionButton({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <Card className="transition-colors hover:bg-muted/30">
      <CardContent className="p-3 sm:p-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-auto w-full justify-start gap-3 rounded-xl px-4 py-4 text-left"
          onClick={onClick}
        >
          <span className="flex min-w-0 flex-col">
            <span className="text-base font-semibold leading-6 text-foreground">
              {title}
            </span>
            <span className="mt-1 text-sm font-normal leading-5 text-muted-foreground">
              {description}
            </span>
          </span>
        </Button>
      </CardContent>
    </Card>
  );
}
