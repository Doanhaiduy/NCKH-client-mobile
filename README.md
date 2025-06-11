# NTU Student App

This is a React Native mobile application built with Expo for NTU students, providing features like campus navigation, notifications, and more. The app supports both iOS and Android platforms.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **Yarn** or **npm**: Package manager
- **Expo CLI**: Install globally using `npm install -g expo-cli`
- **EAS CLI**: Install globally using `npm install -g eas-cli`
- **Android Studio** (for Android development/emulation)
- **Xcode** (for iOS development/emulation, macOS only)
- A code editor like **VS Code**

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Doanhaiduy/NCKH-client-mobile ntu-student
   cd ntu-student
   ```
2. **Install dependencies**:

   ```bash
   yarn install
   ```

   or

   ```bash
   npm install
   ```
3. **Set up environment**:

   - Create a `.env` file in the root directory if required (refer to project documentation for environment variables).
   - Ensure you have the necessary API keys or configurations (e.g., Mapbox for `@rnmapbox/maps`).

## Running the App

### Development Mode

To run the app in development mode with hot reloading:

1. Start the Expo development server:

   ```bash
   yarn start
   ```

   or

   ```bash
   npm start
   ```
2. Open the app:

   - **iOS**: Scan the QR code with the Expo Go app or run on a simulator using `yarn ios`.
   - **Android**: Scan the QR code with the Expo Go app or run on an emulator using `yarn android`.
   - **Web**: Run `yarn web` to open the app in a browser.

### Production Mode

To run the app in production mode (no dev tools):

```bash
yarn prod
```

## Building the App

### Android

1. **Development Build**:

   ```bash
   yarn build-android-dev
   ```

   This creates a development build with debugging capabilities.
2. **Production Build**:

   ```bash
   yarn build-android
   ```

   This generates a production-ready APK or AAB.
3. **Submit to Google Play**:

   ```bash
   yarn submit
   ```

### iOS

1. **Development Build**:

   ```bash
   yarn build-ios-dev
   ```

   This creates a development build for testing on iOS devices/simulators.
2. **Production Build**:
   Requires an Apple Developer account and proper provisioning profiles configured in EAS.

### Over-the-Air Updates

To push updates to the production branch:

```bash
yarn update
```

## Code Formatting

The project uses **Prettier** for code formatting. To format code automatically:

```bash
yarn beautiful
```

This runs Prettier on staged files before committing, enforced by **Husky** and **lint-staged**.

## Project Structure

- **src/**: Contains the source code (components, screens, utilities, etc.).
- **app/**: Expo Router configuration and entry points.
- **assets/**: Images, fonts, and other static resources.

## Dependencies

Key dependencies include:

- **Expo**: Core framework for building and running the app.
- **React Native**: UI framework.
- **Expo Router**: File-based navigation.
- **React Navigation**: Drawer and stack navigation.
- **Mapbox**: For campus maps and geolocation.
- **React Query**: Data fetching and caching.
- **Redux Toolkit**: State management.
- **Nativewind**: Tailwind CSS for styling.

For a full list, see `package.json`.

## Troubleshooting

- **Metro Bundler Issues**: Clear the cache with `yarn start --reset-cache`.
- **Build Failures**: Ensure EAS CLI is authenticated (`eas login`) and check your `eas.json` configuration.
- **Mapbox Issues**: Verify your Mapbox access token is correctly set in the environment.
- **Font Loading Errors**: Ensure fonts are preloaded correctly using `expo-font`.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is private and intended for internal use by NTU students. Contact the project maintainers for access or inquiries.
