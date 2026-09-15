import app from "../server.ts";

export default function handler(req: any, res: any) {
  // Normalize req.url so Express router receives /api/... path correctly
  const rawUrl = req.url || "/";
  if (!rawUrl.startsWith("/api") && !rawUrl.startsWith("/assets")) {
    req.url = `/api${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
  }
  return app(req, res);
}
