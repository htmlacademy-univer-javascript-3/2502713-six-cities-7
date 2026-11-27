import type { City } from '../cities';

function MainEmptyPage({ city }: { city: City }) {
  return (
    <div className='cities__places-container cities__places-container--empty container'>
      <section className='cities__no-places'>
        <div className='cities__status-wrapper tabs__content'>
          <h2 className='cities__status'>0 places to stay in {city}</h2>
          <p className='cities__status-description'>
            We could not find any property available at the moment in {city}
          </p>
        </div>
      </section>
      <div className='cities__right-section' />
    </div>
  );
}

export default MainEmptyPage;
