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
import AdminPage from './components/pages/AdminPage';
import ErrorPage from './components/pages/ErrorPage';
import VideoPage from './components/pages/VideoPage';

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
          path: '/video/:id',
          element: <VideoPage />,
        },
        {
          path: '/account',
          element: (
            <ProtectedRouter isAllowed={user.status === 'logged' || user.status === 'admin'}>
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
        {
          path: '/admin',
          element: (
            <ProtectedRouter isAllowed={user.status === 'admin'}>
              <AdminPage />
            </ProtectedRouter>
          ),
        },
        {
          path: '*',
          element: <ErrorPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
