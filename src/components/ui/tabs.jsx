import React, { useState, createContext, useContext } from 'react';
import { cn } from '../../utils/cn';

const TabsContext = createContext();

const Tabs = ({ value, onValueChange, defaultValue, className = '', children }) => {
  const [activeTab, setActiveTab] = useState(value || defaultValue);

  const handleValueChange = (newValue) => {
    setActiveTab(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleValueChange }}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ className = '', children }) => {
  const { activeTab } = useContext(TabsContext);

  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (child.type.displayName === 'TabsTrigger') {
          return React.cloneElement(child, { isActive: child.props.value === activeTab });
        }
        return child;
      })}
    </div>
  );
};

const TabsTrigger = ({ 
  className = '', 
  value, 
  children, 
  isActive,
  ...props 
}) => {
  const { setActiveTab } = useContext(TabsContext);

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'hover:bg-background/50',
        className
      )}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = ({ className = '', value, children }) => {
  const { activeTab } = useContext(TabsContext);

  if (value !== activeTab) return null;

  return (
    <div
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
    >
      {children}
    </div>
  );
};

TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };