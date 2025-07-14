// import "server-only";

import { Resend } from "resend";

export const resend = new Resend(process.env.RESENF_API_KEY);
