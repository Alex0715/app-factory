# App Factory (Expo / React Native / TypeScript)

A reusable, product-agnostic Expo application skeleton. Clone it to start any
new small Android (and iOS) app — AI companions, utilities, games,
productivity tools — without rebuilding the same plumbing every time.

No Android Studio, Android SDK, local Gradle, or emulator is required.
Development happens against **Expo Go** / a **development build** on a
physical device, and production Android builds happen in the cloud via
**EAS Build**.

> Cloning this template for a new app? Read **[APP_FACTORY.md](./APP_FACTORY.md)** instead — it's the step-by-step checklist.

---

## 1. Architecture

```
app/                      Expo Router file-based routes (thin - delegate to src/features)
  _layout.tsx              Root providers, splash screen, global Stack
  index.tsx                Redirect: onboarding vs main app
  onboarding.tsx
  (tabs)/                  Bottom tab navigator (Home, Settings)
  about.tsx  privacy.tsx  feedback.tsx  paywall.tsx

src/
  core/                    Product-agnostic shared infrastructure
    theme/                 Colors, typography, spacing, shapes, dimensions, ThemeProvider
    ui/                    Reusable components (AppButton, AppCard, SettingRow, ...)
    storage/                Zustand + AsyncStorage preferences, expo-secure-store
    database/               expo-sqlite (structured local data)
    network/                Fetch-based API client, offline detection
    analytics/               AnalyticsTracker abstraction (console/no-op by default)
    crash/                   CrashReporter abstraction (console/no-op by default)
    billing/                 SubscriptionManager abstraction
    featureFlags/            Local feature flag store
    errors/                  Typed AppError + mapping
    navigation/               Centralized route table
    config/                   Runtime env + product config re-export
    common/                   AppProviders, QueryClient, SettingsRepository impl

  domain/                  Framework-free models + repository interfaces
    models/                  Subscription, FeatureFlags, AppSettings
    repositories/            SettingsRepository, SubscriptionRepository, FeatureFlagRepository

  features/                Product features, composed from core/ + domain/
    onboarding/  home/  settings/  about/  subscription/

product.config.ts         PRODUCT CONFIGURATION - the main file a new app edits
app.config.ts             Expo config, generated from product.config.ts
```

Features depend on `core` and `domain` interfaces, never on each other's
internals. Screens under `app/` are intentionally thin — they wire up
navigation (back buttons, top bars) and render a feature screen component;
all real logic lives in `src/features/*`.

### Tech stack

Expo (managed workflow) · React Native · TypeScript · Expo Router ·
Zustand (client state) · TanStack Query (server/async state) ·
expo-secure-store (sensitive data) · AsyncStorage + expo-sqlite (local
persistence) · React Native Reanimated · EAS Build (cloud Android/iOS builds) ·
Jest + jest-expo + React Native Testing Library.

---

## 2. Run locally

Requirements: Node.js 20+, a physical Android device with **Expo Go**
installed (or an iOS device), and the same Wi-Fi network as your Mac.

```bash
npm install
npm start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS). Native
modules used here (secure-store, sqlite, reanimated, gesture-handler) all
work inside Expo Go — no custom dev client is required for local iteration.

Other useful scripts:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
npm run test        # jest
npm run doctor       # expo-doctor - validates the Expo project config
```

---

## 3. Create a new app from this template

See **[APP_FACTORY.md](./APP_FACTORY.md)** for the full walkthrough. Short version:

1. Clone the repo into a new directory.
2. Edit `product.config.ts` (name, application id, API URL, product IDs, feature flags).
3. Replace the icon/splash assets in `assets/`.
4. Adjust brand colors in `src/core/theme/colors.ts`.
5. Replace `src/features/home` with your product's actual feature.
6. `eas login && eas init` to connect a new EAS project, then build.

---

## 4. Change the application ID

Edit `applicationId` in `product.config.ts`:

```ts
applicationId: 'com.yourcompany.yourapp',
```

`app.config.ts` reads this for both `android.package` and `ios.bundleIdentifier`.
Because there's no checked-in native `/android` or `/ios` folder (this project
uses Expo's managed workflow), there's nothing else to rename — the next
`eas build` or `expo prebuild` regenerates native projects with the new id.

---

## 5. Change the app name

Edit `appName` in `product.config.ts`. This flows into `app.config.ts`'s
`name` field, which controls the home-screen label and store listing default.

---

## 6. Change branding

| What | Where |
|---|---|
| App name, tagline, support email, URLs | `product.config.ts` |
| Colors (light/dark palettes) | `src/core/theme/colors.ts` |
| Typography scale | `src/core/theme/typography.ts` |
| Spacing / radii / touch targets | `src/core/theme/spacing.ts`, `shapes.ts`, `dimensions.ts` |
| App icon / splash / adaptive icon | `assets/icon.png`, `assets/splash-icon.png`, `assets/android-icon-*.png` |
| Onboarding copy | `src/features/onboarding/onboardingContent.ts` |

Every screen consumes theme tokens via `useTheme()` - there should be no
hardcoded hex colors or font sizes inside feature/screen code.

