# Connekt handoff

Read this first, then inspect the repo. The repo is the source of truth for code.

## Stage
UI-first prototype. No server. Everything below runs on local state and sample data.

## Stack
- Expo SDK 58, React Native 0.88, React 19, TypeScript (strict), npm.
- Navigation: React Navigation (native stack + custom floating tab bar).
- Animation: Reanimated. Blur: expo-blur. Audio: expo-audio. Video: expo-video.
- Package id: com.thekami.connekt. Single branch: main.

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
- features/: chats, conversation, search, calls, contacts, newchat, requests, groups,
  settings, scan, media.
- data/sample/: sample data only. types/ and utils/: shared.
- Chat state is one reducer in features/chats/chatsState.ts (tested).

## Done
Floating tab bar, chats list (pin max 3), conversation (bubbles, reactions, reply, copy,
delete, blur menu, big emoji), attachments (photo, video, camera, file, voice, location),
search, calls UI, settings, permissions screen with explain-first flow, QR scan, new chat,
message requests, block (local), contact info, groups (create, info, leave).

## Not real yet
Accounts, login, server, real messaging, delivery or read receipts, calls, push
notifications, end-to-end encryption, opening files, My QR code, username lookup.
Block, requests and leave-group are saved on this device only.

## Unverified or known gaps
- Group info and contact info have no edit actions (rename, add or remove members).
- Message list is not virtualised beyond FlatList defaults; not tested with thousands of messages.
- Voice playback uses one player per voice message.
- App icon and splash are still Expo defaults.
- Photos and videos permission is declared but the system picker does not need it.
  Remove it before a Play Store release (Google restricts READ_MEDIA_*).
- NFC is only detected, not used.

## Rules from the master prompt
Never fake messaging, auth, calls or encryption. Do not add a backend without approval.
No APKs as workflow artifacts (Release assets only). Keep changes small and verified.

## Next
1. Onboarding and login screens (last, before a backend exists they stay non-functional).
2. Backend decision brief (auth, message delivery, storage, cost, E2EE plan).
3. Play Store prep: icon, splash, permissions cleanup, store listing.
