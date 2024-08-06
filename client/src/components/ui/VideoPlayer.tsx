import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  IconButton,
} from '@chakra-ui/react';
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaThumbsUp,
  FaExpand,
  FaStepBackward,
  FaStepForward,
  FaShare,
} from 'react-icons/fa';

type VideoPlayerProps = {
  src: string;
  poster?: string;
  onEnd?: () => void;
  onLike?: () => void;
  videos?: { videoPath: string }[];
  currentVideoIndex: number;
  handleNextVideo: () => void;
  handlePrevVideo: () => void;
}

export default function VideoPlayer({
  src,
  poster,
  onEnd,
  onLike,
  videos = [],
  currentVideoIndex,
  handleNextVideo,
  handlePrevVideo,
}: VideoPlayerProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeSliderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      const prog = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(Number.isNaN(prog) ? 0 : prog);
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
      } else if (videoRef.current.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  const handleMouseEnterVolume = () => {
    if (volumeSliderTimeoutRef.current) {
      clearTimeout(volumeSliderTimeoutRef.current);
    }
    setShowVolumeSlider(true);
  };

  const handleMouseLeaveVolume = () => {
    volumeSliderTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 1000);
  };

  return (
    <Box
      position="relative"
      w="600px"
      h="400px"
      mx="auto"
      bg="black"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <Box
        as="video"
        ref={videoRef}
        src={src}
        poster={poster}
        width="100%"
        height="100%"
        onTimeUpdate={updateProgress}
        onEnded={handleEnded}
        onClick={togglePlayPause}
        zIndex={1}
      />
      {showControls && (
        <>
          <Flex
            position="absolute"
            top="50%"
            left="0"
            right="0"
            alignItems="center"
            justifyContent="space-between"
            transform="translateY(-50%)"
            zIndex={2}
          >
            <IconButton
              variant="solid"
              aria-label="Rewind"
              icon={<FaStepBackward />}
              onClick={handlePrevVideo}
              colorScheme="whiteAlpha"
              size="sm"
            />
            {!isPlaying && (
              <IconButton
                variant="solid"
                aria-label="Play"
                icon={<FaPlay />}
                onClick={togglePlayPause}
                colorScheme="whiteAlpha"
                size="lg"
              />
            )}
            <IconButton
              variant="solid"
              aria-label="Forward"
              icon={<FaStepForward />}
              onClick={handleNextVideo}
              colorScheme="whiteAlpha"
              size="sm"
            />
          </Flex>
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
            <Box
              position="relative"
              onMouseEnter={handleMouseEnterVolume}
              onMouseLeave={handleMouseLeaveVolume}
            >
              <IconButton
                mr={2}
                variant="solid"
                colorScheme="whiteAlpha"
                aria-label="Volume"
                icon={volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
                onClick={() => handleVolumeChange(volume > 0 ? 0 : 100)}
                size="sm"
              />
              {showVolumeSlider && (
                <Box
                  position="absolute"
                  bottom="100%"
                  left="50%"
                  transform="translateX(-50%)"
                  zIndex={3}
                >
                  <Slider
                    mr={2}
                    orientation="vertical"
                    aria-label="volume"
                    value={volume * 100}
                    onChange={handleVolumeChange}
                    minH="80px"
                    colorScheme="whiteAlpha"
                    size="sm"
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </Box>
              )}
            </Box>
            <IconButton
              mr={2}
              variant="solid"
              aria-label="Like"
              icon={<FaThumbsUp />}
              onClick={onLike}
              colorScheme="whiteAlpha"
              size="sm"
            />
            <IconButton
              mr={2}
              variant="solid"
              aria-label="Like"
              icon={<FaShare />}
              colorScheme="whiteAlpha"
              size="sm"
            />
            <IconButton
              variant="solid"
              aria-label="Fullscreen"
              icon={<FaExpand />}
              onClick={toggleFullScreen}
              colorScheme="whiteAlpha"
              size="sm"
            />
          </Flex>
        </>
      )}
    </Box>
  );
}
