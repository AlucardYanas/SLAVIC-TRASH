import React from 'react';
import { Box, Button, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';

interface AdminModalProps {
  videoTitle: string;
  videoSrc: string;
}

export default function AdminModal({ videoTitle, videoSrc }: AdminModalProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Open Video</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mt={10} maxW="80vw" maxH="80vh" p={0}>
          <ModalCloseButton color="white" onClick={onClose} />
          <ModalBody p={0} display="flex" flexDirection="column" h="80%">
            <Box as="video" src={videoSrc} width="100%" height="100%" controls />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
