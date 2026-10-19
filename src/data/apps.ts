export type StoreLink = { status: 'live'; url: string } | { status: 'coming-soon' };

/** What an app does with data. Each use links to a section of the unified privacy policy. */
export type DataUse = 'device' | 'ads' | 'analytics' | 'drive';

export const dataUseInfo: Record<DataUse, { anchor: string; label: string }> = {
  device: { anchor: 'on-device', label: 'On your device' },
  ads: { anchor: 'ads', label: 'Ads' },
  analytics: { anchor: 'analytics', label: 'Analytics' },
  drive: { anchor: 'google-drive', label: 'Google Drive' },
};

export interface App {
  name: string;
  description: string;
  /** Path of the app's own page on this site. */
  page: string;
  /** A short paragraph for the app's page. */
  about: string;
  /**
   * What the app does with data. Each entry must be true of the shipped app, or of the app at its first
   * release for an unreleased app, before it is added.
   */
  dataUses: DataUse[];
  /** Path of a real icon image; without one the tile shows the app's first letter. */
  icon?: string;
  stores: { android: StoreLink; ios: StoreLink };
}

const play = (id: string): StoreLink => ({
  status: 'live',
  url: `https://play.google.com/store/apps/details?id=${id}`,
});

const comingSoon: StoreLink = { status: 'coming-soon' };

// Live apps first, then apps on their way.
export const apps: App[] = [
  {
    name: 'Skip The Paywall',
    description: 'Quickly share links to public paywall removal sites on your phone!',
    page: '/skip-the-paywall',
    about:
      "Share a news article from your browser to Skip The Paywall and pick a public paywall-removal site to open it with. It's one tap from a locked article to a readable one.",
    dataUses: ['device', 'ads'],
    stores: { android: play('io.bwvolleyball.paywall'), ios: comingSoon },
  },
  {
    name: 'EzCamel',
    description: 'Quickly share Amazon links to camelcamelcamel for easy price tracking!',
    page: '/ezcamel',
    about:
      'EzCamel quickly gets you from an Amazon listing to the camelcamelcamel page for that item, so you can check its price history before you buy. Share the Amazon link to EzCamel and it opens the right page.',
    dataUses: ['device', 'ads'],
    stores: { android: play('io.bwvolleyball.ez.camel'), ios: comingSoon },
  },
  {
    name: 'Clash of Cards: War',
    description: 'Can you win the war? A new twist on the classic card game of war!',
    page: '/clash-of-cards-war',
    about: 'The classic card game of war, with a new twist. Flip, battle and see if you can take the whole deck.',
    dataUses: ['device', 'ads'],
    stores: { android: play('io.bwvolleyball.cards.war'), ios: comingSoon },
  },
  {
    name: 'Lodestra',
    description: 'A trip organizer for Android',
    page: '/lodestra',
    about:
      "Keep flights, stays, reservations and plans for each trip in one timeline. Your trips are backed up to your own Google Drive, and you can share a trip with the people you're travelling with.",
    dataUses: ['device', 'ads', 'analytics', 'drive'],
    stores: { android: comingSoon, ios: comingSoon },
  },
];

/** Apps that do the given thing with data, in catalog order. */
export function appsUsing(use: DataUse): App[] {
  return apps.filter((app) => app.dataUses.includes(use));
}
