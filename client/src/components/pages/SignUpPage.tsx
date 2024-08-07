import React from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Text,
  VStack,
  Link,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function SignUpPage(): JSX.Element {
  const { signUpHandler } = useAuth();
  return (
    <Flex direction="row" align="center" justify="space-between" height="calc(100vh - 8rem)">
      <Flex direction="column" align="center" justify="center" flex="1">
        <Box
          as="form"
          onSubmit={signUpHandler}
          bg="gray.900"
          w="335px"
          h="340px"
          p={8}
          borderRadius="md"
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            align="center"
            mb={4}
            color="gray.100"
          >
            Создать аккаунт
          </Text>

          <VStack spacing={4}>
            <FormControl isRequired>
              <Input
                placeholder="Придумайте логин"
                name="username"
                bg="gray.100"
                borderRadius="md"
              />
            </FormControl>

            <FormControl isRequired>
              <Input
                type="password"
                name="password"
                placeholder="Придумайте пароль"
                bg="gray.100"
                borderRadius="md"
              />
            </FormControl>

            <Button
              type="submit"
              size="lg"
              variant="solid"
              colorScheme="orange"
              width="222px"
              height="48px"
              padding="0 24px"
              gap="8px"
              borderRadius="6px"
              opacity="1"
              mt={4}
            >
              Создать
            </Button>
          </VStack>
          <Flex justifyContent="center" mt={4}>
            <Text
              width="217px"
              height="20px"
              fontFamily="Inter"
              fontSize="14px"
              fontWeight="500"
              lineHeight="20px"
              textAlign="center"
              color="white"
            >
              Уже зарегистрированы?{' '}
              <Link as={NavLink} to="/login" color="orange.500" _hover={{ color: "orange.700" }}>
                Войти
              </Link>
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}
