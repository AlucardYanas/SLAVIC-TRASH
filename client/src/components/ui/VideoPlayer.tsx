import React, { useRef, useState, useEffect } from 'react';
import { Box, Flex, Slider, SliderTrack, SliderFilledTrack, SliderThumb, IconButton } from '@chakra-ui/react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaThumbsUp, FaExpand } from 'react-icons/fa';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onEnd?: () => void;
  onLike?: () => void;
}

export default function VideoPlayer({ src, poster, onEnd, onLike }: VideoPlayerProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = src;
      videoRef.current.load();
      setIsPlaying(false);
      setProgress(0);
    }
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

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.volume = value / 100;
      setVolume(value / 100);
    }
  };

  const handleProgressChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = (videoRef.current.duration * value) / 100;
      setProgress(value);
    }
  };

  const updateProgress = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(isNaN(progress) ? 0 : progress); // Добавляем проверку на NaN
    }
  };

  const handleEnded = () => {
    if (onEnd) {
      onEnd();
    }
    setIsPlaying(false);
    setProgress(0);
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) { /* Firefox */
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) { /* IE/Edge */
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  return (
    <Box position="relative" w="600px" h="400px" mx="auto" bg="black">
      <Box
        as="video"
        ref={videoRef}
        src={src}
        poster={poster}
        width="100%"
        height="100%"
        onTimeUpdate={updateProgress}
        onEnded={handleEnded}
      />
      {!isPlaying && (
        <IconButton
          aria-label="Play"
          icon={<FaPlay />}
          onClick={togglePlayPause}
          colorScheme="green"
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
          colorScheme="green"
          size="sm"
        />
        <Slider
          aria-label="progress"
          value={progress}
          onChange={handleProgressChange}
          flex="1"
          mx="4"
          colorScheme="green"
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
          colorScheme="green"
          size="sm"
        />
        <Slider
          aria-label="volume"
          value={volume * 100}
          onChange={handleVolumeChange}
          maxW="100px"
          ml="4"
          colorScheme="green"
          size="sm"
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <IconButton
          aria-label="Like"
          icon={<FaThumbsUp />}
          onClick={onLike}
          colorScheme="green"
          size="sm"
        />
        <IconButton
          aria-label="Fullscreen"
          icon={<FaExpand />}
          onClick={toggleFullScreen}
          colorScheme="green"
          size="sm"
        />
      </Flex>
    </Box>
  );
}
