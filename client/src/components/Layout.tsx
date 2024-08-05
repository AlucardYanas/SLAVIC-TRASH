import { Container } from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import Navbar from './ui/Navbar';
import { useAppSelector } from './hooks/reduxHooks';
import Loader from './HOCs/Loader';
import { store } from '../redux/store';


export default function Layout(): JSX.Element {
  const status = useAppSelector((state) => state.auth.user.status);
  return (
    <Provider store={store}>
      <Container maxW="container.xl">
      <Loader isLoading={status === 'fetching'}>
        <>
          <Navbar />
          <Outlet />
        </>
      </Loader>
    </Container>
    </Provider>
    
  );
}
