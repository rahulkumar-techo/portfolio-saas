/**
 * PrimaryButton
 * Standard enterprise button for entire SaaS
 */

"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export function PrimaryButton({
  children,
  loading = false,
  fullWidth = false,
  className,
  type = "button",
  onClick,
}: PrimaryButtonProps) {
  return (
    <Button
      type={type}
      disabled={loading}
      onClick={onClick}
      className={cn(
        "h-11 px-6 rounded-lg font-medium transition-all duration-200",
        "bg-primary text-primary-foreground",
        "hover:opacity-90",
        "disabled:opacity-60 disabled:pointer-events-none",
        fullWidth && "w-full",
        className
      )}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
