import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/private-route';
import FavoritesPage from './pages/favorites-page';
import LoginPage from './pages/login-page';
import MainPage from './pages/main-page';
import NotFoundPage from './pages/not-found-page';
import OfferPage from './pages/offer-page';

type AppProps = {
  isAuthorized?: boolean;
};

function App({ isAuthorized = false }: AppProps) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route
          path='/favorites'
          element={
            <PrivateRoute isAuthorized={isAuthorized}>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
        <Route path='/offer/:id' element={<OfferPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
