import React from 'react';
import { Box, Flex, HStack, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import { useAppSelector } from '../hooks/reduxHooks';

export default function NavBar(): JSX.Element {
  const { logoutHandler } = useAuth();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Box boxShadow="dark-lg">
      <Flex height="114px" alignItems="center" justifyContent="space-between" p={4}>
        <Box as={NavLink} to="/">
          <img src="/Logo.png" alt="Logo" />
        </Box>
        <Flex alignItems="center" ml="auto">
          {/* Desktop Navigation */}
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            <NavLink to="/">Main</NavLink>
            {user.status === 'logged' && (
              <>
                <NavLink to="/account">Account</NavLink>
                <Button colorScheme="red" onClick={logoutHandler} ml={4}>
                  Logout
                </Button>
              </>
            )}
            {user.status === 'guest' && (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
              </>
            )}
            {user.status === 'admin' && <NavLink to="/admin">AdminPanel</NavLink>}
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
}
