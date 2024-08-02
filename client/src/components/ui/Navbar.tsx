import React, { useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  Button,
  useColorModeValue,
  IconButton,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import useAuth from '../hooks/useAuth';
import { useAppSelector } from '../hooks/reduxHooks';

export default function NavBar(): JSX.Element {
  const { logoutHandler } = useAuth();
  const user = useAppSelector((state) => state.auth.user);
  const { isOpen, onToggle } = useDisclosure();

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
            {user.status === 'admin' && <NavLink to="/admin">AdminPanel</NavLink>}
          </HStack>
        </HStack>
        <Flex alignItems="center">
          <IconButton
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            display={{ md: 'none' }}
            onClick={onToggle}
          />
          <Button colorScheme="red" onClick={logoutHandler}>
            Logout
          </Button>
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Flex
          direction="column"
          display={{ base: 'flex', md: 'none' }}
          p={4}
          borderBottomWidth={1}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <NavLink to="/" onClick={onToggle}>
            Main
          </NavLink>
          {user.status === 'logged' && (
            <NavLink to="/account" onClick={onToggle}>
              Account
            </NavLink>
          )}
          {user.status === 'guest' && (
            <>
              <NavLink to="/login" onClick={onToggle}>
                Login
              </NavLink>
              <NavLink to="/signup" onClick={onToggle}>
                Sign Up
              </NavLink>
            </>
          )}
        </Flex>
      </Collapse>
    </Box>
  );
}
