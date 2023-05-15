import React, { InputHTMLAttributes, forwardRef } from "react";

export interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<IInput> = forwardRef(
  ({ label, ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor="input"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          {label}
        </label>
        <input
          ref={ref as any}
          type="text"
          className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500`}
          {...props}
        />
      </div>
    );
  }
);
