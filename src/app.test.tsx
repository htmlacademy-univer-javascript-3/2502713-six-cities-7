import { configureStore } from '@reduxjs/toolkit';
import { act, cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import App from './app';
import { offers } from './mocks/offers';
import { loadOffers } from './store/action';
import { reducer } from './store/reducer';

const parisOffers = offers.filter((offer) => offer.city === 'Paris');
const amsterdamOffers = offers.filter((offer) => offer.city === 'Amsterdam');

function renderApp({ initialOffers = offers, isAuthorized = false } = {}) {
  const store = configureStore({ reducer });
  store.dispatch(loadOffers(initialOffers));

  render(
    <StrictMode>
      <Provider store={store}>
        <App isAuthorized={isAuthorized} />
      </Provider>
    </StrictMode>
  );

  return store;
}

describe('Application routing', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  afterEach(cleanup);

  it('selects Paris on startup and lists the six cities in order', () => {
    renderApp();

    const cityList = screen.getByRole('region', { name: 'Cities' });
    expect(within(cityList).getAllByRole('button').map((button) => button.textContent)).toEqual([
      'Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf',
    ]);
    expect(within(cityList).getByRole('button', { name: 'Paris', pressed: true })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '2 places to stay in Paris' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(parisOffers.length);
    const map = screen.getByRole('region', { name: 'Rental offers map' });
    expect(within(map).getAllByRole('img')).toHaveLength(parisOffers.length);
    parisOffers.forEach((offer) => {
      expect(screen.getByRole('heading', { name: offer.title })).toBeInTheDocument();
      expect(within(map).getByRole('img', { name: offer.title })).toHaveAttribute('src', '/img/pin.svg');
    });
    expect(within(map).getByRole('link', { name: 'OpenStreetMap' })).toBeInTheDocument();
  });

  it('sorts by price and rating and restores the original order with Popular', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Amsterdam' }));

    const [apartment, room, canal, cozy] = amsterdamOffers;
    const cardTitles = () => screen.getAllByRole('article').map((card) => within(card).getByRole('heading').textContent);
    const sortButton = () => screen.getByRole('button', { name: /^Sort by / });
    expect(sortButton()).toHaveAccessibleName('Sort by Popular');
    expect(cardTitles()).toEqual(amsterdamOffers.map((offer) => offer.title));

    const cases = [
      { option: 'Price: low to high', order: [room, apartment, canal, cozy] },
      { option: 'Price: high to low', order: [cozy, canal, apartment, room] },
      { option: 'Top rated first', order: [cozy, apartment, canal, room] },
      { option: 'Popular', order: amsterdamOffers },
    ];

    for (const { option, order } of cases) {
      await user.click(sortButton());
      await user.click(screen.getByRole('button', { name: option }));
      expect(sortButton()).toHaveAccessibleName(`Sort by ${option}`);
      expect(sortButton()).toHaveAttribute('aria-expanded', 'false');
      expect(cardTitles()).toEqual(order.map((offer) => offer.title));
    }
  });

  it('highlights only the marker for the hovered card after sorting and clears it on leave', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Sort by Popular' }));
    await user.click(screen.getByRole('button', { name: 'Price: low to high' }));

    const [firstCard, secondCard] = screen.getAllByRole('article');
    const map = within(screen.getByRole('region', { name: 'Rental offers map' }));
    const firstPin = map.getByRole('img', { name: parisOffers[1].title });
    const secondPin = map.getByRole('img', { name: parisOffers[0].title });

    await user.hover(firstCard);
    expect(firstPin).toHaveAttribute('src', '/img/pin-active.svg');
    expect(secondPin).toHaveAttribute('src', '/img/pin.svg');

    await user.hover(secondCard);
    expect(firstPin).toHaveAttribute('src', '/img/pin.svg');
    expect(secondPin).toHaveAttribute('src', '/img/pin-active.svg');

    await user.unhover(secondCard);
    expect(secondPin).toHaveAttribute('src', '/img/pin.svg');
  });

  it('replaces the city results and markers when new offers are loaded', () => {
    const store = renderApp();
    act(() => {
      store.dispatch(loadOffers([parisOffers[1], ...amsterdamOffers]));
    });

    expect(screen.getByRole('heading', { name: '1 place to stay in Paris' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: parisOffers[1].title })).toBeInTheDocument();
    const map = screen.getByRole('region', { name: 'Rental offers map' });
    expect(within(map).getAllByRole('img')).toHaveLength(1);
    expect(within(map).getByRole('img', { name: parisOffers[1].title })).toBeInTheDocument();
  });

  it('updates the heading, cards and markers when switching cities, including an empty city', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Amsterdam' }));

    expect(screen.getByRole('button', { name: 'Amsterdam', pressed: true })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '4 places to stay in Amsterdam' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(amsterdamOffers.length);
    const map = screen.getByRole('region', { name: 'Rental offers map' });
    expect(within(map).getAllByRole('img')).toHaveLength(amsterdamOffers.length);
    amsterdamOffers.forEach((offer) => {
      expect(screen.getByRole('heading', { name: offer.title })).toBeInTheDocument();
      expect(within(map).getByRole('img', { name: offer.title })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Dusseldorf' }));
    expect(screen.getByRole('heading', { name: '0 places to stay in Dusseldorf' })).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Rental offers map' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Paris' }));
    expect(screen.getByRole('heading', { name: '2 places to stay in Paris' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(parisOffers.length);
  });

  it('opens the login page by its address', () => {
    window.history.replaceState(null, '', '/login');
    renderApp();

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it.each(offers)('opens the details for offer $id by its address', (offer) => {
    window.history.replaceState(null, '', `/offer/${offer.id}`);
    renderApp();

    expect(screen.getByRole('heading', { level: 1, name: offer.title })).toBeInTheDocument();
    expect(screen.getByText(offer.description)).toBeInTheDocument();
    expect(screen.getByText(`Max ${offer.maxAdults} adults`)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Your review' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: `Reviews · ${offer.reviews.length}` })).toBeInTheDocument();
    offer.reviews.forEach((review) => {
      expect(screen.getByText(review.comment)).toBeInTheDocument();
    });
    const nearbyCount = Math.min(3, offers.filter((item) => item.city === offer.city && item.id !== offer.id).length);
    expect(screen.queryAllByRole('article')).toHaveLength(nearbyCount);

    const map = screen.getByRole('region', { name: 'Rental offers map' });
    expect(map).toHaveClass('offer__map');
    expect(within(map).queryAllByRole('img')).toHaveLength(nearbyCount);
    expect(within(map).queryByRole('img', { name: offer.title })).not.toBeInTheDocument();
    screen.queryAllByRole('article').forEach((card) => {
      expect(card).toHaveClass('near-places__card');
      const title = within(card).getByRole('heading').textContent as string;
      expect(within(map).getByRole('img', { name: title })).toBeInTheDocument();
    });
  });

  it('opens the matching offer when its card title is clicked', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Amsterdam' }));

    await user.click(within(screen.getByRole('heading', { name: offers[1].title })).getByRole('link'));

    expect(window.location.pathname).toBe(`/offer/${offers[1].id}`);
    expect(screen.getByRole('heading', { level: 1, name: offers[1].title })).toBeInTheDocument();
    expect(screen.getByText(offers[1].description)).toBeInTheDocument();
  });

  it('resets the comment form when a neighbouring offer is opened', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', `/offer/${offers[0].id}`);
    renderApp();
    await user.type(screen.getByRole('textbox', { name: 'Your review' }), 'A draft for the first apartment');
    await user.click(screen.getByRole('radio', { name: 'good' }));

    await user.click(within(screen.getByRole('heading', { name: offers[1].title })).getByRole('link'));

    expect(screen.getByRole('heading', { level: 1, name: offers[1].title })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Your review' })).toHaveValue('');
    expect(screen.getByRole('radio', { name: 'good' })).not.toBeChecked();
    expect(screen.getByRole('heading', { name: 'Reviews · 0' })).toBeInTheDocument();
    expect(screen.queryByText(offers[0].reviews[0].comment)).not.toBeInTheDocument();

    const map = screen.getByRole('region', { name: 'Rental offers map' });
    expect(within(map).getAllByRole('img')).toHaveLength(3);
    expect(within(map).getByRole('img', { name: offers[0].title })).toBeInTheDocument();
    expect(within(map).queryByRole('img', { name: offers[1].title })).not.toBeInTheDocument();
  });

  it('shows 404 for an offer id missing from the supplied data', () => {
    window.history.replaceState(null, '', '/offer/missing-offer');
    renderApp();

    expect(screen.getByRole('heading', { name: '404 Not Found' })).toBeInTheDocument();
  });

  it('redirects an unauthorized visitor from favorites to login', () => {
    window.history.replaceState(null, '', '/favorites');
    renderApp();

    expect(window.location.pathname).toBe('/login');
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Saved listing' })).not.toBeInTheDocument();
  });

  it('opens favorites from the header and navigates to a saved offer for an authorized visitor', async () => {
    const user = userEvent.setup();
    renderApp({ isAuthorized: true });

    await user.click(screen.getByRole('link', { name: /Oliver.conner@gmail.com/ }));

    expect(window.location.pathname).toBe('/favorites');
    expect(screen.getByRole('heading', { name: 'Saved listing' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(screen.queryByRole('heading', { name: offers[0].title })).not.toBeInTheDocument();

    await user.click(within(screen.getByRole('heading', { name: offers[1].title })).getByRole('link'));

    expect(window.location.pathname).toBe(`/offer/${offers[1].id}`);
    expect(screen.getByRole('heading', { level: 1, name: offers[1].title })).toBeInTheDocument();
    expect(screen.getByText(offers[1].description)).toBeInTheDocument();
  });

  it('shows 404 for an unknown nested address and lets the visitor return home', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/unknown/nested');
    renderApp();

    expect(screen.getByRole('heading', { name: '404 Not Found' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'На главную' }));

    expect(window.location.pathname).toBe('/');
    expect(screen.getByText('2 places to stay in Paris')).toBeInTheDocument();
  });

  it('allows an authorized visitor to see private content', () => {
    const favoriteOffers = offers.filter((offer) => offer.isFavorite);

    window.history.replaceState(null, '', '/favorites');
    renderApp({ isAuthorized: true });

    expect(screen.getByRole('heading', { name: 'Saved listing' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(favoriteOffers.length);
    expect(screen.queryByRole('heading', { name: offers[0].title })).not.toBeInTheDocument();
    favoriteOffers.forEach((offer) => {
      expect(screen.getByRole('heading', { name: offer.title })).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: offer.title }).every((link) => link.getAttribute('href') === `/offer/${offer.id}`)).toBe(true);
    });
  });

  it('shows the empty favorites page when there are no saved offers', () => {
    window.history.replaceState(null, '', '/favorites');
    renderApp({ initialOffers: parisOffers, isAuthorized: true });

    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});
