import React, { type CSSProperties } from 'react';
import { Box, Flex, HStack, Container, useBreakpointValue } from '@chakra-ui/react';
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
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box boxShadow="dark-lg">
      <Container maxW="container.xl">
        <Flex height="114px" alignItems="center" justifyContent="space-between" p={9}>
          <HStack spacing={8} minWidth="auto">
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
          {!isMobile && (
            <Flex justifyContent="center" flex="1">
              <Box as={NavLink} to="/" position="relative" flexShrink={0} textAlign="center">
                <Box
                  as="img"
                  src="/Logo.png"
                  alt="Logo"
                  width={{ base: '250px', sm: '300px', md: '350px', lg: '400px', xl: '450px' }}
                  height="auto"
                />
              </Box>
            </Flex>
          )}
          <HStack spacing={8} minWidth="auto" justifyContent="flex-end">
            {!isAuthPage && (
              <>
                {user.status === 'guest' && (
                  <Box _hover={navLinkHoverStyles}>
                    <NavLink to="/signup" style={navLinkStyles}>
                      Регистрация
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
