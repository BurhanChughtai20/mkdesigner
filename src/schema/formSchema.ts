import { z } from "zod";

export const formSchema = z.object({
  clientName: z.string().min(2),
  industry: z.string().min(2),
  website: z.string().url(),
  competitors: z.string().min(1),
  objective: z.enum(["Awareness", "Consideration", "Conversion"]),
  targetAudience: z.string().min(2),
  budget: z.coerce.number().min(1, "Budget must be at least 1"),
  tone: z.string().min(2),
  imagery: z.string().min(2),
  colorDirection: z.string().min(2),
  dosAndDonts: z.string().min(1),
});

export type FormInput  = z.input<typeof formSchema>;
export type FormOutput = z.output<typeof formSchema>;