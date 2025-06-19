import { ResponsiveDialog } from "@/components/responsiveDialog";
import { Button } from "@/components/ui/button";
import { JSX, useState } from "react";

export function useConfirm(
  title: string,
  description: string
): [() => JSX.Element, () => Promise<unknown>] {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);
  function confirm() {
    return new Promise((res) => {
      setPromise({
        resolve: res,
      });
    });
  }
  function handleClose() {
    setPromise(null);
  }
  function handleConfirm() {
    promise?.resolve(true);
    handleClose();
  }
  function handleCancel() {
    promise?.resolve(false);
    handleClose();
  }

  function ConfirmationDialog() {
    return (
      <ResponsiveDialog
        open={promise !== null}
        onOpenChange={handleClose}
        description={description}
        title={title}
      >
        <div className="pt-4 w-full flex-col-reverse lg:flex-row gap-y-2 flex gap-x-2 items-center justify-end">
          <Button
            onClick={handleCancel}
            className="w-full lg:w-auto"
            variant="outline"
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="w-full lg:w-auto">
            Confirm
          </Button>
        </div>
      </ResponsiveDialog>
    );
  }
  return [ConfirmationDialog, confirm];
}
