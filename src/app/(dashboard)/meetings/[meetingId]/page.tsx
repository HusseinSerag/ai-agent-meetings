interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}
export default async function SingleMeetingPage({ params }: Props) {
  const { meetingId } = await params;
  return <div>{meetingId}</div>;
}
