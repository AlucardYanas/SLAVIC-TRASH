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
    fontFamily: 'Inter',
    fontSize: '30px',
    backgroundColor: '#000',
    backgroundImage: 'url("/bg.jpg")',
    backgroundSize: 'cover', // Изображение растягивается на весь экран
    backgroundPosition: 'center center', // Центрирование фонового изображения
    backgroundRepeat: 'no-repeat', // Без повторения изображения
    minHeight: '100vh', // Минимальная высота контейнера на 100% высоты экрана
    width: '100vw', // Ширина контейнера на 100% ширины экрана
    overflow: 'hidden', // Скрыть переполнение
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <Provider store={store}>
      <Box style={layoutStyles}>
        <Loader isLoading={status === 'fetching'}>
          <Flex direction="column" minH="100vh" width="100vw">
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
