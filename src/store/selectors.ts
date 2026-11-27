import { createSelector } from '@reduxjs/toolkit';
import type { State } from './reducer';

export const selectCity = (state: State) => state.city;
export const selectOffers = (state: State) => state.offers;

export const selectCityOffers = createSelector(
  [selectOffers, selectCity],
  (offers, city) => offers.filter((offer) => offer.city === city)
);

export const selectFavoriteOffers = createSelector(
  [selectOffers],
  (offers) => offers.filter((offer) => offer.isFavorite)
);
