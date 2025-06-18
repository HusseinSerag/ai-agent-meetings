# 🧐 AI Agent Meetings

> Next-gen AI-powered meetings with real-time agents, streaming, and deep integrations.
> Built with bleeding-edge tech: Next.js 15, React 19, Tailwind v4, and more.

---

## ✨ Overview

**AI Agent Meetings** is a futuristic video conferencing platform that augments your calls with real-time AI agents. From live transcription to instant summaries, this app leverages powerful tools like OpenAI, Stream, Inngest, and more to transform the way you meet.

---

## 🔑 Key Features

| Feature                        | Description                                                                |
| ------------------------------ | -------------------------------------------------------------------------- |
| 🤖 **AI-Powered Video Calls**  | Invite custom AI agents to join, listen, and assist live in real-time.     |
| 🧠 **Custom Real-Time Agents** | Train agents to act as note-takers, assistants, or expert advisors.        |
| 📞 **Stream Video SDK**        | Smooth, low-latency video powered by [getstream.io](https://getstream.io). |
| 💬 **Stream Chat SDK**         | Live chat integrated directly into the call room.                          |
| 📝 **Summaries & Transcripts** | Automatic AI-generated call notes & searchable transcripts.                |
| 📂 **Meeting History**         | View past meetings, recordings, and summaries anytime.                     |
| 🔍 **Transcript Search**       | Find key moments in your meetings with powerful full-text search.          |
| 📺 **Video Playback**          | Watch recorded sessions directly in the app.                               |
| 💬 **AI Meeting Q\&A**         | Ask questions post-meeting and get answers from the transcript.            |
| 🧠 **OpenAI Integration**      | Powered by GPT for summaries, Q\&A, and natural language understanding.    |
| 💳 **Polar Subscriptions**     | Monetize with built-in subscription support.                               |
| 🔐 **Better Auth**             | Secure login with Clerk/Auth.js (or your provider of choice).              |
| 📱 **Mobile Responsive**       | Fully optimized experience across all screen sizes.                        |
| 🌐 **Built with Next.js 15**   | Future-ready server components & streaming UI.                             |
| 🎨 **Tailwind v4 + Shadcn/ui** | Clean, modern design with headless UI components.                          |
| ⚙️ **Inngest Background Jobs** | Reliable async tasks and event-driven job orchestration.                   |

---

## 🧰 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/), [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **AI**: [OpenAI API](https://platform.openai.com/)
- **Video & Chat**: [Stream Video & Chat SDKs](https://getstream.io/)
- **Jobs**: [Inngest](https://www.inngest.com/)
- **Auth**: [Clerk](https://clerk.com/) or [NextAuth.js](https://next-auth.js.org/)
- **Payments**: [Polar](https://www.polar.sh/) for subscription support
- **State/Data**: [tRPC](https://trpc.io/), [React Query](https://tanstack.com/query)
- **Database**: Drizzle ORM + PostgreSQL
- **Storage**: [UploadThing](https://uploadthing.com/) or custom

---

## 📦 Getting Started

> Clone & run the project locally.

```bash
git clone https://github.com/HusseinSerag/ai-agent-meetings.git
cd ai-agent-meetings
pnpm install
pnpm dev
```

> ✨ You’ll need environment variables for:

- OpenAI
- Stream (Video + Chat)
- Clerk or Auth provider
- Inngest
- Polar (for subscriptions)
- PostgreSQL (e.g. via Neon or Supabase)

---

## 📁 Project Structure

```
apps/
  web/             → Main Next.js 15 frontend
  api/             → Server routes, background jobs, and API handlers
  trpc/            → Type-safe backend logic shared across client/server
  components/      → Shadcn-based reusable UI components
  agents/          → AI logic, real-time agent handlers
```

---

## ⚒️ TODO / In Progress

- [ ] ARIA/accessibility improvements
- [ ] Custom agent training interface
- [ ] Real-time multi-agent support
- [ ] Polar webhook integration
- [ ] Usage analytics dashboard

---

## 💬 Feedback & Contributions

Pull requests and issues are welcome!
For major feature suggestions, please [open a discussion](https://github.com/HusseinSerag/ai-agent-meetings/discussions).

---

## 🧠 Author

**[@HusseinSerag](https://github.com/HusseinSerag)** – building powerful AI-first user experiences.

---

## 📝 License

MIT ©MIT \xa9 Hussein Serag
