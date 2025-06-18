import { ResponsiveDialog } from "@/components/responsiveDialog";
import { AgentForm } from "./AgentForm";
interface NewAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewAgentDialog({ onOpenChange, open }: NewAgentDialogProps) {
  return (
    <ResponsiveDialog
      title="New Agent"
      description="Create a new agent"
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
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
