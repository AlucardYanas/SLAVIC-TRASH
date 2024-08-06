import React, { useState, useEffect } from 'react';
import { Button, Container, Flex, Text, Alert, AlertIcon } from '@chakra-ui/react';
import AdminVideoPlayer from '../ui/AdminVideoPlayer';
import {
  useGetPendingVideosQuery,
  useApproveVideoMutation,
  useDisapproveVideoMutation,
} from '../../redux/upload/uploadSlice';

export default function AdminPage(): JSX.Element {
  const { data: pendingVideos = [], refetch, error } = useGetPendingVideosQuery();
  const [approveVideo] = useApproveVideoMutation();
  const [disapproveVideo] = useDisapproveVideoMutation();
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  console.log(approveVideo);

  useEffect(() => {
    if (error) {
      setAlertMessage('Ошибка при получении видео');
    } else if (pendingVideos.length === 0) {
      setAlertMessage('Нет новых видео для одобрения');
    } else {
      setAlertMessage(null);
    }
  }, [pendingVideos, error]);

  const handleNextVideo = (): void => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % pendingVideos.length);
  };

  const handleApprove = async (): Promise<void> => {
    const selectedVideo = pendingVideos[currentVideoIndex];
    if (selectedVideo) {
      await approveVideo({ id: selectedVideo.id });
      await refetch();
      handleNextVideo();
    }
  };

  const handleDisapprove = async (): Promise<void> => {
    const selectedVideo = pendingVideos[currentVideoIndex];
    if (selectedVideo) {
      await disapproveVideo(selectedVideo.id);
      await refetch();
      handleNextVideo();
    }
  };

  const currentVideo = pendingVideos[currentVideoIndex];

  return (
    <Container maxW="container.xl" p={4}>
      <Flex direction="column" align="center" justify="center" height="100vh">
        {alertMessage && (
          <Alert status="info" mb={4}>
            <AlertIcon />
            {alertMessage}
          </Alert>
        )}
        {currentVideo ? (
          <>
            <AdminVideoPlayer src={currentVideo.videoPath} />
            <Flex mt={4}>
              <Button mr={2} colorScheme="green" onClick={() => handleApprove}>
                Одобрить
              </Button>
              <Button colorScheme="red" onClick={() => handleDisapprove}>
                Отклонить
              </Button>
            </Flex>
          </>
        ) : (
          <Text>Нет новых видео для одобрения</Text>
        )}
      </Flex>
    </Container>
  );
}
