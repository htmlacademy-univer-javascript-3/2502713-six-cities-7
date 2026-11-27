import { createReducer } from '@reduxjs/toolkit';
import type { City } from '../cities';
import type { Offer } from '../types/offer';
import { changeCity, loadOffers } from './action';

export type State = {
  city: City;
  offers: Offer[];
};

const initialState: State = {
  city: 'Paris',
  offers: [],
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(loadOffers, (state, action) => {
      state.offers = action.payload;
    });
});
