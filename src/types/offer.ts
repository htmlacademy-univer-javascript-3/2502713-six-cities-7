export type Review = {
  id: string;
  user: {
    name: string;
    avatarUrl: string;
  };
  rating: number;
  comment: string;
  date: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  type: 'Apartment' | 'Room' | 'House' | 'Hotel';
  price: number;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  bedrooms: number;
  maxAdults: number;
  goods: string[];
  city: string;
  location: {
    latitude: number;
    longitude: number;
  };
  host: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  reviews: Review[];
};
