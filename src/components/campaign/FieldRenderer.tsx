import { Controller, type Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormInput } from "@/schema/formSchema";
import type { StepField } from "@/types";
type Props = {
  field: StepField;
  control: Control<FormInput>;
};

export default function FieldRenderer({ field, control }: Props) {
  return (
    <Controller
      name={field.name as keyof FormInput}
      control={control}
      render={({ field: ctrl }) => {
        const displayValue =
          ctrl.value !== undefined ? String(ctrl.value) : "";

        if (field.type === "textarea") {
          return (
            <Textarea
              placeholder={field.placeholder}
              value={displayValue}
              onChange={(e) => ctrl.onChange(e.target.value)}
            />
          );
        }

        if (field.type === "select" && field.options) {
          return (
            <Select value={displayValue} onValueChange={ctrl.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={displayValue}
            onChange={(e) => ctrl.onChange(e.target.value)}
          />
        );
      }}
    />
  );
}