# React Native Template

## When to Use
Use this template when the user wants a mobile app (iOS/Android).

## Template Contents

### package.json
```json
{
  "name": "[project-name]",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "build:android": "cd android && ./gradlew assembleDebug",
    "build:ios": "xcodebuild -workspace ios/[project-name].xworkspace -scheme [project-name] -configuration Debug -sdk iphonesimulator -arch x86_64",
    "lint": "eslint .",
    "unit": "jest",
    "watch": "jest --watch",
    "types": "tsc --noEmit"
  },
  "dependencies": {
    "react": "18.3.1",
    "react-native": "0.76.6",
    "react-native-paper": "^5.0.0",
    "@react-navigation/native": "^6.0.0",
    "@react-navigation/native-stack": "^6.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@babel/preset-env": "^7.25.3",
    "@babel/runtime": "^7.25.0",
    "@react-native-community/cli": "15.0.1",
    "@react-native-community/cli-platform-android": "15.0.1",
    "@react-native-community/cli-platform-ios": "15.0.1",
    "@react-native/babel-preset": "0.76.6",
    "@react-native/eslint-config": "^0.76.6",
    "@react-native/metro-config": "0.76.6",
    "@react-native/typescript-config": "0.76.6",
    "@types/react": "^18.2.6",
    "@types/react-test-renderer": "^18.0.0",
    "babel-jest": "^29.7.0",
    "eslint": "^8.19.0",
    "jest": "^29.7.0",
    "prettier": "2.8.8",
    "react-test-renderer": "18.3.1",
    "typescript": "5.0.4"
  }
}
```

### App.tsx
```tsx
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>[Project Name]</Text>
        <Text style={styles.subtitle}>Welcome to the mobile app</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
```

## Agent Instructions

When the frontend agent uses this template:
1. Copy the template structure to the project root
2. Replace `[Project Name]` with the actual project name
3. Install with `npm install`
4. For iOS: `cd ios && pod install && cd ..`
5. Run with `npm run start` then `npm run ios` or `npm run android`
