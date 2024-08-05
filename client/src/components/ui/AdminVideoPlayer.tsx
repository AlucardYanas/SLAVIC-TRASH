import React, { useState } from 'react';
import { Box, Flex, Slider, SliderTrack, SliderFilledTrack, SliderThumb, IconButton } from '@chakra-ui/react';
import { FaExpand } from 'react-icons/fa';

interface AdminVideoPlayerProps {
  src: string;
  poster?: string;
}

export default function AdminVideoPlayer({ src, poster }: AdminVideoPlayerProps): JSX.Element {
  const [progress, setProgress] = useState(0);

  const handleProgressChange = (value: number) => {
    setProgress(isNaN(value) ? 0 : value); // Проверка на NaN
  };

  return (
    <Box position="relative" w="600px" h="400px" mx="auto" bg="black">
      <Box
        as="video"
        src={src}
        poster={poster}
        width="100%"
        height="100%"
      />
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
          aria-label="Fullscreen"
          icon={<FaExpand />}
          colorScheme="green"
          size="sm"
        />
      </Flex>
    </Box>
  );
}
