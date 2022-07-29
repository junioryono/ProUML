import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import CloudHostingIllustration from "svg/illustrations/CloudHosting";

const Hero = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  return (
    <Box>
      <Box>
        <Grid container spacing={4} flexDirection={isMd ? "row" : "column-reverse"}>
          <Grid item xs={12} md={6}>
            <Box data-aos={isMd ? "fade-right" : "fade-up"}>
              <Box marginBottom={2}>
                <Typography
                  variant="h2"
                  component={"h2"}
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Create your
                  <br />
                  <Typography
                    variant="h2"
                    component={"span"}
                    color="secondary"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    beautiful
                  </Typography>
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  website today.
                </Typography>
              </Box>
              <Box marginBottom={3}>
                <Typography variant="h6" component="p" color="textSecondary">
                  Make your business the centre of attention.
                  <br />
                  All the help and tools you need to be online.
                </Typography>
              </Box>
              <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretched", sm: "flex-start" }}>
                <Box component={Button} variant="outlined" color="primary" size="large" fullWidth={isMd ? false : true}>
                  Find out more
                </Box>
                <Box
                  component={Button}
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth={isMd ? false : true}
                  marginTop={{ xs: 1, sm: 0 }}
                  marginLeft={{ sm: 2 }}
                >
                  Start for free
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item container justifyContent={"center"} xs={12} md={6} data-aos={isMd ? "fade-left" : "fade-up"}>
            <Box height={"100%"} width={"100%"} maxWidth={{ xs: 500, md: "100%" }}>
              <CloudHostingIllustration width={"100%"} height={"100%"} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box component={Divider} marginY={4} />
      <Box display="flex" flexDirection={"column"} justifyContent={"center"} maxWidth={800} margin={"0 auto"} data-aos={"fade-up"}>
        <Box marginBottom={2}>
          <Typography variant="h6" component="p" color={"textPrimary"}>
            Find your perfect domain in more than 500 TLDs
          </Typography>
        </Box>
        <Box
          component={"form"}
          noValidate
          autoComplete="off"
          sx={{
            "& .MuiInputBase-input.MuiOutlinedInput-input": {
              bgcolor: "background.paper",
            },
          }}
        >
          <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretched", sm: "flex-start" }}>
            <Box flex={"1 1 auto"} component={TextField} label="Enter domain name" variant="outlined" color="primary" fullWidth height={54} />
            <Box component={Button} variant="contained" color="primary" size="large" height={54} marginTop={{ xs: 2, sm: 0 }} marginLeft={{ sm: 2 }}>
              Check
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
