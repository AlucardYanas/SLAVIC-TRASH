import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Flex,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  IconButton,
} from '@chakra-ui/react';
import { FaExpand, FaPause, FaPlay } from 'react-icons/fa';

type AdminVideoPlayerProps = {
  src: string;
  poster?: string;
};

export default function AdminVideoPlayer({ src, poster }: AdminVideoPlayerProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleProgressChange = (value: number): void => {
    setProgress(Number.isNaN(value) ? 0 : value); // Проверка на NaN
    if (videoRef.current) {
      const newTime = (value / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = src;
      videoRef.current.load();
      setIsPlaying(false);
      setProgress(0);
    }
  }, [src]);

  const togglePlayPause = (): void => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        void videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const updateProgress = (): void => {
    if (videoRef.current) {
      const prog = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(Number.isNaN(prog) ? 0 : prog);
    }
  };

  const toggleFullScreen = (): void => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen().catch((error) => {
        console.error(error);
      });
    }
  };

  return (
    <Box position="relative" w="600px" h="400px" mx="auto" bg="black" mt="50px">
      <Box
        as="video"
        ref={videoRef}
        src={src}
        poster={poster}
        width="100%"
        height="100%"
        onTimeUpdate={updateProgress}
        onClick={togglePlayPause}
        zIndex={1}
      />
      <Flex
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        alignItems="center"
        justifyContent="space-between"
        bg="rgba(0, 0, 0, 0.5)"
        p="2"
        borderRadius="md"
        zIndex={2}
      >
        <IconButton
          variant="solid"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          icon={isPlaying ? <FaPause /> : <FaPlay />}
          onClick={togglePlayPause}
          colorScheme="whiteAlpha"
          size="sm"
        />
        <Slider
          aria-label="progress"
          value={progress}
          onChange={handleProgressChange}
          flex="1"
          mx="4"
          colorScheme="whiteAlpha"
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <IconButton
          variant="solid"
          aria-label="Fullscreen"
          icon={<FaExpand />}
          onClick={toggleFullScreen}
          colorScheme="whiteAlpha"
          size="sm"
        />
      </Flex>
    </Box>
  );
}
