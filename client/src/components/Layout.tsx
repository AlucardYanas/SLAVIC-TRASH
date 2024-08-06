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

  // Define inline styles for the background and global body styles
  const layoutStyles: React.CSSProperties = {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#000', // Set a black background color
    backgroundImage: 'url("/94f1112fca6461da18e3d44752b18020.png")',
    backgroundSize: '80% auto', // Keep the image size to 80% of the container width
    backgroundPosition: 'center', // Center the background
    backgroundRepeat: 'no-repeat', // No repeat
    minHeight: '100vh', // Minimum height of the viewport
    width: '100vw',  // Full width of the viewport
    overflow: 'hidden', // Prevent overflow
    display: 'flex',  // Use flex to manage layout
    flexDirection: 'column',
  };

  return (
    <Provider store={store}>
      <Box style={layoutStyles}>
        <Loader isLoading={status === 'fetching'}>
          <Flex direction="column" minH="100vh">
            <Navbar />
            <Box flex="1" overflow="auto"> {/* Allow overflow to be auto, preventing cut-off */}
              <Outlet />
            </Box>
          </Flex>
        </Loader>
      </Box>
    </Provider>
  );
}
