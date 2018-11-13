package com.chatapp;

import android.app.Application;
import com.facebook.react.ReactApplication;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import ca.bigdata.voice.contacts.BDVSimpleContactsPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import org.reactnative.camera.RNCameraPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import android.os.Bundle;


public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SplashScreenReactPackage(),
            new RNFetchBlobPackage(),
            new BDVSimpleContactsPackage(),
            new FIRMessagingPackage(),
            new ReactNativePushNotificationPackage(),
            new RNCameraPackage(),
            new RNFirebasePackage(),
            new ReactNativeContacts(),
            new ImageResizerPackage(),
            new ImagePickerPackage(),
              new RNFirebaseDatabasePackage(),
              new RNFirebaseStoragePackage(),
              new RNFirebaseAuthPackage(),
              new RNFirebaseMessagingPackage(),
              new RNFirebaseCrashlyticsPackage()
      );


    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

//  @Override
//  public boolean canOverrideExistingModule() {
//    return true;
//  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
//    SplashScreen.show(this);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
