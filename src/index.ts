import NativeAdvertisingId from './NativeAdvertisingId';
import type { AdvertisingIdInfo } from './NativeAdvertisingId';

export type { AdvertisingIdInfo };

/**
 * iOS App Tracking Transparency authorization status.
 * Android has no ATT concept and always reports 'authorized'.
 */
export type TrackingStatus =
  | 'authorized'
  | 'denied'
  | 'restricted'
  | 'notDetermined';

/**
 * Returns the device advertising ID.
 *
 * - Android: the Google Advertising ID (GAID). When the user has limited ad
 *   tracking (Android 12+ "Delete advertising ID"), the ID is all zeros.
 * - iOS: the IDFA. All zeros unless the app has been granted App Tracking
 *   Transparency authorization (see {@link requestTrackingAuthorization}).
 */
export function getAdvertisingId(): Promise<AdvertisingIdInfo> {
  return NativeAdvertisingId.getAdvertisingId();
}

/**
 * iOS 14+: shows the App Tracking Transparency prompt (the app must declare
 * `NSUserTrackingUsageDescription` in Info.plist) and resolves with the
 * resulting status. On Android this resolves immediately with 'authorized'.
 */
export function requestTrackingAuthorization(): Promise<TrackingStatus> {
  return NativeAdvertisingId.requestTrackingAuthorization() as Promise<TrackingStatus>;
}

export default {
  getAdvertisingId,
  requestTrackingAuthorization,
};
