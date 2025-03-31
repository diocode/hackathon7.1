export default {
  name: 'StreamFlix',
  slug: 'streamflix',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#141414'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#141414'
    }
  },
  web: {
    favicon: './assets/favicon.png',
    backgroundColor: '#141414',
    build: {
      babel: {
        include: ['@react-native-community/datetimepicker']
      }
    }
  }
}; 