import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Avatar = forwardRef(({ 
  src,
  alt,
  fallback,
  size = "md",
  className,
  ...props 
}, ref) => {
  const sizes = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm", 
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl"
  };
  
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  
  if (src) {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt || "Avatar"}
        className={cn(
          "rounded-full object-cover",
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium",
        sizes[size],
        className
      )}
      {...props}
    >
      {getInitials(fallback || alt)}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;