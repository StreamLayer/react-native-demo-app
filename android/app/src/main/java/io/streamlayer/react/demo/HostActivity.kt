package io.streamlayer.react.demo

import android.content.Intent
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import io.branch.rnbranch.RNBranchModule
import io.streamlayer.sdk.StreamLayer

class HostActivity : ReactActivity() {

  override fun getMainComponentName(): String = "example"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onResume() {
    super.onResume()
    runCatching { StreamLayer.handleDeepLink(intent, this) }
  }

  override fun onStart() {
    super.onStart()
    RNBranchModule.initSession(intent.data, this)
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    RNBranchModule.reInitSession(this)
  }

}
