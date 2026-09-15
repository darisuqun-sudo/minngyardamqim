import app from "../server";

export default function handler(req: any, res: any) {
  const matched = req.headers["x-matched-path"] || req.headers["x-vercel-matched-path"];
  if (typeof matched === "string" && matched.startsWith("/api")) {
    req.url = matched;
  } else if (typeof req.url === "string" && !req.url.startsWith("/api")) {
    req.url = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
  }
  return app(req, res);
}
