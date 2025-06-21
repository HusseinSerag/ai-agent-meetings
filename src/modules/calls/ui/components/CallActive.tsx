import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";
import Image from "next/image";
import Link from "next/link";

interface Props {
  onleave(): void;
  meetingName: string;
}
export function CallActive({ meetingName, onleave }: Props) {
  return (
    <div className="flex flex-col justify-between p-4 min-h-screen text-white">
      <div className="bg-[#101213] rounded-full p-4 flex gap-4 items-center">
        <Link
          href={"/"}
          className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit "
        >
          <Image src={"/logo.svg"} width={22} height={22} alt="Logo" />
        </Link>
        <h4 className="text-base">{meetingName}</h4>
      </div>
      <SpeakerLayout />
      <div className="bg-[#101213] rounded-full px-4">
        <CallControls onLeave={onleave} />
      </div>
    </div>
  );
}
