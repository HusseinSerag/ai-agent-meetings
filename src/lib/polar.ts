import { Polar } from "@polar-sh/sdk";
export const polarClientInstance = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});
