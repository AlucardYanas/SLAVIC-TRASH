import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import useAuth from '../hooks/useAuth';

type FormEvent = React.FormEvent<HTMLFormElement>;

export default function SignUpPage(): JSX.Element {
  const { signup, isLoading, error } = useAuth();

  const handleSignup = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    await signup(name, email, password);
  };

  return (
    <Box maxW="md" mx="auto" mt="10" p="6" borderWidth="1px" borderRadius="lg">
      <VStack spacing="5">
        <Text fontSize="2xl" fontWeight="bold">Sign Up</Text>
        {isLoading && <Text>Loading...</Text>}
        {error && <Text color="red.500">Error: {error}</Text>}
        <form onSubmit={handleSignup} style={{ width: '100%' }}>
          <VStack spacing="4">
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">Sign Up</Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
}
