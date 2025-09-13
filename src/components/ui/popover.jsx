import React, { useState } from 'react';

const Popover = ({ children, className = '', ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`} {...props}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
};

const PopoverTrigger = ({ children, isOpen, setIsOpen, ...props }) => {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
    </button>
  );
};

const PopoverContent = ({ children, isOpen, setIsOpen, className = '', ...props }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Popover, PopoverTrigger, PopoverContent };

