import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "icon";
}

const buttonVariants = ({
  variant = "default",
  size = "default",
  className = "",
}: ButtonProps = {}) => {
  return cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    variant === "default"
      ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
      : "",
    variant === "outline"
      ? "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
      : "",
    variant === "ghost" ? "hover:bg-accent hover:text-accent-foreground" : "",
    variant === "destructive"
      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      : "",
    size === "default" ? "h-9 px-4 py-2" : "",
    size === "sm" ? "h-8 px-3 text-xs" : "",
    size === "icon" ? "h-9 w-9" : "",
    className
  );
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
