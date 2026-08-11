#ifdef RCT_NEW_ARCH_ENABLED
#import <AdvertisingIdSpec/AdvertisingIdSpec.h>

@interface AdvertisingId : NSObject <NativeAdvertisingIdSpec>
#else
#import <React/RCTBridgeModule.h>

@interface AdvertisingId : NSObject <RCTBridgeModule>
#endif

@end
