import { useParams } from 'react-router-dom';
import CommentForm from '../components/CommentForm';
import Header from '../components/Header';
import Map from '../components/Map';
import OffersList from '../components/OffersList';
import ReviewsList from '../components/ReviewsList';
import { Offer } from '../types/offer';
import NotFoundPage from './NotFoundPage';

type OfferPageProps = {
  offers: Offer[];
};

function OfferPage({ offers }: OfferPageProps) {
  const { id } = useParams();
  const offer = offers.find((item) => item.id === id);

  if (!offer) {
    return <NotFoundPage />;
  }

  const nearbyOffers = offers.filter((item) => item.id !== offer.id && item.city === offer.city).slice(0, 3);

  return (
    <div className='page'>
      <Header favoritesCount={offers.filter((item) => item.isFavorite).length} />
      <main className='page__main page__main--offer'>
        <section className='offer'>
          <div className='offer__gallery-container container'>
            <div className='offer__gallery'>
              {offer.images.map((image) => (
                <div className='offer__image-wrapper' key={image}>
                  <img className='offer__image' src={image} alt={offer.title} />
                </div>
              ))}
            </div>
          </div>
          <div className='offer__container container'>
            <div className='offer__wrapper'>
              {offer.isPremium && <div className='offer__mark'><span>Premium</span></div>}
              <div className='offer__name-wrapper'>
                <h1 className='offer__name'>{offer.title}</h1>
                <button className={`offer__bookmark-button${offer.isFavorite ? ' offer__bookmark-button--active' : ''} button`} type='button'>
                  <svg className='offer__bookmark-icon' width='31' height='33'><use xlinkHref='#icon-bookmark' /></svg>
                  <span className='visually-hidden'>{offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
                </button>
              </div>
              <div className='offer__rating rating'>
                <div className='offer__stars rating__stars'>
                  <span style={{ width: `${Math.round(offer.rating) * 20}%` }} />
                  <span className='visually-hidden'>Rating</span>
                </div>
                <span className='offer__rating-value rating__value'>{offer.rating}</span>
              </div>
              <ul className='offer__features'>
                <li className='offer__feature offer__feature--entire'>{offer.type}</li>
                <li className='offer__feature offer__feature--bedrooms'>{offer.bedrooms} {offer.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</li>
                <li className='offer__feature offer__feature--adults'>Max {offer.maxAdults} adults</li>
              </ul>
              <div className='offer__price'>
                <b className='offer__price-value'>€{offer.price}</b>
                <span className='offer__price-text'> night</span>
              </div>
              <div className='offer__inside'>
                <h2 className='offer__inside-title'>What&#39;s inside</h2>
                <ul className='offer__inside-list'>
                  {offer.goods.map((good) => <li className='offer__inside-item' key={good}>{good}</li>)}
                </ul>
              </div>
              <div className='offer__host'>
                <h2 className='offer__host-title'>Meet the host</h2>
                <div className='offer__host-user user'>
                  <div className={`offer__avatar-wrapper${offer.host.isPro ? ' offer__avatar-wrapper--pro' : ''} user__avatar-wrapper`}>
                    <img className='offer__avatar user__avatar' src={offer.host.avatarUrl} width='74' height='74' alt='Host avatar' />
                  </div>
                  <span className='offer__user-name'>{offer.host.name}</span>
                  {offer.host.isPro && <span className='offer__user-status'>Pro</span>}
                </div>
                <div className='offer__description'><p className='offer__text'>{offer.description}</p></div>
              </div>
              <section className='offer__reviews reviews'>
                <ReviewsList reviews={offer.reviews} />
                <CommentForm key={offer.id} />
              </section>
            </div>
          </div>
          <Map center={offer.location} zoom={12} offers={nearbyOffers} variant='offer' />
        </section>
        {nearbyOffers.length > 0 && (
          <div className='container'>
            <section className='near-places places'>
              <h2 className='near-places__title'>Other places in the neighbourhood</h2>
              <OffersList offers={nearbyOffers} variant='near-places' />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default OfferPage;
