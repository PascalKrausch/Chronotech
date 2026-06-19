import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger";
}

export default function Button({ variant = "primary", children, ...props }: ButtonProps) {
  
  const baseStyle = "px-4 py-2 rounded-md font-bold transition-colors cursor-pointer";
  const variants = {
    primary: "bg-stone-200 text-black hover:bg-stone-700 hover:text-white",
    danger: "border border-red-600 text-stone-600 bg-white hover:bg-red-100",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}