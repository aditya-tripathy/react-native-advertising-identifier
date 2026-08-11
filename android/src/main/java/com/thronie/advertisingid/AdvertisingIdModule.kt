package com.thronie.advertisingid

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.google.android.gms.ads.identifier.AdvertisingIdClient
import java.util.concurrent.Executors

class AdvertisingIdModule(reactContext: ReactApplicationContext) :
  AdvertisingIdSpec(reactContext) {

  private val executor = Executors.newSingleThreadExecutor()

  override fun getName() = NAME

  // AdvertisingIdClient.getAdvertisingIdInfo is a blocking call and throws
  // IllegalStateException on the main thread, so it runs on a background executor.
  @ReactMethod
  override fun getAdvertisingId(promise: Promise) {
    executor.execute {
      try {
        val info = AdvertisingIdClient.getAdvertisingIdInfo(reactApplicationContext)
        val result = Arguments.createMap().apply {
          putString("advertisingId", info.id)
          putBoolean("isLimitAdTrackingEnabled", info.isLimitAdTrackingEnabled)
        }
        promise.resolve(result)
      } catch (e: Exception) {
        promise.reject(ERROR_CODE, "Failed to get the advertising ID: ${e.message}", e)
      }
    }
  }

  // App Tracking Transparency is an iOS-only concept.
  @ReactMethod
  override fun requestTrackingAuthorization(promise: Promise) {
    promise.resolve("authorized")
  }

  override fun invalidate() {
    executor.shutdown()
    super.invalidate()
  }

  companion object {
    const val NAME = "AdvertisingId"
    private const val ERROR_CODE = "E_ADVERTISING_ID"
  }
}
