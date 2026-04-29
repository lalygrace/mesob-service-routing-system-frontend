import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Helpfulness = "helpful" | "not-helpful" | null;

export type FeedbackValue = {
  helpfulness: Helpfulness;
  rating: number | null;
  comment: string;
};

export function FeedbackStep({
  value,
  onChange,
  submitted,
  onSubmit,
}: {
  value: FeedbackValue;
  onChange: (next: FeedbackValue) => void;
  submitted: boolean;
  onSubmit: () => void;
}) {
  if (submitted) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-base">Thank you</CardTitle>
          <CardDescription>Your feedback has been recorded.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You can start over to help someone else.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-base">Feedback</CardTitle>
          <CardDescription>
            This helps us improve routing accuracy and clarity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Was this helpful?</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant={
                  value.helpfulness === "helpful" ? "default" : "outline"
                }
                size="lg"
                className="h-12"
                onClick={() => onChange({ ...value, helpfulness: "helpful" })}
              >
                Helpful
              </Button>
              <Button
                type="button"
                variant={
                  value.helpfulness === "not-helpful" ? "default" : "outline"
                }
                size="lg"
                className="h-12"
                onClick={() =>
                  onChange({ ...value, helpfulness: "not-helpful" })
                }
              >
                Not helpful
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <Button
                  key={n}
                  type="button"
                  variant={value.rating === n ? "default" : "outline"}
                  size="lg"
                  className={cn("h-12")}
                  onClick={() => onChange({ ...value, rating: n })}
                  aria-label={`Rate ${n} out of 5`}
                >
                  {n}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Optional comment</Label>
            <Input
              id="feedback"
              value={value.comment}
              onChange={(e) => onChange({ ...value, comment: e.target.value })}
              placeholder="Tell us what was confusing..."
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" size="lg" className="h-12" onClick={onSubmit}>
              Submit feedback
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        (UI-only) Feedback is stored only in-memory for now.
      </p>
    </div>
  );
}
