import React from 'react';
import { Box, Flex, HStack, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

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

export default function NavBar(): JSX.Element {
  const { logoutHandler } = useAuth();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Box boxShadow="dark-lg">
      <Flex height="114px" alignItems="center" justifyContent="space-between" p={9}>
        <Box as={NavLink} to="/">
          <img src="/Logo.png" alt="Logo" />
        </Box>
        <Flex flex="1" justifyContent="center"></Flex>
        <Flex alignItems="center">
          {/* Desktop Navigation */}
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            {user.status === 'guest' && (
              <>
                <NavLink to="/login" style={navLinkStyles}>Login</NavLink>
                <NavLink to="/signup" style={navLinkStyles}>Sign Up</NavLink>
              </>
            )}
            {(user.status === 'logged' || user.status === 'admin') && (
              <>
                <NavLink to="/account" style={navLinkStyles}>Account</NavLink>
                <Button colorScheme="red" onClick={logoutHandler} ml={4}>
                  Logout
                </Button>
              </>
            )}
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
}
