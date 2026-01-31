import { Input } from "./ui/input";

export function InputWithIcon({
  id,
  name,
  type = "text",
  value,
  onBlur,
  onChange,
  icon,
}: any) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
        <div className="text-slate-400">{icon}</div>
      </div>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        className="pl-10"
        aria-describedby={`${id}-error`}
      />
    </div>
  );
}
