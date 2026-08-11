import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface AdvertisingIdInfo {
  advertisingId: string | null;
  isLimitAdTrackingEnabled: boolean;
}

export interface Spec extends TurboModule {
  getAdvertisingId(): Promise<AdvertisingIdInfo>;
  requestTrackingAuthorization(): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('AdvertisingId');
