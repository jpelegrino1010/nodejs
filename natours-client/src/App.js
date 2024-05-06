import Home from './components/home/home';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import TourPage from './components/tours/tour-page';
import Login from './components/login/login';

const App = () => {
  const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/home', element: <Home /> },
    { path: '/login', element: <Login /> },
    { path: '/tours/:tourSlug', element: <TourPage /> }
  ]);
  return <RouterProvider router={router} />;
};

export default App;
