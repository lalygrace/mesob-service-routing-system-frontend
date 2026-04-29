import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProblemStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="problem" className="text-base">
          Type your problem
        </Label>
        <Textarea
          id="problem"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='Example: "I lost my ID"'
          autoFocus
          className="min-h-28"
        />
        <p className="text-xs text-muted-foreground">
          Keep it short. If it’s unclear, we’ll ask one quick question.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Quick examples</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            "I lost my ID",
            "My passport expired",
            "I want to start a business",
            "I need tax registration",
          ].map((example) => (
            <Button
              key={example}
              type="button"
              variant="outline"
              size="lg"
              className="h-14 justify-start"
              onClick={() => onChange(example)}
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
