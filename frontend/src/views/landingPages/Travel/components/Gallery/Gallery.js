import React, { useState } from 'react';
import Slider from 'react-slick';
import Lightbox from 'react-image-lightbox';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';

const photos = [
  {
    src: 'https://assets.maccarianagency.com/backgrounds/img13.jpg',
    title: 'New York',
  },
  {
    src: 'https://assets.maccarianagency.com/backgrounds/img14.jpg',
    title: 'Paris',
  },
  {
    src: 'https://assets.maccarianagency.com/backgrounds/img15.jpg',
    title: 'Barcelona',
  },
  {
    src: 'https://assets.maccarianagency.com/backgrounds/img16.jpg',
    title: 'Prague',
  },
  {
    src: 'https://assets.maccarianagency.com/backgrounds/img17.jpg',
    title: 'Milan',
  },
  {
    src: 'https://assets.maccarianagency.com/backgrounds/img18.jpg',
    title: 'Yerevan',
  },
  {
    src: 'https://assets.maccarianagency.com/backgrounds/img13.jpg',
    title: 'New York',
  },
  {
    src: 'https://assets.maccarianagency.com/backgrounds/img14.jpg',
    title: 'Paris',
  },
  {
    src: 'https://assets.maccarianagency.com/backgrounds/img15.jpg',
    title: 'Barcelona',
  },
  {
    src: 'https://assets.maccarianagency.com/backgrounds/img16.jpg',
    title: 'Prague',
  },
  {
    src: 'https://assets.maccarianagency.com/backgrounds/img17.jpg',
    title: 'Milan',
  },
  {
    src: 'https://assets.maccarianagency.com/backgrounds/img18.jpg',
    title: 'Yerevan',
  },
];

const Gallery = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.up('xs'), {
    defaultMatches: true,
  });
  const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true,
  });
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });
  const isLg = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true,
  });

  let slidesToShow = 1;
  if (isXs) {
    slidesToShow = 1;
  }
  if (isSm) {
    slidesToShow = 2;
  }
  if (isMd) {
    slidesToShow = 3;
  }
  if (isLg) {
    slidesToShow = 4;
  }

  const sliderOpts = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
  };

  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox = (index) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  };

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  return (
    <Box>
      <Box marginBottom={4}>
        <Typography
          sx={{
            textTransform: 'uppercase',
            fontWeight: 'medium',
          }}
          gutterBottom
          color={'secondary'}
          align={'center'}
        >
          Gallery
        </Typography>
        <Box
          component={Typography}
          fontWeight={700}
          variant={'h3'}
          align={'center'}
          data-aos={'fade-up'}
        >
          Enjoy our gallery
        </Box>
        <Box
          marginTop={2}
          display={'flex'}
          justifyContent={'center'}
          data-aos="fade-up"
        >
          <Button
            color={'primary'}
            variant={'contained'}
            size={'large'}
            onClick={() => openLightbox(0)}
          >
            View all
          </Button>
        </Box>
      </Box>
      <Slider {...sliderOpts}>
        {photos.map((item, i) => (
          <Box key={i} paddingX={2}>
            <Box
              component={Card}
              width={'100%'}
              height={'100%'}
              borderRadius={3}
              onClick={() => openLightbox(i)}
              sx={{
                cursor: 'pointer',
              }}
            >
              <CardMedia
                image={item.src}
                title={item.title}
                sx={{
                  height: 340,
                }}
              />
            </Box>
          </Box>
        ))}
      </Slider>
      {viewerIsOpen && (
        <Lightbox
          mainSrc={photos[currentImage].src}
          nextSrc={photos[(currentImage + 1) % photos.length].src}
          prevSrc={
            photos[(currentImage + photos.length - 1) % photos.length].src
          }
          onCloseRequest={() => closeLightbox()}
          onMovePrevRequest={() =>
            setCurrentImage((currentImage + photos.length - 1) % photos.length)
          }
          onMoveNextRequest={() =>
            setCurrentImage((currentImage + 1) % photos.length)
          }
          reactModalStyle={{ overlay: { zIndex: 1500 } }}
        />
      )}
    </Box>
  );
};

export default Gallery;
