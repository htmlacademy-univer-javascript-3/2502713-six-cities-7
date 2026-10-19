import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import NotFoundPage from './pages/NotFoundPage';
import OfferPage from './pages/OfferPage';

type AppProps = { offersCount: number };

function App({ offersCount }: AppProps) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage offersCount={offersCount} />} />
        <Route path='/login' element={<LoginPage />} />
        <Route
          path='/favorites'
          element={
            <PrivateRoute isAuthorized={false}>
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
