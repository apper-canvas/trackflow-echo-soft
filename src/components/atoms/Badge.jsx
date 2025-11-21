import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  variant = "default", 
  size = "sm",
  className, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center rounded-full font-medium transition-colors";
  
  const variants = {
    default: "bg-slate-100 text-slate-800",
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800", 
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    // Status specific variants
    backlog: "bg-slate-100 text-slate-700",
    todo: "bg-blue-100 text-blue-700", 
    "in-progress": "bg-yellow-100 text-yellow-700",
    review: "bg-purple-100 text-purple-700",
    done: "bg-green-100 text-green-700",
    // Priority variants
    low: "bg-slate-100 text-slate-600",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700",
    // Type variants
    bug: "bg-red-100 text-red-700",
    feature: "bg-blue-100 text-blue-700",
    task: "bg-green-100 text-green-700"
  };
  
  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-sm"
  };
  
  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;