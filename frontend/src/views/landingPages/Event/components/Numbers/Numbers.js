import React, { useState } from 'react';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const Numbers = () => {
  const theme = useTheme();
  const [viewPortEntered, setViewPortEntered] = useState(false);
  const setViewPortVisibility = (isVisible) => {
    if (viewPortEntered) {
      return;
    }

    setViewPortEntered(isVisible);
  };

  return (
    <Box
      component={Card}
      boxShadow={22}
      borderTop={`4px solid ${theme.palette.primary.main}`}
    >
      <Grid container spacing={2} data-aos={'fade-up'}>
        {[
          {
            title: 55,
            subtitle: 'Community members',
            suffix: 'K+',
          },
          {
            title: 100,
            subtitle: 'Podcast downloads',
            suffix: 'M+',
          },
          {
            title: 1,
            subtitle: 'Podcast subscribers',
            suffix: 'M+',
          },
          {
            title: 250,
            subtitle: 'Special guests',
            suffix: '+',
          },
        ].map((item, i) => (
          <Grid key={i} item xs={6} md={3}>
            <CardContent>
              <Typography variant="h3" gutterBottom align={'center'}>
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
              <Typography variant="h6" align={'center'}>
                {item.subtitle}
              </Typography>
            </CardContent>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Numbers;
