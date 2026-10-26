import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import NotFoundPage from './pages/NotFoundPage';
import OfferPage from './pages/OfferPage';
import { Offer } from './types/offer';

type AppProps = {
  offers: Offer[];
  isAuthorized?: boolean;
};

function App({ offers, isAuthorized = false }: AppProps) {
  const favoriteOffers = offers.filter((offer) => offer.isFavorite);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage offers={offers} />} />
        <Route path='/login' element={<LoginPage />} />
        <Route
          path='/favorites'
          element={
            <PrivateRoute isAuthorized={isAuthorized}>
              <FavoritesPage offers={favoriteOffers} />
            </PrivateRoute>
          }
        />
        <Route path='/offer/:id' element={<OfferPage offers={offers} />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
