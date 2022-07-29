/* eslint-disable react/no-unescaped-entities */

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Chart2Illustration from "svg/illustrations/Chart2";
import Chart3Illustration from "svg/illustrations/Chart3";
import Chart4Illustration from "svg/illustrations/Chart4";

const Features = () => {
  const theme = useTheme();

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item container alignItems={"center"} xs={12} md={6}>
          <Box>
            <Box marginBottom={2}>
              <Typography variant={"h4"} sx={{ fontWeight: 700 }} gutterBottom>
                Payment made easy in stores with speed and security using.
              </Typography>
              <Typography color="text.secondary">
                When paying in stores, it doesn't share your actual card number, so your information stays secure. Plus, you can check out faster and easier.
              </Typography>
            </Box>
            <Grid container spacing={1}>
              {["All features", "Email support", "Google Ads", "SSO via Google", "API access", "Facebook Ads"].map((item, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Box component={ListItem} disableGutters width={"auto"} padding={0}>
                    <Box component={ListItemAvatar} minWidth={"auto !important"} marginRight={2}>
                      <Box component={Avatar} bgcolor={theme.palette.secondary.main} width={20} height={20}>
                        <svg width={12} height={12} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Box>
                    </Box>
                    <ListItemText primary={item} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box height={"100%"} width={"100%"} display={"flex"} flexDirection={"column"}>
            <Box height={"100%"} width={"100%"} maxWidth={"50%"} marginLeft={"40%"} zIndex={3}>
              <Chart3Illustration width={"100%"} height={"100%"} />
            </Box>
            <Box height={"100%"} width={"100%"} maxWidth={"50%"} marginTop={"-35%"} zIndex={2}>
              <Chart2Illustration width={"100%"} height={"100%"} />
            </Box>
            <Box height={"100%"} width={"100%"} maxWidth={"50%"} marginTop={"-20%"} marginLeft={"20%"} zIndex={1}>
              <Chart4Illustration width={"100%"} height={"100%"} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Features;
