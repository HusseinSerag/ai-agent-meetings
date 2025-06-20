import { useForm } from "react-hook-form";
import { MeetingGetSingle } from "../../types";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { meetingsInsertSchema } from "../../schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { CommandSelect } from "@/components/CommandSelect";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { NewAgentDialog } from "@/modules/agents/ui/components/NewAgentDialog";

interface MeetingsFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  defaultValues?: MeetingGetSingle;
}
export function MeetingsForm({
  defaultValues,
  onCancel,
  onSuccess,
}: MeetingsFormProps) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      async onSuccess(data) {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        await queryClient.invalidateQueries(
          trpc.dashboard.getData.queryOptions({})
        );
        // TODO: invalidate free tier usage
        onSuccess?.(data.meetingId);
      },
      onError(error) {
        if (error.data?.code === "FORBIDDEN") {
          router.push("/upgrade");
          return;
        }
        toast.error(error.message);
      },
    })
  );
  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");
  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    })
  );
  const editMeetings = useMutation(
    trpc.meetings.update.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        await queryClient.invalidateQueries(
          trpc.dashboard.getData.queryOptions({})
        );
        if (defaultValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({
              id: defaultValues.id,
            })
          );
        }
        onSuccess?.();
      },
      onError(error) {
        if (error.data?.code === "FORBIDDEN") {
          router.push("/upgrade");
          return;
        }
        toast.error(error.message);
      },
    })
  );

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      agentId: defaultValues?.agentId ?? "",
    },
  });
  const isEditing = !!defaultValues?.id;
  const isPending = createMeeting.isPending || editMeetings.isPending;

  function onSubmit(values: z.infer<typeof meetingsInsertSchema>) {
    if (isPending) return;
    if (isEditing) {
      editMeetings.mutate({
        ...values,
        id: defaultValues.id,
      });
    } else {
      createMeeting.mutate(values);
    }
  }
  return (
    <>
      <NewAgentDialog
        open={openNewAgentDialog}
        onOpenChange={setOpenNewAgentDialog}
      />
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. English Vocab Consultations"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="agentId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agents</FormLabel>
                <FormControl>
                  <CommandSelect
                    error={agents.error?.message}
                    isLoadingOptions={agents.isPending}
                    options={(agents.data?.items ?? []).map((agent) => ({
                      id: agent.id,
                      value: agent.id,
                      children: (
                        <div className="flex items-center gap-x-2">
                          <GeneratedAvatar
                            seed={agent.name}
                            variant="botttsNeutral"
                            className="border size-6"
                          />
                          <span>{agent.name}</span>
                        </div>
                      ),
                    }))}
                    onSelect={field.onChange}
                    onSearch={setAgentSearch}
                    value={field.value}
                    placeholder="Select an agent"
                  />
                </FormControl>
                <FormDescription>
                  Not found what you&apos;re looking for?{" "}
                  <button
                    onClick={() => setOpenNewAgentDialog(true)}
                    className="text-primary hover:underline"
                    type="button"
                  >
                    Create an Agent
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-x-2">
            {onCancel && (
              <Button
                variant={"ghost"}
                disabled={isPending}
                type="button"
                onClick={() => onCancel()}
              >
                Cancel
              </Button>
            )}
            <Button disabled={isPending} type="submit">
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
