import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import PrivateRoute from './components/PrivateRoute';
import { offers } from './mocks/offers';
import FavoritesPage from './pages/FavoritesPage';

describe('Application routing', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  afterEach(cleanup);

  it('shows the supplied offers and calculates their count', () => {
    render(<App offers={offers.slice(0, 2)} />);

    expect(screen.getByText('2 places to stay in Amsterdam')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: offers[0].title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: offers[1].title })).toBeInTheDocument();
  });

  it('updates map markers when the supplied offers change in Strict Mode', () => {
    const { rerender } = render(<StrictMode><App offers={offers} /></StrictMode>);
    const map = screen.getByRole('region', { name: 'Rental offers map' });

    expect(within(map).getAllByRole('img')).toHaveLength(offers.length);
    offers.forEach((offer) => {
      expect(within(map).getByRole('img', { name: offer.title })).toHaveAttribute('src', '/img/pin.svg');
    });
    expect(within(map).getByRole('link', { name: 'OpenStreetMap' })).toBeInTheDocument();

    rerender(<StrictMode><App offers={offers.slice(1, 3)} /></StrictMode>);

    expect(within(map).getAllByRole('img')).toHaveLength(2);
    expect(within(map).queryByRole('img', { name: offers[0].title })).not.toBeInTheDocument();
    expect(within(map).queryByRole('img', { name: offers[3].title })).not.toBeInTheDocument();
    expect(within(map).getByRole('img', { name: offers[1].title })).toBeInTheDocument();
    expect(within(map).getByRole('img', { name: offers[2].title })).toBeInTheDocument();
  });

  it('shows only Amsterdam offers in the list and on the map', () => {
    const parisOffer = { ...offers[0], id: 'paris-apartment', city: 'Paris', title: 'Paris apartment' };
    render(<App offers={[...offers, parisOffer]} />);

    expect(screen.getByText('4 places to stay in Amsterdam')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(4);
    expect(screen.queryByRole('heading', { name: parisOffer.title })).not.toBeInTheDocument();
    const map = screen.getByRole('region', { name: 'Rental offers map' });
    expect(within(map).getAllByRole('img')).toHaveLength(4);
    expect(within(map).queryByRole('img', { name: parisOffer.title })).not.toBeInTheDocument();
  });

  it('opens the login page by its address', () => {
    window.history.replaceState(null, '', '/login');
    render(<App offers={offers} />);

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it.each(offers)('opens the details for offer $id by its address', (offer) => {
    window.history.replaceState(null, '', `/offer/${offer.id}`);
    render(<App offers={offers} />);

    expect(screen.getByRole('heading', { level: 1, name: offer.title })).toBeInTheDocument();
    expect(screen.getByText(offer.description)).toBeInTheDocument();
    expect(screen.getByText(`Max ${offer.maxAdults} adults`)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Your review' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: `Reviews · ${offer.reviews.length}` })).toBeInTheDocument();
    offer.reviews.forEach((review) => {
      expect(screen.getByText(review.comment)).toBeInTheDocument();
    });
    expect(screen.getAllByRole('article')).toHaveLength(offers.length - 1);

    const map = screen.getByRole('region', { name: 'Rental offers map' });
    expect(map).toHaveClass('offer__map');
    expect(within(map).getAllByRole('img')).toHaveLength(3);
    expect(within(map).queryByRole('img', { name: offer.title })).not.toBeInTheDocument();
    screen.getAllByRole('article').forEach((card) => {
      expect(card).toHaveClass('near-places__card');
      const title = within(card).getByRole('heading').textContent as string;
      expect(within(map).getByRole('img', { name: title })).toBeInTheDocument();
    });
  });

  it('opens the matching offer when its card title is clicked', async () => {
    const user = userEvent.setup();
    render(<App offers={offers} />);

    await user.click(within(screen.getByRole('heading', { name: offers[1].title })).getByRole('link'));

    expect(window.location.pathname).toBe(`/offer/${offers[1].id}`);
    expect(screen.getByRole('heading', { level: 1, name: offers[1].title })).toBeInTheDocument();
    expect(screen.getByText(offers[1].description)).toBeInTheDocument();
  });

  it('resets the comment form when a neighbouring offer is opened', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', `/offer/${offers[0].id}`);
    render(<App offers={offers} />);
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
    render(<App offers={offers} />);

    expect(screen.getByRole('heading', { name: '404 Not Found' })).toBeInTheDocument();
  });

  it('redirects an unauthorized visitor from favorites to login', () => {
    window.history.replaceState(null, '', '/favorites');
    render(<App offers={offers} />);

    expect(window.location.pathname).toBe('/login');
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Saved listing' })).not.toBeInTheDocument();
  });

  it('opens favorites from the header and navigates to a saved offer for an authorized visitor', async () => {
    const user = userEvent.setup();
    render(<App offers={offers} isAuthorized />);

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
    render(<App offers={offers} />);

    expect(screen.getByRole('heading', { name: '404 Not Found' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'На главную' }));

    expect(window.location.pathname).toBe('/');
    expect(screen.getByText('4 places to stay in Amsterdam')).toBeInTheDocument();
  });

  it('allows an authorized visitor to see private content', () => {
    const favoriteOffers = offers.filter((offer) => offer.isFavorite);

    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <PrivateRoute isAuthorized>
          <FavoritesPage offers={favoriteOffers} />
        </PrivateRoute>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Saved listing' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(favoriteOffers.length);
    expect(screen.queryByRole('heading', { name: offers[0].title })).not.toBeInTheDocument();
    favoriteOffers.forEach((offer) => {
      expect(screen.getByRole('heading', { name: offer.title })).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: offer.title }).every((link) => link.getAttribute('href') === `/offer/${offer.id}`)).toBe(true);
    });
  });

  it('shows the empty favorites page when there are no saved offers', () => {
    render(<MemoryRouter><FavoritesPage offers={[]} /></MemoryRouter>);

    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});
