import type { Control } from "react-hook-form";
import type { FormInput, FormOutput } from "@/schema/formSchema";
import rawFormFieldsJson from "@/data/formFields.json";
import FieldRenderer from "./FieldRenderer";
import type { StepField } from "@/types";
import ReviewStep from "./Section";

type Props = {
  step: number;
  control: Control<FormInput, unknown, FormOutput>;
  formValues?: FormOutput;
};

type FormFieldsJson = {
  step1: StepField[];
  step2: StepField[];
  step3: StepField[];
};

const formFieldsJson = rawFormFieldsJson as FormFieldsJson;

export default function StepRenderer({ step, control, formValues }: Props) {
  if (step === 4) {
    return <ReviewStep values={formValues ?? {}} />;
  }
  const key = `step${step}` as keyof FormFieldsJson;
  const fields: StepField[] = formFieldsJson[key] ?? [];

  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <FieldRenderer key={f.name} field={f} control={control} />
      ))}
    </div>
  );
}