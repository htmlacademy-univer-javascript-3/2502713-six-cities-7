import { Offer } from '../types/offer';
import OfferCard, { OfferCardVariant } from './offer-card';

type OffersListProps = {
  offers: Offer[];
  variant?: OfferCardVariant;
  onActiveOfferChange?: (offerId: Offer['id'] | null) => void;
};

const listClassNames = {
  cities: 'cities__places-list places__list tabs__content',
  favorites: 'favorites__places',
  'near-places': 'near-places__list places__list',
};

function OffersList({ offers, variant = 'cities', onActiveOfferChange }: OffersListProps) {
  return (
    <div className={listClassNames[variant]}>
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          variant={variant}
          onMouseEnter={() => onActiveOfferChange?.(offer.id)}
          onMouseLeave={() => onActiveOfferChange?.(null)}
        />
      ))}
    </div>
  );
}

export default OffersList;
