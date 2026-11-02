import "dotenv/config";
import dns from "node:dns";
import mongoose from "mongoose";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

if (process.env.DNS_SERVERS) {
  const servers = process.env.DNS_SERVERS.split(",").map((server) => server.trim()).filter(Boolean);
  if (servers.length > 0) dns.setServers(servers);
}

async function startServer() {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`SkillBridge API running on port ${PORT}`);
  });

  const shutdown = async () => {
    server.close();
    await mongoose.disconnect();
    process.exit(0);
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

startServer().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
