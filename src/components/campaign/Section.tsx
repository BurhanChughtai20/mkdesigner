import type { FormInput } from "@/schema/formSchema";

type Props = {
  values: Partial<FormInput>;
};

// Maps raw field keys to readable labels
const FIELD_LABELS: Record<keyof FormInput, string> = {
  clientName: "Client Name",
  industry: "Industry",
  website: "Website",
  competitors: "Key Competitors",
  objective: "Campaign Objective",
  targetAudience: "Target Audience",
  budget: "Budget (USD)",
  tone: "Tone",
  imagery: "Imagery Style",
  colorDirection: "Color Direction",
  dosAndDonts: "Do's & Don'ts",
};

// Groups for visual separation in the review
const SECTIONS: { title: string; fields: (keyof FormInput)[] }[] = [
  {
    title: "Client Details",
    fields: ["clientName", "industry", "website", "competitors"],
  },
  {
    title: "Campaign Objective",
    fields: ["objective", "targetAudience", "budget"],
  },
  {
    title: "Creative Preferences",
    fields: ["tone", "imagery", "colorDirection", "dosAndDonts"],
  },
];

export default function ReviewStep({ values }: Props) {
  return (
    <div className="space-y-5 max-h-[420px] overflow-y-auto pr-1">
      <div className="flex items-center gap-2 pb-1 border-b">
        <span className="text-base font-semibold">Review Your Brief</span>
        <span className="text-xs text-muted-foreground ml-auto">
          Step 4 of 4
        </span>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title} className="space-y-2">
          {/* Section heading */}
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {section.title}
          </p>

          <div className="rounded-lg border divide-y overflow-hidden">
            {section.fields.map((key) => {
              const raw = values[key];
              const value =
                raw !== undefined && raw !== "" && raw !== null
                  ? String(raw)
                  : null;

              return (
                <div
                  key={key}
                  className="flex items-start justify-between gap-4 px-3 py-2 bg-background hover:bg-muted/40 transition-colors"
                >
                  <span className="text-sm text-muted-foreground shrink-0 w-36">
                    {FIELD_LABELS[key]}
                  </span>
                  <span className="text-sm font-medium text-right break-words max-w-[60%]">
                    {value ?? (
                      <em className="text-muted-foreground font-normal">
                        Not provided
                      </em>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <p className="text-xs text-muted-foreground text-center pt-1">
        Click <strong>Generate Campaign</strong> to send this to AI.
      </p>
    </div>
  );
}