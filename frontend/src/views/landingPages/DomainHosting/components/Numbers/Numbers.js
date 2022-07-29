import React, { useState } from 'react';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const Numbers = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

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
      boxShadow={4}
      borderTop={`4px solid ${theme.palette.primary.main}`}
    >
      <Grid container spacing={2} data-aos={'fade-up'}>
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
          <Box
            component={Grid}
            key={i}
            item
            xs={12}
            md={4}
            borderLeft={
              i === 1 && isMd ? `1px solid ${theme.palette.divider}` : 0
            }
            borderRight={
              i === 1 && isMd ? `1px solid ${theme.palette.divider}` : 0
            }
            borderTop={
              i === 1 && !isMd ? `1px solid ${theme.palette.divider}` : 0
            }
            borderBottom={
              i === 1 && !isMd ? `1px solid ${theme.palette.divider}` : 0
            }
          >
            <CardContent>
              <Typography variant="h4" gutterBottom>
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
              <Typography color="text.secondary" component="p">
                {item.subtitle}
              </Typography>
            </CardContent>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default Numbers;
