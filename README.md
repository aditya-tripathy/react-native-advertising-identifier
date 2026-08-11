# react-native-advertising-identifier

Get the device advertising identifier in React Native:

- **Android** — the Google Advertising ID (GAID) via Google Play services
- **iOS** — the IDFA, with App Tracking Transparency (ATT) support

Written as a TurboModule with a backward-compatible spec, so it works on both the
**new architecture** and the **old architecture**.

## Requirements

- React Native **0.74 or newer**
- Android minSdk 24, `com.google.android.gms:play-services-ads-identifier` (bundled)
- iOS: the minimum iOS version supported by your React Native version

## Installation

```sh
npm install react-native-advertising-identifier
# or
yarn add react-native-advertising-identifier
```

Then install pods:

```sh
cd ios && pod install
```

Autolinking takes care of the rest — no manual linking or `react-native link`.

## Usage

```javascript
import {
  getAdvertisingId,
  requestTrackingAuthorization,
} from 'react-native-advertising-identifier';

// iOS 14+: ask for tracking permission first, otherwise the IDFA is all zeros.
// On Android this resolves immediately with 'authorized'.
const status = await requestTrackingAuthorization();

const { advertisingId, isLimitAdTrackingEnabled } = await getAdvertisingId();
```

The default export keeps the v1 call style working:

```javascript
import RNAdvertisingId from 'react-native-advertising-identifier';

RNAdvertisingId.getAdvertisingId()
  .then(({ advertisingId, isLimitAdTrackingEnabled }) => { /* ... */ })
  .catch(console.error);
```

## API

### `getAdvertisingId(): Promise<AdvertisingIdInfo>`

Resolves with:

| Field | Type | Description |
| --- | --- | --- |
| `advertisingId` | `string \| null` | GAID on Android, IDFA on iOS. All zeros when the user has opted out / not authorized tracking. |
| `isLimitAdTrackingEnabled` | `boolean` | `true` when the user has limited ad tracking (Android) or has not authorized tracking via ATT (iOS 14+). |

Rejects on Android when Google Play services is unavailable or out of date
(error code `E_ADVERTISING_ID`).

### `requestTrackingAuthorization(): Promise<TrackingStatus>`

Shows the iOS App Tracking Transparency prompt and resolves with
`'authorized' | 'denied' | 'restricted' | 'notDetermined'`.
On Android (and iOS < 14) it resolves with `'authorized'` without showing anything.

If the app's Info.plist is missing `NSUserTrackingUsageDescription`, the promise
rejects with code `E_MISSING_USAGE_DESCRIPTION` instead of letting iOS terminate
the app (which is what happens when the ATT prompt is requested without it).

## Platform notes

### Android

- The library's manifest already declares the permission required on Android 13+:

  ```xml
  <uses-permission android:name="com.google.android.gms.permission.AD_ID" />
  ```

  If your app must **not** request it (e.g. a kids' app), remove it in your app manifest:

  ```xml
  <uses-permission
      android:name="com.google.android.gms.permission.AD_ID"
      tools:node="remove" />
  ```

- On Android 12+, when the user deletes their advertising ID, the returned ID is
  `00000000-0000-0000-0000-000000000000` and `isLimitAdTrackingEnabled` is `true`.

### iOS

- Add a usage description to your app's `Info.plist` (required for the ATT prompt):

  ```xml
  <key>NSUserTrackingUsageDescription</key>
  <string>This identifier will be used to deliver personalized ads to you.</string>
  ```

- Call `requestTrackingAuthorization()` before `getAdvertisingId()`; without
  authorization iOS returns an all-zeros IDFA.

## License

MIT
