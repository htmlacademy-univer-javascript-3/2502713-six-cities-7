import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className='page page--gray'>
      <main className='page__main container'>
        <h1>404 Not Found</h1>
        <p>Такой страницы не существует.</p>
        <Link to='/'>На главную</Link>
      </main>
    </div>
  );
}

export default NotFoundPage;
