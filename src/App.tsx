import MainPage from './pages/MainPage';

type AppProps = { offersCount: number };

function App({ offersCount }: AppProps) {
  return <MainPage offersCount={offersCount} />;
}

export default App;
