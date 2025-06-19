import { ReactNode, useState } from "react";
import {
  AlertCircleIcon,
  ChevronsUpDownIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "./ui/command";

interface Props {
  options: Array<{ id: string; value: string; children: ReactNode }>;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value: string;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
  isLoadingOptions?: boolean;
  error?: string;
}

export function CommandSelect({
  onSelect,
  options,
  value,
  className,
  isSearchable,
  isLoadingOptions,
  onSearch,
  error,
  placeholder = "Select an option",
}: Props) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
          onSearch?.("");
        }}
        type="button"
        variant={"outline"}
        className={cn(
          "h-9 justify-between font-normal px-2",
          !selectedOption && "text-muted-foreground",
          className
        )}
      >
        <div>{selectedOption?.children ?? placeholder}</div>
        <ChevronsUpDownIcon />
      </Button>
      <CommandResponsiveDialog
        shouldFilter={!onSearch}
        open={open}
        onOpenChange={setOpen}
      >
        <CommandInput placeholder="Search..." onValueChange={onSearch} />
        {error && (
          <div className="flex items-center gap-x-2 py-4 justify-center">
            <AlertCircleIcon className="size-5 text-red-500" />
            <span className="text-sm font-medium text-red-600">
              {error ?? "Error loading options"}
            </span>
          </div>
        )}
        {!error && (
          <CommandList>
            {!isLoadingOptions && (
              <CommandEmpty>
                <span className="text-muted-foreground text-sm">
                  No Options found
                </span>
              </CommandEmpty>
            )}
            {isLoadingOptions && (
              <div className="px-2 py-4 flex justify-center items-center">
                <LoaderCircleIcon className="animate-spin text-muted-foreground size-6" />
              </div>
            )}
            {!isLoadingOptions &&
              options.map((option) => (
                <CommandItem
                  key={option.id}
                  onSelect={() => {
                    onSelect(option.value);
                    setOpen(false);
                  }}
                >
                  {option.children}
                </CommandItem>
              ))}
          </CommandList>
        )}
      </CommandResponsiveDialog>
    </>
  );
}
