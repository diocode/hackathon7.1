export default {
  name: 'StreamFlix',
  slug: 'streamflix',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  splash: {
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
      backgroundColor: '#141414'
    }
  },
  web: {
    backgroundColor: '#141414',
    build: {
      babel: {
        include: ['@react-native-community/datetimepicker']
      }
    }
  }
}; 