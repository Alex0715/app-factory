# APP_FACTORY.md

How to turn this repository into a brand new, independent app — step by
step. Follow this in order the first time; after that, most steps are a
one-line edit.

Target workflow: **Mac → VS Code/Cursor → Expo development → physical
Android device via Expo Go → EAS cloud build → Google Play.** No Android
Studio, Android SDK, or emulator is ever required.

---

## 0. Prerequisites (one-time, per machine)

- Node.js 20+
- An [Expo account](https://expo.dev) (free) - `npx expo login`
- The [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) app on a physical Android device
- An [EAS CLI](https://docs.expo.dev/eas-update/getting-started/) install: `npm install -g eas-cli`

No Android SDK, Gradle, or emulator install is needed at any point in this
workflow - EAS Build compiles native Android/iOS binaries in the cloud.

---

## 1. Clone the template into a new project

```bash
git clone <this-repo-url> ai-krishna        # example: a new "AI Krishna" app
cd ai-krishna
rm -rf .git && git init                     # start this app's own history
npm install
```

## 2. Rename the product

Edit **`product.config.ts`** - this is the single file most rebrands start
with:

```ts
export const productConfig = {
  appName: 'AI Krishna',
  shortName: 'Krishna',
  applicationId: 'com.yourcompany.aikrishna',
  slug: 'ai-krishna',
  scheme: 'aikrishna',
  version: '1.0.0',
  description: '...',
  supportEmail: 'support@yourcompany.com',
  urls: { privacyPolicy: '...', termsOfService: '...', website: '...' },
  apiBaseUrl: 'https://api.yourcompany.com',
  subscriptionProductIds: { monthly: '...', yearly: '...', lifetime: '...' },
  featureFlags: { ... },
} as const;
```

Verify it took effect:

```bash
npx expo config | head -20
```

You should see the new `name`, `slug`, and `scheme`.

## 3. Replace branding assets

Replace these files in `assets/` (keep the same filenames and dimensions):

- `icon.png` (1024x1024)
- `android-icon-foreground.png`, `android-icon-background.png`, `android-icon-monochrome.png` (adaptive icon layers)
- `splash-icon.png`
- `favicon.png` (web, optional)

## 4. Set the color theme

Edit `src/core/theme/colors.ts` - change the `palette` values and the
`lightColors`/`darkColors` mappings. Everything else in the app (buttons,
cards, top bars, the paywall) picks up the new palette automatically via
`useTheme()`. Adjust `src/core/theme/typography.ts` if the product needs a
different type scale.

## 5. Write the onboarding content

Edit `src/features/onboarding/onboardingContent.ts` - an array of
`{ key, title, description }` slides shown on first launch.

## 6. Build the product's actual feature

`src/features/home/HomeScreen.tsx` is a placeholder. This is where a new
product's real functionality goes - replace or extend it. Keep using
`src/core/ui` components and `useTheme()` so the new screens stay visually
consistent with the rest of the shell without extra work.

If the feature needs its own screens:

1. New directory under `src/features/<feature-name>/`.
2. New route file(s) under `app/`.
3. Add the route to `src/core/navigation/routes.ts`.

Everything else - onboarding, settings, about, privacy, feedback, paywall,
theming, offline handling, error boundaries - is already wired up and
usually needs no changes.

## 7. Configure the backend API (if the product has one)

- Set `apiBaseUrl` in `product.config.ts` (or override per-environment with
  `EXPO_PUBLIC_API_BASE_URL` - copy `.env.example` to `.env`).
- Never put a private API key in `EXPO_PUBLIC_*` vars, `product.config.ts`,
  or anywhere else in the client bundle - it ships inside the APK and can be
  extracted. If the product calls an LLM or other paid API, put that call
  behind your own backend and have the app call *your* backend instead.
- The client (`src/core/network/apiClient.ts`) already handles timeouts,
  retries, auth headers, and error mapping - point it at the new base URL
  and add typed request/response models next to the feature that uses them.

## 8. Configure subscriptions (if the product is paid)

1. Create the real subscription products in Google Play Console.
2. Copy their IDs into `product.config.ts` → `subscriptionProductIds`.
3. Implement a real `SubscriptionRepository` against Play Billing (e.g.
   `react-native-iap`) in an EAS development build, and swap it in for
   `MockSubscriptionManager` in `src/core/billing/SubscriptionManager.ts`.
   (In-app purchases don't work inside Expo Go - you need a dev build to
   test real billing.)
4. Customize `PaywallScreen`'s `title`/`benefits` props with the product's
   actual value proposition.

## 9. Configure analytics / crash reporting (optional)

Implement `AnalyticsTracker` / `CrashReporter` for a real provider and swap
the exported instance in `src/core/analytics/index.ts` /
`src/core/crash/index.ts`. Leave the console/no-op defaults if the product
doesn't need this yet - nothing else in the app depends on a specific
provider.

## 10. Connect EAS and do a first cloud build

```bash
eas login
eas init                 # creates a new EAS project for this app, writes the project id into app.config.ts's extra.eas.projectId
eas build --platform android --profile preview
```

Download the resulting APK from the link EAS prints, or scan the QR code to
install it directly on a test device.

## 11. Iterate

```bash
npm start
```

Scan the QR with Expo Go on a physical device. Because this project uses
only Expo-config-plugin-compatible native modules (secure-store, sqlite,
reanimated, gesture-handler, ...), Expo Go covers day-to-day development -
you only need a custom dev client (`eas build --profile development`) once
the product adds a native module that isn't supported by Expo Go (e.g. a
real IAP library).

## 12. Ship

When ready for the Play Store, follow the **Google Play publishing
checklist** in `README.md` section 13, then:

```bash
eas build --platform android --profile production
eas submit --platform android
```

---

## What you should NOT need to touch

Everything below is shared infrastructure - if you find yourself editing
these for a normal product build, something's off:

- `src/core/theme/ThemeProvider.tsx`, `spacing.ts`, `shapes.ts`, `dimensions.ts`
- `src/core/ui/*` (generic components)
- `src/core/storage/*`, `src/core/database/*`
- `src/core/network/apiClient.ts` (the mechanism, not the base URL)
- `src/core/errors/*`
- `src/core/common/*` (providers, query client)
- `app/_layout.tsx`, `app/index.tsx`, `app/(tabs)/_layout.tsx`
- `src/features/settings`, `src/features/about` (generic settings/about/privacy/feedback screens)
