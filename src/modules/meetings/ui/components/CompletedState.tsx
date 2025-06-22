import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeetingGetSingle } from "../../types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  BookOpenTextIcon,
  ClockFadingIcon,
  FileTextIcon,
  FileVideoIcon,
  SparklesIcon,
} from "lucide-react";
import { TabsContent } from "@radix-ui/react-tabs";
import Markdown from "react-markdown";
import Link from "next/link";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Row } from "react-day-picker";
import { formatDuration } from "../../utils";
import { Transcript } from "./Transcript";
import { ChatProvider } from "./ChatProvider";

interface Props {
  data: MeetingGetSingle;
}
export function CompletedState({ data }: Props) {
  return (
    <div className="flex gap-y-4 flex-col">
      <Tabs defaultValue="summary">
        <div className="bg-white rounded-lg border px-3">
          <ScrollArea>
            <TabsList className="p-0 bg-background justify-start rounded-none h-13">
              <TabsTrigger
                value="summary"
                className="text-muted-foreground rounded-none data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary "
              >
                <BookOpenTextIcon />
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="transcript"
                className="text-muted-foreground rounded-none data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary "
              >
                <FileTextIcon />
                Transcript
              </TabsTrigger>
              <TabsTrigger
                value="recording"
                className="text-muted-foreground rounded-none data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary "
              >
                <FileVideoIcon />
                Recording
              </TabsTrigger>

              <TabsTrigger
                value="chat"
                className="text-muted-foreground rounded-none data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary "
              >
                <FileVideoIcon />
                Ask AI
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <TabsContent value="chat">
          <ChatProvider meetingId={data.id} meetingName={data.name} />
        </TabsContent>
        <TabsContent value="transcript">
          <Transcript meetingId={data.id} />
        </TabsContent>
        <TabsContent value="recording">
          <div className="bg-white rounded-lg border px-4 py-5">
            <video
              src={data.recordingUrl!}
              className="w-full rounded-lg"
              controls
            />
          </div>
        </TabsContent>
        <TabsContent value="summary">
          <div className="bg-white rounded-lg border">
            <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
              <h2 className="text-2xl font-medium capitalize">{data.name}</h2>
              <div className="flex gap-x-2 items-center">
                <Link
                  className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                  href={`/agents/${data.agent.id}`}
                >
                  <GeneratedAvatar
                    className="size-5"
                    seed={data.agent.name}
                    variant="botttsNeutral"
                  />
                  {data.agent.name}
                </Link>{" "}
                <p>{data.startedAt ? format(data.startedAt, "PPP") : ""}</p>
              </div>
              <div className="flex gap-x-2 items-center">
                <SparklesIcon className="size-4" />
                <p>General Summary</p>
              </div>
              <Badge
                variant="outline"
                className="flex items-center gap-x-2 [&>svg]:size-4"
              >
                <ClockFadingIcon className="text-blue-700" />
                {data.duration ? formatDuration(data.duration) : "no duration"}
              </Badge>
              <div>
                <Markdown
                  components={{
                    h1: (props) => (
                      <h1 className="text-2xl font-medium mb-6" {...props} />
                    ),
                    h2: (props) => (
                      <h2 className="text-2xl font-medium mb-6" {...props} />
                    ),
                    h3: (props) => (
                      <h3 className="text-2xl font-medium mb-6" {...props} />
                    ),
                    h4: (props) => (
                      <h4 className="text-2xl font-medium mb-6" {...props} />
                    ),
                    p: (props) => (
                      <p className="mb-6 leading-relaxed" {...props} />
                    ),
                    ul: (props) => (
                      <ul className="list-disc list-inside mb-6" {...props} />
                    ),
                    ol: (props) => (
                      <ol
                        className="list-decimal list-inside mb-6"
                        {...props}
                      />
                    ),
                    li: (props) => <li className="mb-1" {...props} />,
                    strong: (props) => (
                      <strong className="font-semibold" {...props} />
                    ),
                    code: (props) => (
                      <code
                        className="bg-gray-100 px-1 py-0.5 rounded"
                        {...props}
                      />
                    ),
                    blockquote: (props) => (
                      <blockquote
                        className="border-l-4 pl-4 italic my-4"
                        {...props}
                      />
                    ),
                  }}
                >
                  {data.summary}
                </Markdown>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
