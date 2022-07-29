/* eslint-disable react/no-unescaped-entities */

import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

const HowItWorks = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box marginBottom={4}>
        <Typography
          sx={{
            textTransform: "uppercase",
            fontWeight: "medium",
          }}
          gutterBottom
          color={"secondary"}
          align={"center"}
        >
          Seamless Intergations
        </Typography>
        <Typography
          variant="h3"
          align={"center"}
          data-aos={"fade-up"}
          gutterBottom
          sx={{
            fontWeight: 700,
          }}
        >
          Data transfer is just a few clicks.
        </Typography>
        <Typography variant="h6" align={"center"} color={"textSecondary"} data-aos={"fade-up"}>
          If we're no longer the right solution for you, <br />
          we'll allow you to export and take your data at anytime for any reason.
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {[
          {
            title: "Authentication",
            subtitle:
              "We meet with your team to know more about your idea, project and goal. After that, our team sits to create an action plan and proposal for your project.",
            icon: (
              <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
                />
              </svg>
            ),
          },
          {
            title: "Developer first",
            subtitle:
              "We start by designing a mockup or prototype of your website/app, and present it to you. Once with the initial mockup, we start the revision process to perfect it.",
            icon: (
              <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            ),
          },
          {
            title: "NPM support",
            subtitle: "We develop your website using the best practices and standards, so you have a perfectly responsive, lightning fast, and super scalable website.",
            icon: (
              <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            ),
          },
        ].map((item, i) => (
          <Grid key={i} item xs={12} md={4}>
            <Box
              component={ListItem}
              disableGutters
              data-aos={"fade-up"}
              flexDirection={"column"}
              sx={{
                padding: 0,
                alignItems: "flex-start",
              }}
            >
              <Box component={ListItemAvatar} marginBottom={2}>
                <Box component={Avatar} bgcolor={alpha(theme.palette.primary.main, 0.1)} width={60} height={60}>
                  <Box color={theme.palette.primary.main}>{item.icon}</Box>
                </Box>
              </Box>
              <ListItemText
                sx={{ margin: 0 }}
                primary={item.title}
                secondary={item.subtitle}
                primaryTypographyProps={{
                  variant: "h6",
                  gutterBottom: true,
                  sx: { fontWeight: 700 },
                }}
              />
            </Box>
          </Grid>
        ))}
        <Grid item container justifyContent={"center"}>
          <Button
            size={"large"}
            endIcon={
              <svg width={16} height={26} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            }
          >
            Learn more
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HowItWorks;
