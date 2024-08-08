import { extendTheme } from '@chakra-ui/react';
import '@fontsource/rubik-marker-hatch'; // Defaults to weight 400

const theme = extendTheme({
  fonts: {
    heading: 'Rubik Marker Hatch',
    body: 'Rubik Marker Hatch',
  },
});

export default theme;
