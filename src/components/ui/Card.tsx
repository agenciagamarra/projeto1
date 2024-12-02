import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white shadow-sm rounded-lg overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn("px-6 py-5 border-b border-gray-200", className)}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Content = function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("px-6 py-5", className)} {...props}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "px-6 py-4 bg-gray-50 border-t border-gray-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};