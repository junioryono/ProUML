/* eslint-disable react/no-unescaped-entities */

import { useTheme } from "@mui/material/styles";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import CyclingIllustration from "svg/illustrations/Cycling";

const Services = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  return (
    <Box>
      <Box marginBottom={{ xs: 4, sm: 8, md: 12 }}>
        <Typography
          sx={{
            textTransform: "uppercase",
            fontWeight: "medium",
          }}
          gutterBottom
          color={"secondary"}
          align={"center"}
        >
          How we work
        </Typography>
        <Box component={Typography} fontWeight={700} variant={"h3"} align={"center"} gutterBottom data-aos="fade-up">
          Why choose us?
        </Box>
        <Typography variant={"h6"} component={"p"} color={"textSecondary"} align={"center"} data-aos="fade-up">
          Travel is the movement of people between distant geographical locations.
          <br />
          Travel can be done by foot, bicycle, automobile, train, boat, bus, airplane, ship or other means, with or without luggage, and can be one way or round trip.
        </Typography>
      </Box>
      <Grid container spacing={4} direction={isMd ? "row" : "column-reverse"}>
        <Grid item xs={12} md={6} data-aos={isMd ? "fade-right" : "fade-up"}>
          <Box marginBottom={4}>
            <Typography
              sx={{
                textTransform: "uppercase",
                fontWeight: "medium",
              }}
              gutterBottom
              color={"secondary"}
            >
              popular travellers
            </Typography>
            <Box component={Typography} fontWeight={700} variant={"h4"} gutterBottom>
              <Typography color="primary" variant="inherit" component="span">
                Share your memories
              </Typography>{" "}
              with your travel buddies
            </Box>
            <Typography variant={"h6"} component={"p"} color={"textSecondary"}>
              Don't listen to what they say go and see.
              <br />
              Travelling with our app is easy.
              <br />
              Join the biggest community of travellers.
            </Typography>
          </Box>
          <List disablePadding>
            {[
              {
                icon: (
                  <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                ),
                title: "Sign Up",
                subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              },
              {
                icon: (
                  <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                ),
                title: "Create Events",
                subtitle: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              },
              {
                icon: (
                  <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                ),
                title: "Share memories",
                subtitle: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
              },
            ].map((item, index) => (
              <ListItem key={index} disableGutters data-aos="fade-up">
                <ListItemAvatar>
                  <Box component={Avatar} variant={"rounded"} color={theme.palette.primary.dark} bgcolor={`${theme.palette.primary.light}22`}>
                    {item.icon}
                  </Box>
                </ListItemAvatar>
                <ListItemText primary={item.title} secondary={item.subtitle} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center" xs={12} md={6} data-aos={isMd ? "fade-left" : "fade-up"}>
          <Box maxWidth={600} width={"100%"}>
            <CyclingIllustration width={"100%"} height={"100%"} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Services;
