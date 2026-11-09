# Myth handoff

Read this first, then inspect the repo. The repo is the source of truth for code.

## Stage
UI-first prototype. Myth branding, a persisted onboarding introduction, and empty production
startup state are in place. There is no server; local-only features must not imply server behavior.

## Stack
- Expo SDK 58, React Native 0.88, React 19, TypeScript (strict), npm.
- Navigation: React Navigation (native stack + custom floating tab bar).
- Animation: Reanimated. Blur: expo-blur. Audio: expo-audio. Video: expo-video.
- Android package and iOS bundle id: com.myth.thekami.
- Navigation remains React Navigation (no Expo Router migration is planned).

## Build and release (automatic)
- Push to main runs .github/workflows/android-release.yml:
  tests, tsc, expo prebuild, assembleRelease (arm64), sign with our key, GitHub Release.
- Version is chosen in CI: v0.0.1 ... v0.0.9, then v1.0.1 ... (one step per release).
  versionCode = GitHub run number. Markdown-only pushes do not trigger a build.
- Secrets in the repo: KEYSTORE_BASE64, KEYSTORE_PASSWORD, KEY_PASSWORD, KEY_ALIAS.
- The keystore lives only at ~/.keys/connekt.jks on the dev phone. Keep a backup elsewhere.
  Losing it means installed users cannot update.

## Structure (src/)
- core/: theme tokens, navigation, permissions, ErrorBoundary.
- components/: ui, layout, feedback, navigation (floating tab bar).
- features/: onboarding, chats, conversation, search, calls, contacts, newchat, requests,
  groups, settings, scan, media.
- data/sample/: sample data only. types/ and utils/: shared.
- Chat state is one reducer in features/chats/chatsState.ts (tested).
- Sample fixtures remain under data/sample/ for tests and previews but are not seeded at app launch.

## Done
Myth design palette and M app icon, persisted five-scene onboarding, empty production startup,
floating tab bar, chats list (pin max 3), conversation (bubbles, reactions, reply, copy,
delete, blur menu, big emoji), attachments (photo, video, camera, file, voice, location),
search, calls UI, settings, permissions screen with explain-first flow, QR scan, new chat,
message requests, block (local), contact info, groups (create, info, leave).

## Not real yet
Accounts, login, server, real messaging, delivery or read receipts, calls, push
notifications, end-to-end encryption, opening files, server-backed QR identity, username lookup.
Block, requests and leave-group are saved on this device only.

## Unverified or known gaps
- Group info and contact info have no edit actions (rename, add or remove members).
- Message list is not virtualised beyond FlatList defaults; not tested with thousands of messages.
- Voice playback uses one player per voice message.
- Sign-in and account creation are clearly marked unavailable until a real authentication service exists.
- Photos and videos permission is declared but the system picker does not need it.
  Remove it before a Play Store release (Google restricts READ_MEDIA_*).
- NFC is deferred; the app does not load `react-native-nfc-manager` at runtime. NFC requires a
  development build and a real feature before it can be enabled.
- Expo Go on Android does not support remote push notifications; use a development build for push.

## Rules from the master prompt
Never fake messaging, auth, calls or encryption. Do not add a backend without approval.
No APKs as workflow artifacts (Release assets only). Keep changes small and verified.

## Next
1. Redesign the inbox, message composer, workspace, and profile screens in controlled phases.
2. Build authentication and organization UI against explicitly defined service interfaces.
3. Backend decision brief (auth, message delivery, storage, cost, E2EE plan).
4. Play Store prep: permissions review, store listing, and native development-build validation.
