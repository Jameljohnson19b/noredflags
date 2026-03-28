import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, PurchasesPackage } from 'react-native-purchases';

export class RevenueCatService {
  private static isConfigured = false;

  /**
   * Initializes RevenueCat configuration tracking securely binding the explicitly mapped iOS keys.
   */
  static async initialize() {
    if (this.isConfigured) return;
    
    // RevenueCat strict debug tracking during MVP
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);

    if (Platform.OS === 'ios') {
       // Awaiting actual env injection. Mock key.
       await Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_RC_IOS_KEY || 'appl_YourRevenueCatIosKeyHere' });
    } else if (Platform.OS === 'android') {
       await Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_RC_ANDROID_KEY || 'goog_YourRevenueCatAndroidKeyHere' });
    }

    this.isConfigured = true;
    console.log("RevenueCat Native Purchase Engine Initialized.");
  }

  /**
   * Pulls the officially mapped Core and Pro tiers directly from RevenueCat Entitlements.
   * Core Tier maps to $2.99/week
   * Pro Tier maps to $9.99/month
   */
  static async fetchOfferings() {
    try {
      if (!this.isConfigured) await this.initialize();
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
        return offerings.current;
      }
      return null;
    } catch (e) {
      console.error("Error fetching RevenueCat Offerings: ", e);
      return null;
    }
  }

  /**
   * Executes native App Store Purchase.
   */
  static async purchasePackage(rcPackage: PurchasesPackage) {
    try {
      const { customerInfo } = await Purchases.purchasePackage(rcPackage);
      // Map entitlement key 'pro' or 'core'
      const isPro = typeof customerInfo.entitlements.active['pro'] !== "undefined";
      const isCore = typeof customerInfo.entitlements.active['core'] !== "undefined";
      
      return { success: true, isPro, isCore };
    } catch (e: any) {
      if (!e.userCancelled) {
        console.error("RC Purchase Error: ", e);
      }
      return { success: false, error: e.message };
    }
  }

  /**
   * Restores iOS App Store Subscriptions securely mapping across user devices.
   */
  static async restorePurchases() {
    try {
      const customerInfo = await Purchases.restorePurchases();
      const isPro = typeof customerInfo.entitlements.active['pro'] !== "undefined";
      const isCore = typeof customerInfo.entitlements.active['core'] !== "undefined";
      
      return { success: true, isPro, isCore };
    } catch (e: any) {
      console.error("RC Restore Error: ", e);
      return { success: false, error: e.message };
    }
  }
}
