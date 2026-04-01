import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { rootRouter } from "./routes";
import { logger } from "./shared/logger";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.allowedOrigins,
      credentials: true
    })
  );
  app.use(express.json());
  app.use(rootRouter);

  const miniAppDist = path.resolve(process.cwd(), "dist/miniapp");
  if (fs.existsSync(miniAppDist)) {
    logger.info("Serving built mini app", { miniAppDist });
    app.use(express.static(miniAppDist));

    app.get("*", (_req, res) => {
      res.sendFile(path.join(miniAppDist, "index.html"));
    });
  }

  return app;
}
