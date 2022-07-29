/* eslint-disable react/no-unescaped-entities */

import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";

const Hero = () => {
  const theme = useTheme();

  const GridItemHeadlineBlock = () => (
    <Box marginBottom={4}>
      <Typography
        variant="h2"
        align={"center"}
        gutterBottom
        sx={{
          fontWeight: 900,
        }}
      >
        Need help selecting a service provider?
      </Typography>
      <Typography
        variant="h6"
        component="p"
        color="textPrimary"
        align={"center"}
        sx={{
          fontWeight: 400,
        }}
      >
        Tell us your project requirements, budget, and timeline,
        <br /> and we will connect you with up to four companies that match your needs – all for free.
      </Typography>
    </Box>
  );

  const GridItemFormBlock = () => (
    <Box padding={{ xs: 3, sm: 6 }} width={"100%"} component={Card} borderRadius={2} boxShadow={1}>
      <form noValidate autoComplete="off">
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
          <Box width={1}>
            <TextField sx={{ height: 54 }} label="Full name" variant="outlined" color="primary" size="medium" fullWidth />
          </Box>
          <Box marginX={{ xs: 0, md: 2 }} marginY={{ xs: 2, md: 0 }} width={"100%"}>
            <TextField sx={{ height: 54 }} label="Email" type="email" variant="outlined" color="primary" size="medium" fullWidth />
          </Box>
          <Box width={1}>
            <Button sx={{ height: 54 }} variant="contained" color="primary" size="medium" fullWidth>
              Get srated
            </Button>
          </Box>
        </Box>
      </form>
      <Box marginY={4} marginX={{ xs: -3, sm: -6 }}>
        <Divider />
      </Box>
      <Box>
        <Typography component="p" variant="body2" align="left">
          By clicking on "Get Started" you agree to our{" "}
          <Box component="a" href="" color={theme.palette.text.primary} fontWeight={"700"}>
            Privacy Policy
          </Box>
          ,{" "}
          <Box component="a" href="" color={theme.palette.text.primary} fontWeight={"700"}>
            Data Policy
          </Box>{" "}
          and{" "}
          <Box component="a" href="" color={theme.palette.text.primary} fontWeight={"700"}>
            Cookie Policy
          </Box>
          .
        </Typography>
      </Box>
    </Box>
  );

  const GridItemPartnersBlock = () => (
    <Box display="flex" flexWrap="wrap" justifyContent={"center"}>
      {[
        "https://assets.maccarianagency.com/svg/logos/airbnb-original.svg",
        "https://assets.maccarianagency.com/svg/logos/amazon-original.svg",
        "https://assets.maccarianagency.com/svg/logos/fitbit-original.svg",
        "https://assets.maccarianagency.com/svg/logos/netflix-original.svg",
        "https://assets.maccarianagency.com/svg/logos/google-original.svg",
        "https://assets.maccarianagency.com/svg/logos/paypal-original.svg",
      ].map((item, i) => (
        <Box maxWidth={100} marginTop={2} marginRight={4} key={i}>
          <Box
            component="img"
            height={"100%"}
            width={"100%"}
            src={item}
            alt="..."
            sx={{
              filter: theme.palette.mode === "dark" ? "brightness(0) invert(0.7)" : "none",
            }}
          />
        </Box>
      ))}
    </Box>
  );

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box width="100%" height="100%" display="flex" justifyContent={"center"}>
            <GridItemHeadlineBlock />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box width="100%" height="100%" display="flex" justifyContent={"center"}>
            <GridItemFormBlock />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box width="100%" height="100%" display="flex" justifyContent={"center"}>
            <GridItemPartnersBlock />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;
