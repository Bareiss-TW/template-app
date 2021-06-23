import React from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';

const MyImage = (props) => {
    const [image] = useImage(props.img);
    return <Image image={image} />;
  };

  export default MyImage;