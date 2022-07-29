import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import InnovationIllustration from "svg/illustrations/Innovation";

const Hero = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  return (
    <Grid container spacing={4}>
      <Grid item container alignItems={"center"} xs={12} md={6}>
        <Box data-aos={isMd ? "fade-right" : "fade-up"}>
          <Typography
            sx={{
              textTransform: "uppercase",
              fontWeight: "medium",
            }}
            gutterBottom
            color={"secondary"}
          >
            CREATIVE BRAND DESIGN
          </Typography>
          <Box marginBottom={2}>
            <Typography
              variant="h2"
              color="textPrimary"
              sx={{
                fontWeight: 700,
              }}
            >
              Design agency
              <br />
              that{" "}
              <Typography color={"primary"} component={"span"} variant={"inherit"}>
                inspires
              </Typography>
            </Typography>
          </Box>
          <Box marginBottom={3}>
            <Typography variant="h6" component="p" color="textSecondary">
              We are an award-winning Milan based web design agency, specialising in bespoke website design & development.
            </Typography>
          </Box>
          <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretched", sm: "flex-start" }}>
            <Button variant="contained" color="primary" size="large" fullWidth={isMd ? false : true}>
              Start a project
            </Button>
            <Box component={Button} variant="outlined" color="primary" size="large" marginTop={{ xs: 2, sm: 0 }} marginLeft={{ sm: 2 }} fullWidth={isMd ? false : true}>
              View portfolio
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box height={"100%"} width={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <Box height={"100%"} width={"100%"} maxHeight={500}>
            <InnovationIllustration width={"100%"} height={"100%"} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Hero;
