import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.splashcamper.app",
  appName: "SplashCamper",
  webDir: "out",
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1E2337",
      androidSplashResourceName: "splash",
    },
    CapacitorHttp: {
      enabled: true,
    },
    Network: {
      opportunistic: true,
    },
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
