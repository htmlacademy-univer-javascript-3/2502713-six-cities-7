import { useState } from 'react';
import { Offer } from '../types/offer';
import OfferCard, { OfferCardVariant } from './OfferCard';

type OffersListProps = {
  offers: Offer[];
  variant?: OfferCardVariant;
};

const listClassNames = {
  cities: 'cities__places-list places__list tabs__content',
  favorites: 'favorites__places',
  'near-places': 'near-places__list places__list',
};

function OffersList({ offers, variant = 'cities' }: OffersListProps) {
  const [activeOfferId, setActiveOfferId] = useState<Offer['id'] | null>(null);

  return (
    <div className={listClassNames[variant]} data-active-offer-id={activeOfferId}>
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          variant={variant}
          onMouseEnter={() => setActiveOfferId(offer.id)}
          onMouseLeave={() => setActiveOfferId(null)}
        />
      ))}
    </div>
  );
}

export default OffersList;
