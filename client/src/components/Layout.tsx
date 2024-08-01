import { Container } from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import Navbar from './ui/Navbar';

import { store } from '../redux/store';

export default function Layout():JSX.Element {
  return (
    <Provider store={store}>
      <Container maxW="container.xl">
      <Navbar />
      <Outlet />
    </Container>
    </Provider>
    
  );
}
