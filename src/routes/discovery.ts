import Bonjour, { type Service } from "bonjour-service";
import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import { Hono } from "hono";
import { podsTable } from "~/db/schema";

const discoveryRoute = new Hono();
const bonjour = new Bonjour();
const discoveredDevices = new Map<string, Service>();

const browser = bonjour.find({ type: "kizboxdev", protocol: "tcp" });

const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle({ client });

browser.on("up", async (service: Service) => {
  await db.insert(podsTable).values({
    name: service.name,
    host: service.host,
    pin: service.txt?.gateway_pin || "",
    txt: JSON.stringify(service.txt),
  });
});

browser.on("down", (service: Service) => {
  discoveredDevices.delete(service.name);
});

discoveryRoute.get("/devices", async (c) => {
  const devices = await db.select().from(podsTable);

  return c.json(devices);
});

discoveryRoute.post("/refresh", (c) => {
  discoveredDevices.clear();
  browser.stop();
  browser.start();
  return c.json({ message: "Discovery refreshed" });
});

export default discoveryRoute;
