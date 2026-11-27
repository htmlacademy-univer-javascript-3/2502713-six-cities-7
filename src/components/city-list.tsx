import type { City } from '../cities';

type CityListProps = {
  cities: readonly City[];
  selectedCity: City;
  onCityChange: (city: City) => void;
};

function CityList({ cities, selectedCity, onCityChange }: CityListProps) {
  return (
    <div className='tabs'>
      <section className='locations container' aria-label='Cities'>
        <ul className='locations__list tabs__list'>
          {cities.map((city) => (
            <li className='locations__item' key={city}>
              <button
                className={`button locations__item-link tabs__item${city === selectedCity ? ' tabs__item--active' : ''}`}
                type='button'
                aria-pressed={city === selectedCity}
                onClick={() => onCityChange(city)}
              >
                <span>{city}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default CityList;
