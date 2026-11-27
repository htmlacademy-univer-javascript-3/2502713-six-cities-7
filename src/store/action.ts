import { createAction } from '@reduxjs/toolkit';
import type { City } from '../cities';
import type { Offer } from '../types/offer';

export const changeCity = createAction<City>('offers/changeCity');
export const loadOffers = createAction<Offer[]>('offers/loadOffers');
