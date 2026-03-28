import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, PurchasesPackage } from 'react-native-purchases';

export class RevenueCatService {
  private static isConfigured = false;

  /**
   * Initializes RevenueCat configuration tracking securely binding the explicitly mapped iOS keys.
   */
  static async initialize() {
    if (this.isConfigured) return;

    // EXPO GO / SIMULATOR GUARD:
    // Native modules like RevenueCat cannot initialize inside the standard Expo Go client.
    // We bypass initialization in development to ensure the app doesn't crash on boot.
    if (process.env.EXPO_PUBLIC_ENVIRONMENT === 'development') {
      console.warn("Dev Mode: Skipping Native RevenueCat Initialization (Using Mock Engine)");
      this.isConfigured = true;
      return;
    }
    
    // RevenueCat strict debug tracking during MVP
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);

    try {
        if (Platform.OS === 'ios') {
            await Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_RC_IOS_KEY || 'appl_YourRevenueCatIosKeyHere' });
        } else if (Platform.OS === 'android') {
            await Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_RC_ANDROID_KEY || 'goog_YourRevenueCatAndroidKeyHere' });
        }
    } catch (e) {
        console.error("Native Purchase Engine Error (Probably Expo Go):", e);
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
    // MOCK RESPONSE FOR LOCAL SIMULATOR TESTING:
    // This allows the user to see the paywall pricing even if RevenueCat is not yet linked.
    if (process.env.EXPO_PUBLIC_ENVIRONMENT === 'development') {
      console.warn("Dev Mode: Simulating RevenueCat Offerings...");
      return {
        current: {
          availablePackages: [
            { identifier: 'core_weekly', product: { priceString: '$2.99' } },
            { identifier: 'pro_monthly', product: { priceString: '$9.99' } }
          ]
        }
      } as any;
    }

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
  static async purchasePackage(rcPackage: any) {
    // MOCK RESPONSE FOR LOCAL SIMULATOR TESTING:
    // This bypasses the Apple sandbox requirement to allow testing the analyzer.
    if (process.env.EXPO_PUBLIC_ENVIRONMENT === 'development') {
      console.warn("Dev Mode: Simulating Successful Purchase...");
      await new Promise(r => setTimeout(r, 1000)); // Simulate App Store transaction lag
      return { success: true, isPro: true, isCore: false };
    }

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
    // MOCK RESPONSE FOR LOCAL SIMULATOR TESTING:
    if (process.env.EXPO_PUBLIC_ENVIRONMENT === 'development') {
        return { success: true, isPro: true, isCore: false };
    }

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
