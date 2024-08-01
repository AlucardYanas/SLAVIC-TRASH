import { Container } from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './ui/Navbar';

export default function Layout():JSX.Element {
  return (
    <Container maxW="container.xl">
      <Navbar />
      <Outlet />
    </Container>
  );
}
