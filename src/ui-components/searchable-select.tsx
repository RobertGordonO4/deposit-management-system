import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "../lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  error?: boolean;
  disabled?: boolean;
}

/**
 * SearchableSelect - A performant select for large option lists where the basic radix component performed very poorly.
 * Uses cmdk library for fast client-side filtering
 * Styled to match Radix UI Select appearance
 */
export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  error,
  disabled,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Custom filter: simple case-insensitive substring match (not fuzzy)
  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    const searchLower = search.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(searchLower));
  }, [options, search]);

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  // Close on escape
  React.useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open]);

  const handleSelect = React.useCallback(
    (optionValue: string) => {
      onValueChange(optionValue);
      setOpen(false);
      setSearch("");
    },
    [onValueChange]
  );

  const handleTriggerClick = React.useCallback(() => {
    if (!disabled) {
      setOpen((prev) => !prev);
      if (!open) {
        // Focus the search input when opening
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  }, [disabled, open]);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button - styled like Radix SelectTrigger */}
      <button
        type="button"
        onClick={handleTriggerClick}
        disabled={disabled}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none",
          "border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500",
          !selectedOption && "text-muted-foreground"
        )}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon className="size-4 opacity-50 shrink-0" />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md",
            "animate-in fade-in-0 zoom-in-95"
          )}
        >
          <CommandPrimitive
            className="flex h-full w-full flex-col overflow-hidden rounded-md"
            shouldFilter={false}
          >
            {/* Search input */}
            <div className="flex items-center border-b px-3">
              <CommandPrimitive.Input
                ref={inputRef}
                value={search}
                onValueChange={setSearch}
                placeholder={searchPlaceholder}
                className="flex h-9 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            {/* Options list */}
            <CommandPrimitive.List className="max-h-[200px] overflow-y-auto p-1">
              {filteredOptions.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {emptyText}
                </div>
              )}

              {filteredOptions.map((option) => (
                <CommandPrimitive.Item
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option.value)}
                  className={cn(
                    "relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none",
                    "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && (
                    <span className="absolute right-2 flex size-3.5 items-center justify-center">
                      <CheckIcon className="size-4" />
                    </span>
                  )}
                </CommandPrimitive.Item>
              ))}
            </CommandPrimitive.List>
          </CommandPrimitive>
        </div>
      )}
    </div>
  );
}
