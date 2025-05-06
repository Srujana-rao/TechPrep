
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonLinkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const ButtonLink = ({ 
  children, 
  href,
  variant = "default",
  size = "default",
  className,
  ...props 
}: ButtonLinkProps) => {
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn(className)}
      {...props}
    >
      <Link to={href}>{children}</Link>
    </Button>
  );
};