---

## 7. Configure the API

`product.config.ts` sets a default `apiBaseUrl`, overridable per-environment
via the `EXPO_PUBLIC_API_BASE_URL` env var (see `.env.example`). The client
lives in `src/core/network/apiClient.ts`:

- Configurable base URL, timeout (default 15s), and retry count.
- Automatically attaches a bearer token from `secureStorage` unless `skipAuth`.
- Retries idempotent-safe failures (network errors, 5xx) with backoff.
- Maps every failure to a typed `AppError` (see `src/core/errors`).
- Request/response logging is gated on `__DEV__` - disabled in release builds.

**Never** put a private API key behind `EXPO_PUBLIC_*` — those values are
inlined into the JS bundle and trivially extractable from the APK. If a
product needs an LLM or other paid API, call it from your own backend and
have the app authenticate to *that* backend instead of embedding provider
keys client-side.

---

## 8. Configure subscriptions

1. Set your real product IDs in `product.config.ts` → `subscriptionProductIds`.
2. The default `MockSubscriptionManager` (`src/core/billing/SubscriptionManager.ts`)
   is a local, store-free implementation good for UI development and tests -
   it "purchases" instantly and persists an entitlement to secure storage.
3. For a real Google Play release, implement `SubscriptionRepository`
   (`src/domain/repositories/SubscriptionRepository.ts`) against
   `react-native-iap` (or `expo-in-app-purchases`) inside an EAS development
   build - in-app purchases do not work inside Expo Go - and swap the
   `subscriptionManager` export.
4. `PaywallScreen` (`src/features/subscription/PaywallScreen.tsx`) and the
   `PaywallCard` / `SubscriptionOption` components are generic; pass
   product-specific `title`/`benefits` props instead of forking the screen.

---

## 9. Configure analytics

`src/core/analytics/AnalyticsTracker.ts` defines the interface
(`trackScreen`, `trackEvent`, `trackPurchase`, `trackSubscription`,
`trackOnboardingCompleted`, `trackFeatureUsed`). The default implementation
logs to the console in development and no-ops in production
(`src/core/analytics/index.ts`). To wire up a real provider (Firebase
Analytics, PostHog, Amplitude, ...):

1. Implement `AnalyticsTracker` in a new file under `src/core/analytics/`.
2. Swap the `analytics` export in `src/core/analytics/index.ts`.

No other code changes - every call site depends on the interface only.
The same pattern applies to crash reporting (`src/core/crash`).

---

## 10. Create a new feature

1. Add a directory under `src/features/<name>/` with a screen component and
   an `index.ts` barrel export.
2. Add a route under `app/` that imports the screen (keep the route file
   thin - just navigation glue).
3. Add the route to `src/core/navigation/routes.ts`.
4. Reuse `src/core/ui` components and `useTheme()` - don't hardcode styles.
5. If the feature needs local data, add a `SettingsRepository`-style
   interface under `src/domain/repositories` and a concrete implementation
   in `src/core` (AsyncStorage, SQLite, or the API client).

---

## 11. Build a release

Builds happen in the cloud via EAS - no local Gradle/Android Studio needed.

```bash
npm install -g eas-cli   # one-time
eas login
eas init                 # links this repo to an EAS project (first time only)

eas build --platform android --profile production
```

Build profiles live in `eas.json`:

- `development` - internal APK with a dev client, for on-device debugging.
- `preview` - internal APK, for sharing test builds without the Play Store.
- `production` - Android App Bundle (`.aab`), for Play Store submission.

---

## 12. Generate an Android App Bundle

```bash
eas build --platform android --profile production
```

This produces a `.aab` file (Play Store's required format) built entirely on
Expo's cloud infrastructure. Download it from the EAS build page or via
`eas build:list` / `eas build:download`.

---

## 13. Google Play publishing checklist

- [ ] `product.config.ts`: real `applicationId`, `appName`, `version`.
- [ ] Real app icon, adaptive icon (foreground/background/monochrome), and splash screen in `assets/`.
- [ ] Privacy policy URL set (`product.config.ts` → `urls.privacyPolicy`) and reachable.
- [ ] Real subscription product IDs created in Play Console, matching `product.config.ts`.
- [ ] `SubscriptionRepository` wired to real Play Billing (not `MockSubscriptionManager`).
- [ ] Analytics/crash reporting wired to a real provider if the product needs one.
- [ ] `EXPO_PUBLIC_API_BASE_URL` points at your production API.
- [ ] No secrets committed - check `.env` is gitignored and EAS Secrets hold anything private.
- [ ] `eas build --platform android --profile production` succeeds.
- [ ] `eas submit --platform android` (or manual upload) to a Play Console internal testing track first.
- [ ] Store listing: screenshots, short/full description, content rating questionnaire, data safety form.
- [ ] Test the production build on a real device before promoting past internal testing.

---

## Testing

```bash
npm run test
```

Covers: typed error mapping, subscription entitlement rules, the mock
billing manager, feature flags, preferences persistence, and Compose-
equivalent UI component tests (React Native Testing Library) for buttons,
toggles, and async data hooks.
