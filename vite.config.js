import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// In production, Vercel serves api/chat.js as a serverless function.
// In dev, this middleware runs the same handler so `npm run dev` just works.
const devApi = () => ({
  name: "dev-api",
  configureServer(server) {
    server.middlewares.use("/api/chat", async (req, res) => {
      const { default: handler } = await server.ssrLoadModule("/api/chat.js");
      handler(req, res);
    });
  },
});

export default defineConfig(({ mode }) => {
  // Server-side only: non-VITE_ vars are never exposed to the browser bundle.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return { plugins: [react(), devApi()], base: "/" };
});
