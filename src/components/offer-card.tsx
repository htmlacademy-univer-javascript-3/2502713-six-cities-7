import { Link } from 'react-router-dom';
import { Offer } from '../types/offer';

export type OfferCardVariant = 'cities' | 'favorites' | 'near-places';

type OfferCardProps = {
  offer: Offer;
  variant?: OfferCardVariant;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

function OfferCard({ offer, variant = 'cities', onMouseEnter, onMouseLeave }: OfferCardProps) {
  const isFavoriteCard = variant === 'favorites';
  const offerPath = `/offer/${offer.id}`;

  return (
    <article className={`${variant}__card place-card`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {offer.isPremium && <div className='place-card__mark'><span>Premium</span></div>}
      <div className={`${variant}__image-wrapper place-card__image-wrapper`}>
        <Link to={offerPath}>
          <img className='place-card__image' src={offer.previewImage} width={isFavoriteCard ? 150 : 260} height={isFavoriteCard ? 110 : 200} alt={offer.title} />
        </Link>
      </div>
      <div className={`${isFavoriteCard ? 'favorites__card-info ' : ''}place-card__info`}>
        <div className='place-card__price-wrapper'>
          <div className='place-card__price'>
            <b className='place-card__price-value'>€{offer.price}</b>
            <span className='place-card__price-text'>/&nbsp;night</span>
          </div>
          <button className={`place-card__bookmark-button${offer.isFavorite ? ' place-card__bookmark-button--active' : ''} button`} type='button'>
            <svg className='place-card__bookmark-icon' width='18' height='19'><use xlinkHref='#icon-bookmark' /></svg>
            <span className='visually-hidden'>{offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
          </button>
        </div>
        <div className='place-card__rating rating'>
          <div className='place-card__stars rating__stars'>
            <span style={{ width: `${Math.round(offer.rating) * 20}%` }} />
            <span className='visually-hidden'>Rating</span>
          </div>
        </div>
        <h2 className='place-card__name'><Link to={offerPath}>{offer.title}</Link></h2>
        <p className='place-card__type'>{offer.type}</p>
      </div>
    </article>
  );
}

export default OfferCard;
