import React from 'react';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8 sm:flex sm:items-center sm:justify-between", className)}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-gray-700">{description}</p>
        )}
      </div>
      {children && <div className="mt-4 sm:mt-0">{children}</div>}
    </div>
  );
}