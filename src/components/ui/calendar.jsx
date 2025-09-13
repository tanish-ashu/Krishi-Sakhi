import React from 'react';

const Calendar = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`p-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Calendar;

