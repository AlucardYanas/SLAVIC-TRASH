import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainPage from './components/pages/MainPage';
import Layout from './components/Layout';
import AccountPage from './components/pages/AccountPage';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUnPage';

function App(): JSX.Element {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <MainPage />,
        },
        {
          path: '/account',
          element: <AccountPage />,
        },
        {
          path: '/login',
          element: (
            // <ProtectedRouter isAllowed={user.status === 'guest'}>
              <LoginPage />
            // </ProtectedRouter>
          ),
        },
        {
          path: '/signin',
          element: (
            // <ProtectedRouter isAllowed={user.status === 'guest'}>
              <SignUpPage />
            // </ProtectedRouter>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;