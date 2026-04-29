import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { LanguageCode } from "@/lib/service-navigator/types";

export function LanguageStep({
  value,
  onChange,
}: {
  value: LanguageCode;
  onChange: (value: LanguageCode) => void;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(next) => onChange(next as LanguageCode)}
      className="grid gap-3 sm:grid-cols-3"
    >
      <LanguageOption value="am" label="Amharic" />
      <LanguageOption value="en" label="English" />
      <LanguageOption value="om" label="Afaan Oromo" />
    </RadioGroup>
  );
}

function LanguageOption({
  value,
  label,
}: {
  value: LanguageCode;
  label: string;
}) {
  return (
    <div className="relative">
      <RadioGroupItem
        value={value}
        id={`lang-${value}`}
        className="peer sr-only"
      />
      <Label
        htmlFor={`lang-${value}`}
        className={cn(
          "flex min-h-20 cursor-pointer items-center justify-center rounded-2xl border border-border bg-card px-5 text-lg font-semibold text-card-foreground shadow-sm transition-colors sm:min-h-24",
          "hover:bg-muted/40",
          "peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-ring/25",
        )}
      >
        {label}
      </Label>
    </div>
  );
}
