const OSRS_PORTAL_API = 'https://osrsportal.com/activestars-foxtrot';
const OSRS_PORTAL_REFERER =
  'https://osrsportal.com/shooting-stars-tracker';

const F2P_WORLDS = new Set([
  301, 308, 316, 326, 335, 372, 379, 380, 381, 382, 383, 384, 393, 397, 398,
  399, 413, 414, 417, 418, 419, 427, 430, 431, 432, 433, 434, 435, 436, 437,
  451, 452, 453, 454, 455, 456, 468, 469, 483, 497, 498, 499, 530, 537, 552,
  553, 554, 555, 561, 565, 571, 660, 667, 692, 698,
]);

export const IGNORED_LOCATIONS = [
  'Keldagrim entrance mine',
  'Mount Karuulm mine',
  'Salvager Overlook in Varlamore',
  'Miscellania mine (cip fairy ring)',
  'Arceuus dense essence mine',
  'Rellekka mine',
  'Neitiznot south of rune rock',
  'Jatizso mine entrance',
  "Nw of Uzer (Eagle's Eyrie)",
  'West of Grand Tree',
  'Hosidius mine',
  'Mount Karuulm bank',
  'Abandoned Mine west of Burgh',
  'wildy resource area in',
  'wildy resource area on',
  'Chambers of Xeric bank',
  'Wilderness Resource Area',
  'Lunar Isle mine entrance',
  'Lava maze runite mine (lvl 46 Wildy)',
  'Nardah bank',
  'Canifis bank',
  'Piscatoris (akq fairy ring)',
  'South Crandor',
  'Gnome Stronghold spirit tree',
  'Fossil Island rune rocks',
  "Myths' Guild",
  'Port Piscarilius mine in Kourend',
  'Isafdar runite rocks',
  'Nature Altar mine north of Shilo',
  "Mos Le'Harmless west bank",
  'Lletya',
  'Prifddinas Zalcano entrance',
  'South Lovakengj bank',
  'Rantz cave',
  'Fossil Island Volcanic Mine entrance',
  'Hobgoblin mine (lvl 30 Wildy)',
  'Corsair Cove bank (innit)',
  'Corsair Resource Area',
  'Desert Quarry mine',
  'North Crandor',
  'Shayzien mine south of Kourend Castle',
  'Feldip Hills (aks fairy ring)',
  'Mynydd nw of Prifddinas',
  'Mine north-west of hunter guild',
  "Pirates' Hideout (lvl 53 Wildy)",
  'Burgh de Rott bank',
  'Southwest of Brimhaven Poh',
  'Yanille bank',
  "South of Legends' Guild",
  'Shilo Village gem mine',
  'Varlamore colosseum entrance bank',
  'Brimhaven northwest gold mine',
  'Mage Arena bank (lvl 56 Wildy)',
  'Crafting guild',
  'North Dwarven Mine entrance',
  'Theatre of Blood bank',
  'Aldarin mine in Varlamore',
  'Varlamore South East mine',
  'Darkmeyer ess. mine entrance',
  'varlamore west mine (just below tecu salamanders)',
  'Arandar mine north of Lletya',
  'Port Khazard mine',
  'Kebos Swamp mine',
  'Lovakite mine',
  'prif world',
  'Agility Pyramid mine',
  'shayzien mines',
  'Mage of Zamorak mine (lvl 7 Wildy)',
];

export type StarRow = [string, string, string, string];

type PortalStar = {
  time: number;
  world: number;
  tier: number;
  loc: string;
};

function createPortalToken(): string {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString(
    'base64',
  );
  const payload = Buffer.from(
    JSON.stringify({
      data: 'osrs_stars',
      exp: Math.floor(Date.now() / 1000) + 300,
    }),
  ).toString('base64');

  return `${header}.${payload}.`;
}

function shouldIgnoreStar(
  timeAgo: string,
  world: string,
  tier: string,
  location: string,
): boolean {
  const values = [timeAgo, world, tier, location];
  return (
    values.some((value) =>
      IGNORED_LOCATIONS.some((ignored) => value.includes(ignored)),
    ) || world.includes('f2p')
  );
}

export function formatPortalStars(stars: PortalStar[]): StarRow[] {
  return stars
    .map((star) => {
      const world = F2P_WORLDS.has(star.world)
        ? `${star.world}f2p`
        : String(star.world);
      const timeAgo = `${star.time}m ago`;
      const tier = `T${star.tier}`;
      const location = star.loc.trim();

      return { timeAgo, world, tier, location };
    })
    .filter(({ timeAgo, world, tier, location }) =>
      !shouldIgnoreStar(timeAgo, world, tier, location),
    )
    .map(({ timeAgo, world, tier, location }) => [
      timeAgo,
      world,
      tier,
      location,
    ]);
}

export async function fetchPortalStars(): Promise<StarRow[]> {
  const response = await fetch(OSRS_PORTAL_API, {
    headers: {
      Authorization: `Bearer ${createPortalToken()}`,
      'Content-Type': 'application/json',
      Referer: OSRS_PORTAL_REFERER,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`OSRS Portal API returned ${response.status}`);
  }

  const stars = (await response.json()) as PortalStar[];
  return formatPortalStars(stars);
}
