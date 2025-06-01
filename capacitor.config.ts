import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.splashcamper.app",
  appName: "SplashCamper",
  webDir: ".next",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1E2337",
      androidSplashResourceName: "splash",
      showSpinner: false,
      androidSpinnerStyle: "large",
      splashFullScreen: true,
      splashImmersive: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
    Network: {
      opportunistic: true,
    },
    App: {
      launchUrl: "https://localhost",
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    loggingBehavior: "debug",
    buildOptions: {
      keystorePath: "splash-keystore.jks",
      keystoreAlias: "splash-key",
    },
  },
};

export default config;
