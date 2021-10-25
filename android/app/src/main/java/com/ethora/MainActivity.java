package com.ethora;

import com.zoontek.rnbootsplash.RNBootSplash; // <- add this necessary import
import android.os.Bundle; // <- add this necessary import

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    RNBootSplash.init(R.drawable.bootsplash, MainActivity.this);
  }
  @Override
  protected String getMainComponentName() {
    return "ethora";
  }
}
