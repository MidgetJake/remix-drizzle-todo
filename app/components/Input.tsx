import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  error?: string;
}

export function Input({ name, label, error, ...rest }: InputProps) {
  return (
    <div className="space-y-2 flex flex-col">
      <label className='text-white' htmlFor={name}>{label}</label>

      <input
        className="p-2 bg-slate-600 text-sm rounded border-slate-700 text-slate-200"
        id={name}
        name={name}
        {...rest}
      />

      {error && (
        <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
      )}
    </div>
  );
}