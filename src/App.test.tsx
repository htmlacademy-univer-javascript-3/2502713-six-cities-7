import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import PrivateRoute from './components/PrivateRoute';

describe('Application routing', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  afterEach(cleanup);

  it('shows the main page with the supplied offers count', () => {
    render(<App offersCount={312} />);

    expect(screen.getByText('312 places to stay in Amsterdam')).toBeInTheDocument();
  });

  it('opens the login page by its address', () => {
    window.history.replaceState(null, '', '/login');
    render(<App offersCount={312} />);

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('opens an offer page with a dynamic id', () => {
    window.history.replaceState(null, '', '/offer/123');
    render(<App offersCount={312} />);

    expect(screen.getByRole('heading', { name: 'Beautiful & luxurious studio at great location' })).toBeInTheDocument();
  });

  it('redirects an unauthorized visitor from favorites to login', () => {
    window.history.replaceState(null, '', '/favorites');
    render(<App offersCount={312} />);

    expect(window.location.pathname).toBe('/login');
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Saved listing' })).not.toBeInTheDocument();
  });

  it('shows 404 for an unknown nested address and lets the visitor return home', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/unknown/nested');
    render(<App offersCount={312} />);

    expect(screen.getByRole('heading', { name: '404 Not Found' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'На главную' }));

    expect(window.location.pathname).toBe('/');
    expect(screen.getByText('312 places to stay in Amsterdam')).toBeInTheDocument();
  });

  it('allows an authorized visitor to see private content', () => {
    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <PrivateRoute isAuthorized>
          <h1>Saved listing</h1>
        </PrivateRoute>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Saved listing' })).toBeInTheDocument();
  });
});
