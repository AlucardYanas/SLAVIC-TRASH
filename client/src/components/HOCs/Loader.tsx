import { Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

export type LoadingType = {
  isLoading: boolean;
  children: JSX.Element;
};
export default function Loader({ isLoading, children }: LoadingType): JSX.Element {
  if (isLoading) {
    return (
      <Flex direction="column" align="center" justify="center" flex="1">
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Flex>
    );
  }
  return children;
}
