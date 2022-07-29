import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { colors } from '@mui/material';

const Hero = () => {
  const theme = useTheme();

  const GridItemHeadlineBlock = () => (
    <Box>
      <Box display={'flex'} alignItems={'center'} marginBottom={1}>
        <Box
          marginRight={1}
          paddingX={1}
          paddingY={1 / 4}
          bgcolor={colors.red[500]}
          borderRadius={1}
          color={theme.palette.common.white}
        >
          <Typography variant={'subtitle2'}>NEWS</Typography>
        </Box>
        <Button>Read the latest news</Button>
      </Box>
      <Typography
        variant="h2"
        align="left"
        gutterBottom
        sx={{
          fontWeight: 700,
        }}
      >
        Meet the technicians who unlock Crypto
      </Typography>
      <Typography
        variant="h6"
        component="p"
        color="textPrimary"
        sx={{ fontWeight: 400 }}
      >
        Over 300 stand-alone atomic components that will help you to boost your
        frontend development productivity.
      </Typography>
    </Box>
  );

  const GridItemFormBlock = () => {
    const [minutes, setMinutes] = useState(30);
    const [seconds, setSeconds] = useState(60);
    useEffect(() => {
      let myInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(myInterval);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
      return () => {
        clearInterval(myInterval);
      };
    });

    return (
      <Box
        padding={{ xs: 3, sm: 6 }}
        width={'100%'}
        component={Card}
        borderRadius={2}
        boxShadow={4}
      >
        <Box
          display="flex"
          flexDirection={'row'}
          justifyContent={'space-around'}
        >
          <Box display="flex" flexDirection={'column'} alignItems={'center'}>
            <Typography variant={'h3'} sx={{ fontWeight: 700 }}>
              13
            </Typography>
            <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
              Days
            </Typography>
          </Box>
          <Box display="flex" flexDirection={'column'} alignItems={'center'}>
            <Typography variant={'h3'} sx={{ fontWeight: 700 }}>
              09
            </Typography>
            <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
              Hours
            </Typography>
          </Box>
          <Box display="flex" flexDirection={'column'} alignItems={'center'}>
            <Typography variant={'h3'} sx={{ fontWeight: 700 }}>
              {minutes}
            </Typography>
            <Typography color="text.secondary">Minutes</Typography>
          </Box>
          <Box display="flex" flexDirection={'column'} alignItems={'center'}>
            <Typography variant={'h3'} sx={{ fontWeight: 700 }}>
              {seconds}
            </Typography>
            <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
              Seconds
            </Typography>
          </Box>
        </Box>
        <Box marginY={4}>
          <Button
            sx={{ height: 54 }}
            variant="contained"
            color="primary"
            size="medium"
            fullWidth
          >
            Register now
          </Button>
        </Box>
        <Box
          display={'flex'}
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'flex-start'}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            <Box>
              {[1, 2, 3, 4, 5].map((item) => (
                <Box
                  key={item}
                  color={theme.palette.secondary.main}
                  display={'inline'}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width={20}
                    height={20}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </Box>
              ))}
            </Box>
            <Typography variant={'caption'}>Average score: 4.9/5</Typography>
          </Box>
          <Box
            display={'flex'}
            flexDirection={'row'}
            alignItems={'center'}
            width={{ xs: '100%', sm: 'auto' }}
          >
            <Box
              component={Avatar}
              variant={'rounded'}
              bgcolor={theme.palette.common.black}
              width={{ xs: '50%', sm: 50 }}
              height={50}
            >
              <img
                src={
                  'https://assets.maccarianagency.com/svg/icons/app-store-icon.svg'
                }
                alt={'app store'}
              />
            </Box>
            <Box
              component={Avatar}
              variant={'rounded'}
              bgcolor={theme.palette.common.black}
              marginLeft={1}
              width={{ xs: '50%', sm: 50 }}
              height={50}
            >
              <img
                src={
                  'https://assets.maccarianagency.com/svg/icons/play-store-icon.svg'
                }
                alt={'play store'}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const GridItemPartnersBlock = () => (
    <Box display="flex" flexWrap="wrap" justifyContent={'center'}>
      {[
        'https://assets.maccarianagency.com/svg/logos/airbnb-original.svg',
        'https://assets.maccarianagency.com/svg/logos/amazon-original.svg',
        'https://assets.maccarianagency.com/svg/logos/fitbit-original.svg',
        'https://assets.maccarianagency.com/svg/logos/netflix-original.svg',
        'https://assets.maccarianagency.com/svg/logos/google-original.svg',
        'https://assets.maccarianagency.com/svg/logos/paypal-original.svg',
      ].map((item, i) => (
        <Box maxWidth={90} marginTop={2} marginRight={4} key={i}>
          <Box
            component="img"
            height={'100%'}
            width={'100%'}
            src={item}
            alt="..."
            sx={{
              filter:
                theme.palette.mode === 'dark'
                  ? 'brightness(0) invert(0.7)'
                  : 'none',
            }}
          />
        </Box>
      ))}
    </Box>
  );

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box width={1} height="100%" display="flex" alignItems="center">
            <GridItemHeadlineBlock />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box width={1} height="100%" display="flex" alignItems="center">
            <GridItemFormBlock />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <GridItemPartnersBlock />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;
