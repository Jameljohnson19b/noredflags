import { Platform } from 'react-native';

/**
 * MOCK Service to manage app store monetization and entitlements.
 * Used to isolate the startup crash while we fix native module issues.
 */
export class RevenueCatService {
  private static isConfigured = false;

  static async initialize() {
    console.warn("REFG: RevenueCat is currently in MOCK MODE for stability testing.");
    this.isConfigured = true;
  }

  static async fetchOfferings() {
    console.warn("REFG: Simulating RevenueCat Offerings...");
    return {
      current: {
        availablePackages: [
          { identifier: 'core_weekly', product: { priceString: '$2.99' } },
          { identifier: 'core_yearly', product: { priceString: '$29.99' } },
          { identifier: 'pro_monthly', product: { priceString: '$9.99' } },
          { identifier: 'pro_yearly', product: { priceString: '$49.99' } }
        ]
      }
    } as any;
  }

  static async purchasePackage(rcPackage: any) {
    console.warn("REFG: Simulating Successful Purchase...");
    await new Promise(r => setTimeout(r, 1000));
    return { success: true, isPro: true, isCore: false, error: null };
  }

  static async restorePurchases() {
    console.warn("REFG: Simulating Successful Restore...");
    return { success: true, isPro: true, isCore: false, error: null };
  }
}
