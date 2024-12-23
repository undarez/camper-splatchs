import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.splashcamper.app",
  appName: "SplashCamper",
  webDir: "out",
  server: {
    url: "https://splashcamper.vercel.app",
    cleartext: true,
  },
};

export default config;
