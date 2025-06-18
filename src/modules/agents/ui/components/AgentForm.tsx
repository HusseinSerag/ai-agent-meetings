import { useForm } from "react-hook-form";
import { AgentGetSingle } from "../../types";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agentsInsertSchema } from "../../schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultValues?: AgentGetSingle;
}
export function AgentForm({
  defaultValues,
  onCancel,
  onSuccess,
}: AgentFormProps) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      async onSuccess(data) {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions());
        if (defaultValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({
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

  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      instructions: defaultValues?.instructions ?? "",
      name: defaultValues?.name ?? "",
    },
  });
  const isEditing = !!defaultValues?.id;
  const isPending = createAgent.isPending;

  function onSubmit(values: z.infer<typeof agentsInsertSchema>) {
    if (isPending) return;
    if (isEditing) {
    } else {
      createAgent.mutate(values);
    }
  }
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <GeneratedAvatar
          variant="botttsNeutral"
          className="border size-16"
          seed={form.watch("name")}
        />
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Language Instructor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="You are an english instructor that can help with listening assignments"
                  {...field}
                />
              </FormControl>
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
  );
}
