import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cities, cityCenters } from '../cities';
import CityList from '../components/city-list';
import Header from '../components/header';
import Map from '../components/map';
import OffersList from '../components/offers-list';
import SortingOptions from '../components/sorting-options';
import { SortType, sortOffers } from '../sorting';
import { changeCity } from '../store/action';
import { selectCity, selectCityOffers, selectFavoriteOffers } from '../store/selectors';
import type { Offer } from '../types/offer';
import MainEmptyPage from './main-empty-page';

const mapZoom = 12;

function MainPage() {
  const city = useSelector(selectCity);
  const cityOffers = useSelector(selectCityOffers);
  const favorites = useSelector(selectFavoriteOffers);
  const dispatch = useDispatch();
  const [sortType, setSortType] = useState(SortType.Popular);
  const [activeOfferId, setActiveOfferId] = useState<Offer['id'] | null>(null);
  const sortedOffers = useMemo(() => sortOffers(cityOffers, sortType), [cityOffers, sortType]);
  const isEmpty = cityOffers.length === 0;

  return (
    <div className='page page--gray page--main'>
      <Header favoritesCount={favorites.length} />
      <main className={`page__main page__main--index${isEmpty ? ' page__main--index-empty' : ''}`}>
        <h1 className='visually-hidden'>Cities</h1>
        <CityList
          cities={cities}
          selectedCity={city}
          onCityChange={(nextCity) => {
            setActiveOfferId(null);
            dispatch(changeCity(nextCity));
          }}
        />
        <div className='cities'>
          {isEmpty ? <MainEmptyPage city={city} /> : (
            <div className='cities__places-container container'>
              <section className='cities__places places'>
                <h2 className='places__found'>{cityOffers.length} {cityOffers.length === 1 ? 'place' : 'places'} to stay in {city}</h2>
                <SortingOptions value={sortType} onChange={setSortType} />
                <OffersList offers={sortedOffers} onActiveOfferChange={setActiveOfferId} />
              </section>
              <div className='cities__right-section'>
                <Map center={cityCenters[city]} zoom={mapZoom} offers={cityOffers} activeOfferId={activeOfferId} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MainPage;
