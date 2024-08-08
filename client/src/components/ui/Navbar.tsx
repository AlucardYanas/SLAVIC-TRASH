import React, { type CSSProperties } from 'react';
import { Box, Flex, HStack, Container, Spacer } from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useAppSelector } from '../hooks/reduxHooks';

const navLinkStyles: CSSProperties = {
  width: 'auto',
  height: '50px',
  gap: '0px',
  opacity: '1',
  fontFamily: 'Rubik Marker Hatch', // Используйте шрифт Google
  fontWeight: '550',
  lineHeight: '48px',
  textAlign: 'left',
  color: '#ff3b00',
};

const navLinkHoverStyles: CSSProperties = {
  opacity: '0.7',
};

export default function NavBar(): JSX.Element {
  const { logoutHandler } = useAuth();
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <Box boxShadow="dark-lg">
      <Container maxW="container.xl">
        <Flex height="114px" alignItems="center" justifyContent="space-between" p={9}>
          <HStack spacing={8} minWidth="auto" display={{ base: 'none', md: 'flex' }}>
            {!isAuthPage && (
              <>
                {user.status === 'admin' && (
                  <Box _hover={navLinkHoverStyles}>
                    <NavLink to="/admin" style={navLinkStyles}>
                      Админка
                    </NavLink>
                  </Box>
                )}
                {user.status === 'logged' && (
                  <Box _hover={navLinkHoverStyles}>
                    <NavLink to="/account" style={navLinkStyles}>
                      Кабинет
                    </NavLink>
                  </Box>
                )}
                {user.status === 'guest' && (
                  <Box _hover={navLinkHoverStyles}>
                    <NavLink to="/login" style={navLinkStyles}>
                      Вход
                    </NavLink>
                  </Box>
                )}
              </>
            )}
          </HStack>
          <Spacer />
          <Flex justifyContent="center" flex="0 1 auto">
            <Box
              as={NavLink}
              to="/"
              position="relative"
              flexShrink={0}
              textAlign="center"
            >
              <Box
                as="img"
                src="/Logo.png"
                alt="Logo"
                width={{ base: '250px', sm: '300px', md: '350px', lg: '400px', xl: '450px' }}
                height="auto"
              />
            </Box>
          </Flex>
          <Spacer />
          <HStack
            spacing={8}
            minWidth="auto"
            display={{ base: 'none', md: 'flex' }}
            justifyContent="flex-end"
          >
            {!isAuthPage && (
              <>
                {user.status === 'guest' && (
                  <Box _hover={navLinkHoverStyles}>
                    <NavLink to="/signup" style={navLinkStyles}>
                      Рега
                    </NavLink>
                  </Box>
                )}
                {(user.status === 'logged' || user.status === 'admin') && (
                  <Box onClick={logoutHandler} as="button" _hover={navLinkHoverStyles}>
                    <NavLink to="/" style={navLinkStyles}>
                      Выход
                    </NavLink>
                  </Box>
                )}
              </>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
