import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'ai.dermascope.app',
  appName: 'DermaScope AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    Camera: {
      // Camera permissions for wound capture
      presentationStyle: 'fullScreen',
    },
  },
}

export default config
