import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CreditCards2Illustration from "svg/illustrations/CreditCards2";

const Advantages = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  return (
    <Box>
      <Box marginBottom={4}>
        <Box component={Typography} fontWeight={700} variant={"h3"} align={"center"} gutterBottom>
          The easiest way to pay within apps.
        </Box>
        <Typography variant="h6" component={"p"} color={"textSecondary"} align={"center"}>
          From your information, we generate a banking stack well suited to your company’s personalized needs.
        </Typography>
      </Box>
      <Grid container spacing={4} flexDirection={isMd ? "row" : "column-reverse"}>
        <Grid item container justifyContent={"center"} xs={12} md={6} width={"100%"}>
          <Box height={"100%"} width={"100%"} maxWidth={600}>
            <CreditCards2Illustration width={"100%"} height={"100%"} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} container alignItems={"center"}>
          <Box data-aos={isMd ? "fade-left" : "fade-up"}>
            <Box marginBottom={2}>
              <Typography variant={"h4"} sx={{ fontWeight: 700 }} gutterBottom>
                Universal access to your data is one of our core values.
              </Typography>
              <Typography color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vehicula auctor ornare. Nulla non ullamcorper tellus.
              </Typography>
            </Box>
            <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretched", sm: "flex-start" }}>
              <Box component={Button} variant="outlined" color="primary" size="large" fullWidth={!isMd}>
                Contact sales
              </Box>
              <Box component={Button} variant="contained" color="primary" size="large" fullWidth={!isMd} marginTop={{ xs: 1, sm: 0 }} marginLeft={{ sm: 2 }}>
                Subscribe
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Advantages;
