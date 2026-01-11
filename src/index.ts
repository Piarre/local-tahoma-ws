import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { prettyJSON } from "hono/pretty-json";

import { debugRoute, discoveryRoute } from "@/routes";

const app = new Hono();

app.use(logger());
app.use(
  "*",
  cors({
    origin: "*",
  }),
);
app.use(poweredBy());
app.use(prettyJSON());

app.get("/", (c) => c.json({ message: "Hello World" }));

app.route("/debug", debugRoute);
app.route("/discovery", discoveryRoute);

export default {
  port: 2025,
  hostname: "0.0.0.0",
  fetch: app.fetch,
};
