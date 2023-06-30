import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const ASSET_URL = process.env.BASE_URL || "";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
  base: ASSET_URL !== "" ? `${ASSET_URL}/frontend/dist` : "",
});
