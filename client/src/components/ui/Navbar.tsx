import React, { type CSSProperties } from 'react';
import { Box, Flex, HStack, Button, Container } from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useAppSelector } from '../hooks/reduxHooks';

const navLinkStyles: CSSProperties = {
  width: '202px',
  height: '36px',
  gap: '0px',
  opacity: '1', // Changed opacity to 1 to make the links visible
  fontFamily: 'Inter',
  fontSize: '30px',
  fontWeight: '500',
  lineHeight: '36px',
  textAlign: 'left',
  color: 'orange',
};

const navLinkHoverStyles: CSSProperties = {
  opacity: '0.7', // Added opacity change on hover
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
          {!isAuthPage && (
            <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
              {user.status === 'admin' && (
                <Box _hover={navLinkHoverStyles}>
                  <NavLink to="/admin" style={navLinkStyles}>Admin Panel</NavLink>
                </Box>
              )}
              {(user.status === 'logged' || user.status === 'admin') && (
                <Box _hover={navLinkHoverStyles}>
                  <NavLink to="/account" style={navLinkStyles}>Account</NavLink>
                </Box>
              )}
            </HStack>
          )}
          <Flex justifyContent="center" flex="1">
            <Box as={NavLink} to="/" position="relative">
              <img src="/Logo.png" alt="Logo" style={{ width: '450px', height: 'auto' }} />
            </Box>
          </Flex>
          {!isAuthPage && (
            <HStack spacing={8} display={{ base: 'none', md: 'flex' }} justifyContent="flex-end">
              {user.status === 'guest' && (
                <>
                  <Box _hover={navLinkHoverStyles}>
                    <NavLink to="/login" style={navLinkStyles}>Login</NavLink>
                  </Box>
                  <Box _hover={navLinkHoverStyles}>
                    <NavLink to="/signup" style={navLinkStyles}>Sign Up</NavLink>
                  </Box>
                </>
              )}
              {(user.status === 'logged' || user.status === 'admin') && (
               
                  <Button
                    colorScheme="orange"
                    onClick={logoutHandler}
                    ml={4}
                    style={{ borderRadius: '6px' }}
                    _hover={{ opacity: '0.7' }}
                  >
                    Logout
                  </Button>
              )}
            </HStack>
          )}
        </Flex>
      </Container>
    </Box>
  );
}
