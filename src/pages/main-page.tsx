import { useDispatch, useSelector } from 'react-redux';
import { cities, cityCenters } from '../cities';
import CityList from '../components/city-list';
import Header from '../components/header';
import Map from '../components/map';
import OffersList from '../components/offers-list';
import { changeCity } from '../store/action';
import { selectCity, selectCityOffers, selectFavoriteOffers } from '../store/selectors';
import MainEmptyPage from './main-empty-page';

const mapZoom = 12;

function MainPage() {
  const city = useSelector(selectCity);
  const cityOffers = useSelector(selectCityOffers);
  const favorites = useSelector(selectFavoriteOffers);
  const dispatch = useDispatch();
  const isEmpty = cityOffers.length === 0;

  return (
    <div className='page page--gray page--main'>
      <Header favoritesCount={favorites.length} />
      <main className={`page__main page__main--index${isEmpty ? ' page__main--index-empty' : ''}`}>
        <h1 className='visually-hidden'>Cities</h1>
        <CityList cities={cities} selectedCity={city} onCityChange={(nextCity) => dispatch(changeCity(nextCity))} />
        <div className='cities'>
          {isEmpty ? <MainEmptyPage city={city} /> : (
            <div className='cities__places-container container'>
              <section className='cities__places places'>
                <h2 className='places__found'>{cityOffers.length} {cityOffers.length === 1 ? 'place' : 'places'} to stay in {city}</h2>
                <form className='places__sorting' action='#' method='get'>
                  <span className='places__sorting-caption'>Sort by</span>
                  <span className='places__sorting-type' tabIndex={0}>Popular<svg className='places__sorting-arrow' width='7' height='4'><use xlinkHref='#icon-arrow-select' /></svg></span>
                  <ul className='places__options places__options--custom places__options--opened'>
                    <li className='places__option places__option--active' tabIndex={0}>Popular</li>
                    <li className='places__option' tabIndex={0}>Price: low to high</li>
                    <li className='places__option' tabIndex={0}>Price: high to low</li>
                    <li className='places__option' tabIndex={0}>Top rated first</li>
                  </ul>
                </form>
                <OffersList offers={cityOffers} />
              </section>
              <div className='cities__right-section'>
                <Map center={cityCenters[city]} zoom={mapZoom} offers={cityOffers} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MainPage;
