package com.thronie.advertisingid

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

abstract class AdvertisingIdSpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  abstract fun getAdvertisingId(promise: Promise)
  abstract fun requestTrackingAuthorization(promise: Promise)
}
