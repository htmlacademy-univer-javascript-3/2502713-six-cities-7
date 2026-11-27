export const cityCenters = {
  Paris: { latitude: 48.8566, longitude: 2.3522 },
  Cologne: { latitude: 50.9375, longitude: 6.9603 },
  Brussels: { latitude: 50.8503, longitude: 4.3517 },
  Amsterdam: { latitude: 52.376, longitude: 4.896 },
  Hamburg: { latitude: 53.5511, longitude: 9.9937 },
  Dusseldorf: { latitude: 51.2277, longitude: 6.7735 },
};

export type City = keyof typeof cityCenters;

export const cities = Object.keys(cityCenters) as City[];
