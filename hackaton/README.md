# StreamFlix

A React Native streaming app with Tinder-like swipe functionality for discovering shows and movies.

## Features

- User authentication
- Tinder-like swipe interface for show recommendations
- Personalized watchlist
- User preferences tracking
- Modern and intuitive UI

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android development)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd streamflix
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Run on your preferred platform:
- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Scan the QR code with Expo Go app on your physical device

## Project Structure

```
streamflix/
├── app/
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── LoginScreen.jsx
│   │   ├── ProfileScreen.jsx
│   │   └── WatchlistScreen.jsx
│   └── app.jsx
├── assets/
├── package.json
└── README.md
```

## Usage

1. Launch the app and log in with your credentials
2. On the home screen, swipe right on shows you like to add them to your watchlist
3. Swipe left on shows you're not interested in
4. View your watchlist and profile in the respective tabs
5. Your preferences are automatically tracked to provide better recommendations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 