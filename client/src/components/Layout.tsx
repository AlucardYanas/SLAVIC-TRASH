import { Container } from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './ui/Navbar';
import { useAppSelector } from './hooks/reduxHooks';
import Loader from './HOCs/Loader';

export default function Layout(): JSX.Element {
  const status = useAppSelector((state) => state.auth.user.status);
  return (
    <Container maxW="container.xl">
      <Loader isLoading={status === 'fetching'}>
        <>
          <Navbar />
          <Outlet />
        </>
      </Loader>
    </Container>
  );
}
