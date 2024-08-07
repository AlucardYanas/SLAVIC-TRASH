import React from 'react';
import { Box, Flex, HStack, Button } from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import { useAppSelector } from '../hooks/reduxHooks';

const navLinkStyles = {
  width: '202px',
  height: '36px',
  gap: '0px',
  opacity: '1', // Изменил opacity на 1, чтобы ссылки были видны
  fontFamily: 'Inter',
  fontSize: '30px',
  fontWeight: '500',
  lineHeight: '36px',
  textAlign: 'left',
  color: 'orange',
};

const navLinkHoverStyles = {
  opacity: '0.7', // Добавил изменение opacity при наведении
};

export default function NavBar(): JSX.Element {
  const { logoutHandler } = useAuth();
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <Box boxShadow="dark-lg">
      <Flex height="114px" alignItems="center" justifyContent="space-between" p={9}>
        <Flex flex="1" justifyContent="center">
          <Box as={NavLink} to="/">
            <img src="/Logo.png" alt="Logo" style={{ width: '450px', height: 'auto' }} /> {/* Увеличил размер в 1.5 раза */}
          </Box>
        </Flex>
        {!isAuthPage && (
          <Flex alignItems="center">
            {/* Desktop Navigation */}
            <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
              {user.status === 'guest' && (
                <>
                  <NavLink to="/login" style={navLinkStyles} _hover={navLinkHoverStyles}>Login</NavLink>
                  <NavLink to="/signup" style={navLinkStyles} _hover={navLinkHoverStyles}>Sign Up</NavLink>
                </>
              )}
              {(user.status === 'logged' || user.status === 'admin') && (
                <>
                  <NavLink to="/account" style={navLinkStyles} _hover={navLinkHoverStyles}>Account</NavLink>
                  {user.status === 'admin' && (
                    <NavLink to="/admin" style={navLinkStyles} _hover={navLinkHoverStyles}>Admin Panel</NavLink>
                  )}
                  <Button
                    colorScheme="red"
                    onClick={logoutHandler}
                    ml={4}
                    style={{ borderRadius: '6px' }}
                    _hover={{ opacity: '0.7' }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </HStack>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
