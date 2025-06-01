import app from "../src/app";
import { createServer } from "@vercel/node";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Wrapper untuk Express agar jalan di Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const server = createServer(app);
  return server.emit("request", req, res);
}
