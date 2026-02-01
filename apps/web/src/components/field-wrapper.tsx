import { Label } from "./ui/label";

export function FieldWrapper({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-200">{label}</Label>
      {children}
    </div>
  );
}
