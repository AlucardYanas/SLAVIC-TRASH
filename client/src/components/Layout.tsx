import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import Navbar from './ui/Navbar';
import { useAppSelector } from './hooks/reduxHooks';
import Loader from './HOCs/Loader';
import { store } from '../redux/store';

export default function Layout(): JSX.Element {
  const status = useAppSelector((state) => state.auth.user.status);

  const layoutStyles: React.CSSProperties = {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#000',
    backgroundImage: 'url("/94f1112fca6461da18e3d44752b18020.png")',
    backgroundSize: 'contain',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    width: '100vw',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <Provider store={store}>
      <Box style={layoutStyles}>
        <Loader isLoading={status === 'fetching'}>
          <Flex direction="column" minH="100vh">
            <Navbar />
            <Box flex="1" overflow="auto">
              <Outlet />
            </Box>
          </Flex>
        </Loader>
      </Box>
    </Provider>
  );
}
