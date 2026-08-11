#import "AdvertisingId.h"

#import <AdSupport/ASIdentifierManager.h>
#import <AppTrackingTransparency/ATTrackingManager.h>

@implementation AdvertisingId

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

RCT_EXPORT_METHOD(getAdvertisingId:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  NSString *idfa = ASIdentifierManager.sharedManager.advertisingIdentifier.UUIDString;
  BOOL isLimited;
  if (@available(iOS 14, *)) {
    isLimited = ATTrackingManager.trackingAuthorizationStatus != ATTrackingManagerAuthorizationStatusAuthorized;
  } else {
    isLimited = !ASIdentifierManager.sharedManager.isAdvertisingTrackingEnabled;
  }
  resolve(@{
    @"advertisingId" : idfa,
    @"isLimitAdTrackingEnabled" : @(isLimited),
  });
}

RCT_EXPORT_METHOD(requestTrackingAuthorization:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 14, *)) {
    // iOS terminates the app (TCC crash) when the ATT prompt is requested
    // without a usage description, so fail with a clear error instead.
    if ([NSBundle.mainBundle objectForInfoDictionaryKey:@"NSUserTrackingUsageDescription"] == nil) {
      reject(@"E_MISSING_USAGE_DESCRIPTION",
             @"NSUserTrackingUsageDescription is not set in the app's Info.plist. "
             @"Add it before calling requestTrackingAuthorization().",
             nil);
      return;
    }
    // The ATT prompt must be requested from the main thread.
    dispatch_async(dispatch_get_main_queue(), ^{
      [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
        switch (status) {
          case ATTrackingManagerAuthorizationStatusAuthorized:
            resolve(@"authorized");
            break;
          case ATTrackingManagerAuthorizationStatusDenied:
            resolve(@"denied");
            break;
          case ATTrackingManagerAuthorizationStatusRestricted:
            resolve(@"restricted");
            break;
          case ATTrackingManagerAuthorizationStatusNotDetermined:
          default:
            resolve(@"notDetermined");
            break;
        }
      }];
    });
  } else {
    resolve(@"authorized");
  }
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAdvertisingIdSpecJSI>(params);
}
#endif

@end
