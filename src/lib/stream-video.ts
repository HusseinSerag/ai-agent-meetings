import "server-only";
import { StreamClient } from "@stream-io/node-sdk";
export const streamVideo = new StreamClient(
  process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
  process.env.STREAM_VIDEO_SECRET_KEY!
);

async function startStorage() {
  try {
    await streamVideo.video.updateCallType({
      name: "default",
      external_storage: "storage",
    });
  } catch (e) {
    console.log(e);
  }
}
startStorage().catch(() => {});
