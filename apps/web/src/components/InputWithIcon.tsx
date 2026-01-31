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
        className="pl-10 border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        aria-describedby={`${id}-error`}
      />
    </div>
  );
}
