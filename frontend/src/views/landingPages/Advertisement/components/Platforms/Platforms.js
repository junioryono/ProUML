import React, { useState } from 'react';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

const Platforms = () => {
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
          Platforms
        </Typography>
        <Box
          component={Typography}
          fontWeight={700}
          variant={'h3'}
          align={'center'}
        >
          All your loved platforms
          <br />
          are now in one tool
        </Box>
      </Box>
      <Grid container spacing={2}>
        {[
          {
            title: 'Google Drive',
            subtitle:
              'Sync any file store to Google Drive for automated sharing with people outside the company.',
            icon:
              'https://assets.maccarianagency.com/svg/logos/google-drive.svg',
          },
          {
            title: 'Google Ad Manager',
            subtitle:
              'Easily manage and edit any Adwords campaign inline to improve ROI with constant review.',
            icon:
              'https://assets.maccarianagency.com/svg/logos/google-ad-manager.svg',
          },
          {
            title: 'Atlassian',
            subtitle:
              'Keep your entire team in sync with development and easily manage tasks, goals, and deadlines.',
            icon: 'https://assets.maccarianagency.com/svg/logos/atlassian.svg',
          },
        ].map((item, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Box
              component={'a'}
              href={''}
              display={'block'}
              width={'100%'}
              height={'100%'}
              sx={{
                textDecoration: 'none',
                transition: 'all .2s ease-in-out',
                '&:hover': {
                  transform: `translateY(-${theme.spacing(1 / 2)})`,
                },
              }}
            >
              <Box
                component={Card}
                width={'100%'}
                height={'100%'}
                data-aos={'fade-up'}
                borderRadius={3}
                flexDirection={'column'}
                display={'flex'}
              >
                <Box
                  component={CardContent}
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'center'}
                >
                  <Box
                    component={Avatar}
                    width={90}
                    height={90}
                    marginBottom={2}
                    src={item.icon}
                  />
                  <Box
                    component={Typography}
                    variant={'h6'}
                    gutterBottom
                    fontWeight={500}
                    align={'center'}
                  >
                    {item.title}
                  </Box>
                  <Typography align={'center'} color="textSecondary">
                    {item.subtitle}
                  </Typography>
                </Box>
                <Box flexGrow={1} />
                <Box component={CardActions} justifyContent={'flex-end'}>
                  <Button size="small">Learn More</Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box marginTop={4}>
        <Grid container spacing={2}>
          {[
            {
              title: 300,
              subtitle:
                '300 + component compositions, which will help you to build any page easily.',
              suffix: '+',
            },
            {
              title: 45,
              subtitle:
                '45 + landing and supported pages to Build a professional website.',
              suffix: '+',
            },
            {
              title: 99,
              subtitle:
                '99% of our customers rated 5-star our themes over 5 years.',
              suffix: '%',
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
              <Typography color="text.secondary" align={'center'} component="p">
                {item.subtitle}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Platforms;
