import React from 'react';
import { Button, Checkbox, Container, Flex } from '@chakra-ui/react';
import AdminModal from '../ui/AdminModal';

export default function AdminPage(): JSX.Element {
  return (
    <Container maxW="container.xl" p={4}>
      <Flex direction="row" align="center" justify="space-between" height="calc(100vh - 8rem)">
        {/* Центральная часть с модальным окном */}
        <Flex direction="column" align="center" justify="center" flex="1">
          <AdminModal
            videoTitle="Sample Video"
            videoSrc="https://videos.pexels.com/video-files/9001899/9001899-hd_1920_1080_25fps.mp4"
          />
        </Flex>

        <Button position="absolute" bottom={4} left={4} colorScheme="teal" variant="solid">
          Approve
        </Button>

        <Button position="absolute" bottom={4} right={4} colorScheme="teal" variant="solid">
          Disapprove
        </Button>
      </Flex>
    </Container>
  );
}
