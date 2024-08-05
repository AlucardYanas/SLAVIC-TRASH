import React, { useState, useEffect, useRef } from 'react';
import { Button, Container, Flex, Slider, SliderTrack, SliderFilledTrack, SliderThumb, IconButton, Box, Alert, AlertIcon, Text } from '@chakra-ui/react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useGetPendingVideosQuery, useApproveVideoMutation, useDisapproveVideoMutation } from '../../redux/upload/uploadSlice';
import type { VideoType } from '../../types/types';

// Компонент VideoPlayer
export default function VideoPlayer({ src, poster, onEnd }): JSX.Element {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false); // Reset error state when src changes
  }, [src]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVolumeChange = (value) => {
    if (videoRef.current) {
      videoRef.current.volume = value / 100;
      setVolume(value / 100);
    }
  };

  const handleProgressChange = (value) => {
    if (videoRef.current) {
      videoRef.current.currentTime = (videoRef.current.duration * value) / 100;
      setProgress(value);
    }
  };

  const updateProgress = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(isNaN(progress) ? 0 : progress); // Handle NaN value
    }
  };

  const handleVideoError = () => {
    setError(true);
  };

  return (
    <Box position="relative" w="400px" h="400px" mx="auto" bg="black">
      {!error ? (
        <>
          <Box
            as="video"
            ref={videoRef}
            src={src}
            poster={poster}
            width="100%"
            height="100%"
            onTimeUpdate={updateProgress}
            onEnded={onEnd}
            onError={handleVideoError}
          />
          {!isPlaying && (
            <IconButton
              aria-label="Play"
              icon={<FaPlay />}
              onClick={togglePlayPause}
              colorScheme="teal"
              size="lg"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
            />
          )}
          <Flex
            position="absolute"
            bottom="4"
            left="4"
            right="4"
            alignItems="center"
            justifyContent="space-between"
            bg="rgba(0, 0, 0, 0.5)"
            p="2"
            borderRadius="md"
          >
            <IconButton
              aria-label={isPlaying ? 'Pause' : 'Play'}
              icon={isPlaying ? <FaPause /> : <FaPlay />}
              onClick={togglePlayPause}
              colorScheme="teal"
              size="sm"
            />
            <Slider
              aria-label="progress"
              value={progress}
              onChange={handleProgressChange}
              flex="1"
              mx="4"
              colorScheme="teal"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <IconButton
              aria-label="Volume"
              icon={volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
              onClick={() => handleVolumeChange(volume > 0 ? 0 : 100)}
              colorScheme="teal"
              size="sm"
            />
            <Slider
              aria-label="volume"
              value={volume * 100}
              onChange={handleVolumeChange}
              maxW="100px"
              ml="4"
              colorScheme="teal"
              size="sm"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Flex>
        </>
      ) : (
        <Text color="white">Video source not supported or not found.</Text>
      )}
    </Box>
  );
}

