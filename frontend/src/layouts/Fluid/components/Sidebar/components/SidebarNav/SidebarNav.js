import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const SidebarNav = ({ pages, onClose }) => {
  const theme = useTheme();
  const [activeLink, setActiveLink] = useState('');
  useEffect(() => {
    setActiveLink(window && window.location ? window.location.pathname : '');
  }, []);

  return (
    <Box>
      <Box
        display={'flex'}
        justifyContent={'flex-end'}
        onClick={() => onClose()}
      >
        <IconButton>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box paddingX={2} paddingBottom={2}>
        <Box>
          {pages.map((item, i) => (
            <Box key={i} marginBottom={4}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: 1,
                  display: 'block',
                }}
              >
                {item.title}
              </Typography>
              <Grid container spacing={1}>
                {item.pages.map((p, i) => (
                  <Grid item xs={6} key={i}>
                    <Link
                      variant="body2"
                      component={'a'}
                      href={p.href}
                      color={activeLink === p.href ? 'primary' : 'textPrimary'}
                      underline={'none'}
                      sx={{
                        fontWeight: activeLink === p.href ? 600 : 400,
                        '&:hover': {
                          textDecoration: 'none',
                          color: theme.palette.primary.dark,
                        },
                      }}
                      onClick={() => onClose()}
                    >
                      {p.title}
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
        <Box>
          <Button
            variant="outlined"
            fullWidth
            component="a"
            href="/docs-introduction"
          >
            Documentation
          </Button>
        </Box>
        <Box marginTop={1}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            component="a"
            target="blank"
            href="https://material-ui.com/store/items/webbee-landing-page/"
          >
            Purchase now
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

SidebarNav.propTypes = {
  pages: PropTypes.array.isRequired,
  onClose: PropTypes.func,
};

export default SidebarNav;
