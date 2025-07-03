// import ip from "@arcjet/ip";
// import arcjet, {
//   type ArcjetDecision,
//   type BotOptions,
//   type EmailOptions,
//   type ProtectSignupOptions,
//   type SlidingWindowRateLimitOptions,
//   detectBot,
//   protectSignup,
//   shield,
//   slidingWindow,
// } from "@arcjet/next";

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth.handler);

// const emailOptions = {
//   mode: "LIVE",
//   block: ["DISPOSABLE", "INVALID"],
// } satisfies EmailOptions;

// const botOption = {
//   mode: "LIVE",
//   allow: [],
// } satisfies BotOptions;

// const rateLimitOptions = {
//   mode: "LIVE",
//   interval: "5m",
//   max: 5,
// } satisfies SlidingWindowRateLimitOptions<[]>;

// export { emailOptions, rateLimitOptions, botOption };
