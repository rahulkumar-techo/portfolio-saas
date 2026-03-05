/**
 * SecondaryButton
 * Outline enterprise button
 */

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SecondaryButtonProps {
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export function SecondaryButton({
  children,
  fullWidth = false,
  className,
  type = "button",
  onClick,
}: SecondaryButtonProps) {
  return (
    <Button
      type={type}
      variant="outline"
      onClick={onClick}
      className={cn(
        "h-11 px-6 rounded-lg font-medium transition-all duration-200",
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </Button>
  );
}
