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

  const handleApproveClick = (): void => {
    void handleApprove();
  };

  const handleDisapproveClick = (): void => {
    void handleDisapprove();
  };

  const currentVideo = pendingVideos[currentVideoIndex];

  return (
    <Flex direction="column" align="center" justify="center" height="calc(100vh - 8rem)">
      <Flex direction="column" align="center" justify="center" flex="1">
        {alertMessage && (
          <Alert status="warning" mb={4}>
            <AlertIcon />
            {alertMessage}
          </Alert>
        )}
        {currentVideo && (
          <>
            <AdminVideoPlayer src={currentVideo.videoPath} />
            <Flex mt={4}>
              <Button mr={2} colorScheme="green" onClick={handleApproveClick}>
                Одобрить
              </Button>
              <Button colorScheme="red" onClick={handleDisapproveClick}>
                Отклонить
              </Button>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
}
