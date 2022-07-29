import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import CardActions from '@mui/material/CardActions';

const pricing = [
  {
    title: 'Basic',
    price: {
      monthly: 22,
      annual: 210,
    },
    features: [
      {
        title: '1 User',
        isIncluded: true,
      },
      {
        title: '1 App',
        isIncluded: true,
      },
      {
        title: 'Integrations',
        isIncluded: true,
      },
      {
        title: 'Google Ads',
        isIncluded: false,
      },
      {
        title: 'SSO via Google',
        isIncluded: false,
      },
      {
        title: 'API access',
        isIncluded: false,
      },
      {
        title: 'Facebook Ads',
        isIncluded: false,
      },
    ],
    isHighlighted: false,
    btnText: 'Get basic',
  },
  {
    title: 'Professional',
    price: {
      annual: 420,
      monthly: 44,
    },
    features: [
      {
        title: '1 User',
        isIncluded: true,
      },
      {
        title: '1 App',
        isIncluded: true,
      },
      {
        title: 'Integrations',
        isIncluded: true,
      },
      {
        title: 'Google Ads',
        isIncluded: true,
      },
      {
        title: 'SSO via Google',
        isIncluded: true,
      },
      {
        title: 'API access',
        isIncluded: false,
      },
      {
        title: 'Facebook Ads',
        isIncluded: false,
      },
    ],
    isHighlighted: true,
    btnText: 'Get pro',
  },
  {
    title: 'Commercial',
    price: {
      annual: 740,
      monthly: 77,
    },
    features: [
      {
        title: '1 User',
        isIncluded: true,
      },
      {
        title: '1 App',
        isIncluded: true,
      },
      {
        title: 'Integrations',
        isIncluded: true,
      },
      {
        title: 'Google Ads',
        isIncluded: true,
      },
      {
        title: 'SSO via Google',
        isIncluded: true,
      },
      {
        title: 'API access',
        isIncluded: true,
      },
      {
        title: 'Facebook Ads',
        isIncluded: true,
      },
    ],
    isHighlighted: false,
    btnText: 'Contact us',
  },
];

const PricingCards = () => {
  const theme = useTheme();
  const [pricingOption, setPricingOption] = useState('annual');

  const handleClick = (event, newPricingOption) => {
    setPricingOption(newPricingOption);
  };

  return (
    <Box>
      <Box marginBottom={4}>
        <Box
          component={Typography}
          fontWeight={700}
          variant={'h3'}
          align={'center'}
        >
          Pick the best plan based
          <br />
          on your business needs
        </Box>
      </Box>
      <Box>
        <Box display={'flex'} justifyContent={'center'} marginBottom={4}>
          <ToggleButtonGroup
            value={pricingOption}
            exclusive
            onChange={handleClick}
          >
            <ToggleButton
              value="monthly"
              size={'small'}
              sx={{
                backgroundColor:
                  pricingOption === 'monthly'
                    ? `${theme.palette.primary.light} !important`
                    : 'transparent',
                border: `1px solid ${theme.palette.primary.main}`,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 'medium',
                  color:
                    pricingOption !== 'annual'
                      ? theme.palette.common.white
                      : 'primary',
                }}
              >
                Monthly
              </Typography>
            </ToggleButton>
            <ToggleButton
              value="annual"
              size={'small'}
              sx={{
                backgroundColor:
                  pricingOption === 'annual'
                    ? `${theme.palette.primary.light} !important`
                    : 'transparent',
                border: `1px solid ${theme.palette.primary.main}`,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 'medium',
                  color:
                    pricingOption === 'annual'
                      ? theme.palette.common.white
                      : 'primary',
                }}
              >
                Annual
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Grid container spacing={4}>
          {pricing.map((item, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Box
                component={Card}
                height={'100%'}
                display={'flex'}
                flexDirection={'column'}
                boxShadow={item.isHighlighted ? 4 : 0}
                borderRadius={4}
              >
                <Box component={CardContent} padding={4}>
                  <Box
                    marginBottom={4}
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={'center'}
                  >
                    <Box
                      marginBottom={1}
                      display={'flex'}
                      width={'100%'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <Typography variant={'h6'}>
                        <Box component={'span'} fontWeight={600}>
                          {item.title}
                        </Box>
                      </Typography>
                      <Box display={'flex'} alignItems={'flex-start'}>
                        <Typography variant={'h4'} color={'primary'}>
                          <Box
                            component={'span'}
                            fontWeight={600}
                            marginRight={1 / 2}
                          >
                            $
                          </Box>
                        </Typography>
                        <Typography variant={'h3'} color={'primary'}>
                          <Box component={'span'} fontWeight={600}>
                            {pricingOption === 'annual'
                              ? item.price.annual
                              : item.price.monthly}
                          </Box>
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant={'subtitle2'} color={'textSecondary'}>
                      Per user, per{' '}
                      {pricingOption === 'annual' ? 'year' : 'month'}
                    </Typography>
                  </Box>
                  <Grid container spacing={1}>
                    {item.features.map((feature, j) => (
                      <Grid item xs={12} key={j}>
                        <Typography
                          component={'p'}
                          align={'center'}
                          style={{
                            textDecoration: !feature.isIncluded
                              ? 'line-through'
                              : 'none',
                          }}
                        >
                          {feature.title}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Box flexGrow={1} />
                <Box
                  component={CardActions}
                  justifyContent={'center'}
                  padding={4}
                >
                  <Button
                    size={'large'}
                    variant={item.isHighlighted ? 'contained' : 'outlined'}
                  >
                    {item.btnText}
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default PricingCards;
