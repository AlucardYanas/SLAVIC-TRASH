import React, { useState, useEffect } from 'react';
import { Button, Container, Flex, VStack, Box, Text, Alert, AlertIcon } from '@chakra-ui/react';
import VideoPlayer from '../ui/VideoPlayer';
import { useGetPendingVideosQuery, useApproveVideoMutation, useDisapproveVideoMutation } from '../../redux/upload/uploadSlice';
import type { VideoType } from '../../types/types';

export default function AdminPage(): JSX.Element {
  const { data: pendingVideos = [], refetch, error } = useGetPendingVideosQuery();
  const [approveVideo] = useApproveVideoMutation();
  const [disapproveVideo] = useDisapproveVideoMutation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setAlertMessage('Ошибка при получении видео');
    } else if (pendingVideos.length === 0) {
      setAlertMessage('Нет новых видео для одобрения');
    } else {
      setAlertMessage(null);
    }
  }, [pendingVideos, error]);

  const handleApprove = async () => {
    if (pendingVideos[currentIndex]) {
      await approveVideo({ id: pendingVideos[currentIndex].id });
      refetch();
      setCurrentIndex((prevIndex) => (prevIndex + 1 < pendingVideos.length ? prevIndex + 1 : 0));
    }
  };

  const handleDisapprove = async () => {
    if (pendingVideos[currentIndex]) {
      await disapproveVideo(pendingVideos[currentIndex].id);
      refetch();
      setCurrentIndex((prevIndex) => (prevIndex + 1 < pendingVideos.length ? prevIndex + 1 : 0));
    }
  };

  return (
    <Container maxW="container.xl" p={4}>
      <Flex direction="column" align="center" justify="center" height="100vh">
        {alertMessage && (
          <Alert status="info" mb={4}>
            <AlertIcon />
            {alertMessage}
          </Alert>
        )}
        {pendingVideos.length > 0 && (
          <>
            <VideoPlayer src={pendingVideos[currentIndex].videoPath} />
            <Flex mt={4}>
              <Button mr={2} colorScheme="green" onClick={handleApprove}>Approve</Button>
              <Button colorScheme="red" onClick={handleDisapprove}>Disapprove</Button>
            </Flex>
          </>
        )}
      </Flex>
    </Container>
  );
}
