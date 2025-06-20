import { ResponsiveDialog } from "@/components/responsiveDialog";

import { MeetingGetSingle } from "../../types";
import { MeetingsForm } from "./MeetingForm";
interface UpdateSingleMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: MeetingGetSingle;
}

export function UpdateSingleMeetingDialog({
  onOpenChange,
  open,
  initialValues,
}: UpdateSingleMeetingDialogProps) {
  return (
    <ResponsiveDialog
      title="Edit Meeting"
      description="Edit meeting details"
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingsForm
        defaultValues={initialValues}
        onSuccess={() => {
          onOpenChange(false);
        }}
        onCancel={() => {
          onOpenChange(false);
        }}
      />
    </ResponsiveDialog>
  );
}
