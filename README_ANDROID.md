# Sara Android App Setup

This project has been configured with **Capacitor** to run as a native Android app.

## Prerequisites
1. **Android Studio** installed on your computer.
2. **Node.js** and **npm** installed.

## How to build the Android App

1. **Export the Project**: Use the settings menu in AI Studio to "Export to ZIP".
2. **Extract and Install**: Open a terminal in the project folder and run:
   ```bash
   npm install
   ```
3. **Build the Web App**:
   ```bash
   npm run build
   ```
4. **Sync with Android**:
   ```bash
   npx cap sync
   ```
5. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```
   *Alternatively, open the `android` folder directly in Android Studio.*

6. **Run/Build APK**:
   In Android Studio, click the **Play** button to run on an emulator/device, or go to **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate the installer file.

## Features Enabled
- **Microphone Access**: Permissions for voice interaction are pre-configured.
- **Internet Access**: Required for Gemini AI responses.
- **WhatsApp Integration**: Deep links are configured to work with the native WhatsApp app.
