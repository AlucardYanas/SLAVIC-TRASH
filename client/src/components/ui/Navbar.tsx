import React from 'react';
import { Box, Flex, HStack, Button, useColorModeValue } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useAppSelector } from '../hooks/reduxHooks';

export default function NavBar(): JSX.Element {
  const { logoutHandler } = useAuth();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4} boxShadow="dark-lg">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8} alignItems="center">
          <Box>Logo</Box>
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
            <NavLink to="/">Main</NavLink>
            {user.status === 'logged' && <NavLink to="/account">Account</NavLink>}
            {user.status === 'guest' && (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
              </>
            )}
          </HStack>
        </HStack>
        <Flex alignItems="center">
          <Button colorScheme="red" onClick={logoutHandler}>
            Logout
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
