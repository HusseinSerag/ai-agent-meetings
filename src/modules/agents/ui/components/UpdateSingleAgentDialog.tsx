import { ResponsiveDialog } from "@/components/responsiveDialog";
import { AgentForm } from "./AgentForm";
import { AgentGetSingle } from "../../types";
interface UpdateSingleAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: AgentGetSingle;
}

export function UpdateSingleAgentDialog({
  onOpenChange,
  open,
  initialValues,
}: UpdateSingleAgentDialogProps) {
  return (
    <ResponsiveDialog
      title="Edit Agent"
      description="Edit agent details"
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
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
