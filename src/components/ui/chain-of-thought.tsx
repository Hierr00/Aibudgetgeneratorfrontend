"use client";

import * as React from "react";
import { ChevronDown, Dot, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { Badge } from "./badge";
import { cn } from "../../lib/utils";

// Context for managing the chain of thought state
const ChainOfThoughtContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

// Root component
interface ChainOfThoughtProps extends React.ComponentPropsWithoutRef<"div"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ChainOfThought({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...props
}: ChainOfThoughtProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [controlledOpen, onOpenChange]
  );

  return (
    <ChainOfThoughtContext.Provider
      value={{ open, setOpen: handleOpenChange }}
    >
      <Collapsible open={open} onOpenChange={handleOpenChange}>
        <div
          className={cn(
            "rounded-lg border border-neutral-200 bg-neutral-50 p-4",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </Collapsible>
    </ChainOfThoughtContext.Provider>
  );
}

// Header component
interface ChainOfThoughtHeaderProps
  extends React.ComponentPropsWithoutRef<typeof CollapsibleTrigger> {
  children?: React.ReactNode;
}

export function ChainOfThoughtHeader({
  children = "Chain of Thought",
  className,
  ...props
}: ChainOfThoughtHeaderProps) {
  const { open } = React.useContext(ChainOfThoughtContext);

  return (
    <CollapsibleTrigger asChild>
      <button
        className={cn(
          "flex w-full items-center justify-between text-sm font-medium text-neutral-950 transition-colors hover:text-neutral-700",
          className
        )}
        {...props}
      >
        <span>{children}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
    </CollapsibleTrigger>
  );
}

// Step component
interface ChainOfThoughtStepProps extends React.ComponentPropsWithoutRef<"div"> {
  icon?: LucideIcon;
  label: string;
  description?: string;
  status?: "complete" | "active" | "pending";
}

export function ChainOfThoughtStep({
  icon: Icon = Dot,
  label,
  description,
  status = "complete",
  className,
  children,
  ...props
}: ChainOfThoughtStepProps) {
  return (
    <div
      className={cn("flex gap-3 py-2", className)}
      {...props}
    >
      <div className="flex-shrink-0 pt-0.5">
        <Icon
          className={cn(
            "h-4 w-4",
            status === "complete" && "text-green-600",
            status === "active" && "text-blue-600 animate-pulse",
            status === "pending" && "text-neutral-400"
          )}
        />
      </div>
      <div className="flex-1 space-y-1">
        <div
          className={cn(
            "text-sm font-medium",
            status === "complete" && "text-neutral-950",
            status === "active" && "text-neutral-950",
            status === "pending" && "text-neutral-500"
          )}
        >
          {label}
        </div>
        {description && (
          <div className="text-xs text-neutral-600">{description}</div>
        )}
        {children}
      </div>
    </div>
  );
}

// Search Results container
interface ChainOfThoughtSearchResultsProps
  extends React.ComponentPropsWithoutRef<"div"> {}

export function ChainOfThoughtSearchResults({
  className,
  children,
  ...props
}: ChainOfThoughtSearchResultsProps) {
  return (
    <div
      className={cn("mt-2 flex flex-wrap gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Individual Search Result
interface ChainOfThoughtSearchResultProps
  extends React.ComponentPropsWithoutRef<typeof Badge> {}

export function ChainOfThoughtSearchResult({
  className,
  variant = "secondary",
  ...props
}: ChainOfThoughtSearchResultProps) {
  return (
    <Badge
      variant={variant}
      className={cn("text-xs", className)}
      {...props}
    />
  );
}

// Content wrapper
interface ChainOfThoughtContentProps
  extends React.ComponentPropsWithoutRef<typeof CollapsibleContent> {}

export function ChainOfThoughtContent({
  className,
  children,
  ...props
}: ChainOfThoughtContentProps) {
  return (
    <CollapsibleContent
      className={cn(
        "space-y-2 pt-3 animate-in fade-in-0 slide-in-from-top-1",
        className
      )}
      {...props}
    >
      {children}
    </CollapsibleContent>
  );
}

// Image component
interface ChainOfThoughtImageProps extends React.ComponentPropsWithoutRef<"div"> {
  caption?: string;
}

export function ChainOfThoughtImage({
  caption,
  className,
  children,
  ...props
}: ChainOfThoughtImageProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="overflow-hidden rounded-lg border border-neutral-200">
        {children}
      </div>
      {caption && (
        <p className="text-xs text-neutral-600 text-center">{caption}</p>
      )}
    </div>
  );
}
