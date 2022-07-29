/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import Container from 'common/Container';
import TeamWorkingIllustration from 'svg/illustrations/TeamWorking';

const ComingSoon = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

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
      minHeight={'calc(100vh - 64px - 183px)'}
      height={'100%'}
      display={'flex'}
      alignItems={'center'}
    >
      <Container>
        <Grid container spacing={6}>
          <Grid item container justifyContent={'center'} xs={12} md={6}>
            <Box
              height={'100%'}
              width={'100%'}
              maxWidth={{ xs: 500, md: '100%' }}
            >
              <TeamWorkingIllustration height={'100%'} width={'100%'} />
            </Box>
          </Grid>
          <Grid
            item
            container
            alignItems={'center'}
            justifyContent={'center'}
            xs={12}
            md={6}
          >
            <Box>
              <Typography
                variant="h3"
                component={'h3'}
                align={isMd ? 'left' : 'center'}
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                We are coming soon
              </Typography>
              <Typography
                component="p"
                color="textSecondary"
                align={isMd ? 'left' : 'center'}
              >
                Our website is under construction.
                <br />
                We'll be here soon with our new awesome site, subscribe to be
                notified.
              </Typography>
              <Box
                display="flex"
                flexDirection={'row'}
                justifyContent={'space-around'}
                marginY={2}
              >
                <Box
                  display="flex"
                  flexDirection={'column'}
                  alignItems={'center'}
                >
                  <Typography
                    variant={'h4'}
                    sx={{ fontWeight: 700 }}
                    color="primary"
                  >
                    13
                  </Typography>
                  <Typography>Days</Typography>
                </Box>
                <Box
                  display="flex"
                  flexDirection={'column'}
                  alignItems={'center'}
                >
                  <Typography
                    variant={'h4'}
                    sx={{ fontWeight: 700 }}
                    color="primary"
                  >
                    09
                  </Typography>
                  <Typography>Hours</Typography>
                </Box>
                <Box
                  display="flex"
                  flexDirection={'column'}
                  alignItems={'center'}
                >
                  <Typography
                    variant={'h4'}
                    sx={{ fontWeight: 700 }}
                    color="primary"
                  >
                    {minutes}
                  </Typography>
                  <Typography>Mins</Typography>
                </Box>
                <Box
                  display="flex"
                  flexDirection={'column'}
                  alignItems={'center'}
                >
                  <Typography
                    variant={'h4'}
                    sx={{ fontWeight: 700 }}
                    color="primary"
                  >
                    {seconds}
                  </Typography>
                  <Typography>Secs</Typography>
                </Box>
              </Box>
              <form noValidate autoComplete="off">
                <Box
                  display="flex"
                  flexDirection={{ xs: 'column', sm: 'row' }}
                  alignItems={{ xs: 'stretched', sm: 'flex-start' }}
                >
                  <Box
                    flex={'1 1 auto'}
                    component={TextField}
                    label="Enter your email"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    height={54}
                  />
                  <Box
                    component={Button}
                    variant="contained"
                    color="primary"
                    size="large"
                    height={54}
                    marginTop={{ xs: 2, sm: 0 }}
                    marginLeft={{ sm: 2 }}
                  >
                    Subscribe
                  </Box>
                </Box>
              </form>
              <Box marginTop={2} display={'flex'} justifyContent={'center'}>
                <IconButton aria-label="facebook">
                  <FacebookIcon />
                </IconButton>
                <IconButton aria-label="twitter">
                  <TwitterIcon />
                </IconButton>
                <IconButton aria-label="instagram">
                  <InstagramIcon />
                </IconButton>
                <IconButton aria-label="github">
                  <GitHubIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ComingSoon;
