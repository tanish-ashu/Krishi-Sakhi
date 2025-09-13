import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

const Select = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target) &&
        !triggerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (child.type.displayName === 'SelectTrigger') {
          return React.cloneElement(child, {
            ref: triggerRef,
            isOpen,
            onClick: () => setIsOpen(!isOpen),
            selectedValue
          });
        }
        if (child.type.displayName === 'SelectContent') {
          return isOpen ? React.cloneElement(child, {
            ref: contentRef,
            onValueChange: handleValueChange,
            selectedValue
          }) : null;
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = React.forwardRef(({ 
  className = '', 
  children, 
  isOpen, 
  onClick, 
  selectedValue,
  ...props 
}, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    onClick={onClick}
    {...props}
  >
    {children || <SelectValue selectedValue={selectedValue} />}
  </button>
));

SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = ({ placeholder = 'Select...', selectedValue }) => (
  <span className="text-left">
    {selectedValue || placeholder}
  </span>
);

const SelectContent = React.forwardRef(({ 
  className = '', 
  children, 
  onValueChange, 
  selectedValue,
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
      className
    )}
    {...props}
  >
    <div className="p-1">
      {React.Children.map(children, (child) => {
        if (child.type.displayName === 'SelectItem') {
          return React.cloneElement(child, {
            onSelect: onValueChange,
            isSelected: child.props.value === selectedValue
          });
        }
        return child;
      })}
    </div>
  </div>
));

SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef(({ 
  className = '', 
  children, 
  value, 
  onSelect, 
  isSelected,
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      isSelected && 'bg-accent text-accent-foreground',
      className
    )}
    onClick={() => onSelect?.(value)}
    {...props}
  >
    {children}
  </div>
));

SelectItem.displayName = 'SelectItem';

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };