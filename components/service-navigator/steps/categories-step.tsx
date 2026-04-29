import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function CategoriesStep({ onPick }: { onPick: (hint: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label className="text-base">Browse categories</Label>
        <p className="text-sm text-muted-foreground">
          Pick a category. We’ll then narrow it down to the exact service.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {[
          { label: "ID services", hint: "ID" },
          { label: "Passport services", hint: "Passport" },
          { label: "Business services", hint: "Business registration" },
          { label: "Transport services", hint: "Driving license" },
          { label: "Revenue / Tax", hint: "Tax registration" },
        ].map((c) => (
          <Button
            key={c.label}
            type="button"
            variant="outline"
            size="lg"
            className="h-14 justify-start"
            onClick={() => onPick(c.hint)}
          >
            {c.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
