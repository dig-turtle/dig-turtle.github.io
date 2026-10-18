export type StoreLink = { status: 'live'; url: string } | { status: 'coming-soon' };

export interface App {
  name: string;
  description: string;
  /** Path of the app's own page on this site, if it has one. */
  page?: string;
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
    stores: { android: play('io.bwvolleyball.paywall'), ios: comingSoon },
  },
  {
    name: 'EzCamel',
    description: 'Quickly share Amazon links to camelcamelcamel for easy price tracking!',
    stores: { android: play('io.bwvolleyball.ez.camel'), ios: comingSoon },
  },
  {
    name: 'Clash of Cards: War',
    description: 'Can you win the war? A new twist on the classic card game of war!',
    stores: { android: play('io.bwvolleyball.cards.war'), ios: comingSoon },
  },
  {
    name: 'Lodestra',
    description: 'A trip organizer for Android',
    page: '/lodestra',
    stores: { android: comingSoon, ios: comingSoon },
  },
];
