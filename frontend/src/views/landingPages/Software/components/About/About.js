import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const About = () => {
  const theme = useTheme();

  const [viewPortEntered, setViewPortEntered] = useState(false);
  const setViewPortVisibility = (isVisible) => {
    if (viewPortEntered) {
      return;
    }

    setViewPortEntered(isVisible);
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
          About numbers
        </Typography>
        <Box
          component={Typography}
          fontWeight={700}
          variant={'h3'}
          align={'center'}
          gutterBottom
        >
          Modern web apps
          <br />
          shipped faster
        </Box>
        <Typography
          variant={'h6'}
          component={'p'}
          color={'textSecondary'}
          align={'center'}
        >
          Unlike teams from big agencies, we will treat your project as ours.
          <br />
          We will walk you through our smooth and simple process.
        </Typography>
      </Box>
      <Box marginBottom={{ xs: 4, sm: 6, md: 8 }}>
        <Grid container spacing={2}>
          {[
            {
              title: 4.89,
              label: 'Average User Rating',
              subtitle:
                '99% of our customers rated 5-star our themes over 5 years.',
              suffix: '/5',
            },
            {
              title: 200000,
              label: 'Mothly Installs',
              subtitle: '200,000+ installs we are having each months.',
              suffix: '+',
            },
            {
              title: 2394421,
              label: 'Total Downloads',
              subtitle: '2,394,421 total download in over 5 years.',
              suffix: '+',
            },
          ].map((item, i) => (
            <Grid key={i} item xs={12} md={4}>
              <Typography variant="h3" align={'center'} gutterBottom>
                <Box fontWeight={600}>
                  <VisibilitySensor
                    onChange={(isVisible) => setViewPortVisibility(isVisible)}
                    delayedCall
                  >
                    <CountUp
                      redraw={false}
                      end={viewPortEntered ? item.title : 0}
                      start={0}
                      suffix={item.suffix}
                    />
                  </VisibilitySensor>
                </Box>
              </Typography>
              <Typography align={'center'} variant="h6" gutterBottom>
                {item.label}
              </Typography>
              <Typography color="text.secondary" align={'center'} component="p">
                {item.subtitle}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box maxWidth={700} margin={'0 auto'} position={'relative'}>
        <Box
          component={LazyLoadImage}
          height={'100%'}
          width={'100%'}
          src={'https://assets.maccarianagency.com/backgrounds/img2.jpg'}
          alt="..."
          effect="blur"
          boxShadow={4}
          borderRadius={1.5}
        />
        <Box
          position={'absolute'}
          top={'50%'}
          left={'50%'}
          color={theme.palette.primary.main}
          zIndex={2}
          sx={{
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer',
          }}
        >
          <svg
            width={80}
            height={80}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        </Box>
      </Box>
    </Box>
  );
};

export default About;
