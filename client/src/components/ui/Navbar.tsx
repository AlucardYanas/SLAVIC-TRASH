import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Button,
  useColorModeValue,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useAppSelector } from '../hooks/reduxHooks';

export default function NavBar(): JSX.Element {
  const { logoutHandler } = useAuth();
  const user = useAppSelector((state) => state.auth.user);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          <IconButton
            aria-label="Open Menu"
            icon={<HamburgerIcon />}
            display={{ base: 'inline-flex', md: 'none' }}
            onClick={onOpen}
          />
        </Flex>
      </Flex>

      <Drawer placement="top" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start">
              <NavLink to="/" onClick={onClose}>Main</NavLink>
              {user.status === 'logged' && <NavLink to="/account" onClick={onClose}>Account</NavLink>}
              {user.status === 'guest' && (
                <>
                  <NavLink to="/login" onClick={onClose}>Login</NavLink>
                  <NavLink to="/signup" onClick={onClose}>Sign Up</NavLink>
                </>
              )}
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Button colorScheme="red" onClick={logoutHandler}>Logout</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
