import React, { type CSSProperties } from 'react';
import { Box, Flex, HStack, Button, Link } from '@chakra-ui/react';
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

const navLinkHoverStyles = {
  opacity: '0.7', // Added opacity change on hover
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
            <img src="/Logo.png" alt="Logo" style={{ width: '450px', height: 'auto' }} />{' '}
            {/* Increased size by 1.5 times */}
          </Box>
        </Flex>
        {!isAuthPage && (
          <Flex alignItems="center">
            {/* Desktop Navigation */}
            <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
              {user.status === 'guest' && (
                <>
                  <Link as={NavLink} to="/login" style={navLinkStyles} _hover={navLinkHoverStyles}>
                    Login
                  </Link>
                  <Link as={NavLink} to="/signup" style={navLinkStyles} _hover={navLinkHoverStyles}>
                    Sign Up
                  </Link>
                </>
              )}
              {(user.status === 'logged' || user.status === 'admin') && (
                <>
                  <Link as={NavLink} to="/account" style={navLinkStyles} _hover={navLinkHoverStyles}>
                    Account
                  </Link>
                  {user.status === 'admin' && (
                    <Link as={NavLink} to="/admin" style={navLinkStyles} _hover={navLinkHoverStyles}>
                      Admin Panel
                    </Link>
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
