declare module 'react-slick' {
  import type { FunctionComponent } from 'react';

  type Settings = {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    responsive?: {
      breakpoint: number;
      settings: Partial<Settings>;
    }[];
  };

  const Slider: FunctionComponent<Settings>;

  export default Slider;
}
