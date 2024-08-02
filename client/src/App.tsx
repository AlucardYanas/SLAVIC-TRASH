import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainPage from './components/pages/MainPage';
import Layout from './components/Layout';
import AccountPage from './components/pages/AccountPage';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';
import { checkUserThunk } from './redux/auth/authActionThunk';
import { useAppDispatch, useAppSelector } from './components/hooks/reduxHooks';
import ProtectedRouter from './components/HOCs/ProtectedRouter';

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  useEffect(() => {
    void dispatch(checkUserThunk());
  }, []);
  const user = useAppSelector((state) => state.auth.user);
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
          element: (
            <ProtectedRouter isAllowed={user.status === 'logged'}>
              <AccountPage />
            </ProtectedRouter>
          ),
        },
        {
          path: '/login',
          element: (
            <ProtectedRouter isAllowed={user.status === 'guest'}>
              <LoginPage />
            </ProtectedRouter>
          ),
        },
        {
          path: '/signup',
          element: (
            <ProtectedRouter isAllowed={user.status === 'guest'}>
              <SignUpPage />
            </ProtectedRouter>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
