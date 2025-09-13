import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";

const DropdownMenuContext = createContext();

const DropdownMenu = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

const DropdownMenuTrigger = React.forwardRef(({ className, children, asChild = false, ...props }, ref) => {
  if (asChild) {
    return React.cloneElement(children, { ref, ...props });
  }
  return (
    <button ref={ref} className={className} {...props}>
      {children}
    </button>
  );
});

const DropdownMenuContent = React.forwardRef(({ className, align = "center", children, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        align === "end" ? "right-0" : "left-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const DropdownMenuItem = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
};

