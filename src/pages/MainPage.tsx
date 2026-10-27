import Header from '../components/Header';
import Map from '../components/Map';
import OffersList from '../components/OffersList';
import { Offer } from '../types/offer';

type MainPageProps = { offers: Offer[] };

const amsterdamCenter = { latitude: 52.376, longitude: 4.896 };
const mapZoom = 12;

function MainPage({ offers }: MainPageProps) {
  const cityOffers = offers.filter((offer) => offer.city === 'Amsterdam');

  return (
    <div className="page page--gray page--main">
      <Header favoritesCount={offers.filter((offer) => offer.isFavorite).length} />
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs"><section className="locations container"><ul className="locations__list tabs__list">{['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'].map((city) => <li className="locations__item" key={city}><a className={`locations__item-link tabs__item${city === 'Amsterdam' ? ' tabs__item--active' : ''}`} href="#"><span>{city}</span></a></li>)}</ul></section></div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{cityOffers.length} places to stay in Amsterdam</b>
              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>
                <span className="places__sorting-type" tabIndex={0}>Popular<svg className="places__sorting-arrow" width="7" height="4"><use xlinkHref="#icon-arrow-select" /></svg></span>
                <ul className="places__options places__options--custom places__options--opened">
                  <li className="places__option places__option--active" tabIndex={0}>Popular</li>
                  <li className="places__option" tabIndex={0}>Price: low to high</li>
                  <li className="places__option" tabIndex={0}>Price: high to low</li>
                  <li className="places__option" tabIndex={0}>Top rated first</li>
                </ul>
              </form>
              <OffersList offers={cityOffers} />
            </section>
            <div className="cities__right-section">
              <Map center={amsterdamCenter} zoom={mapZoom} offers={cityOffers} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
