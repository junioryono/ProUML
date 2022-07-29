import { useTheme } from "@mui/material/styles";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "common/Container";
import GlobeIllustration from "svg/illustrations/Globe";

const Cover = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  return (
    <Box minHeight={"calc(100vh - 64px - 183px)"} height={"100%"} display={"flex"} alignItems={"center"} bgcolor={"alternate.main"}>
      <Container>
        <Grid container spacing={6}>
          <Grid item container justifyContent={"center"} xs={12} md={6}>
            <Box height={"100%"} width={"100%"} maxWidth={{ xs: 500, md: "100%" }}>
              <GlobeIllustration width={"100%"} height={"100%"} />
            </Box>
          </Grid>
          <Grid item container alignItems={"center"} justifyContent={"center"} xs={12} md={6}>
            <Box>
              <Typography variant="h3" component={"h3"} align={isMd ? "left" : "center"} sx={{ fontWeight: 700 }} gutterBottom>
                Trusted by over{" "}
                <Typography component={"span"} variant={"inherit"} color={"secondary"}>
                  80,000
                </Typography>{" "}
                people
              </Typography>
              <Typography variant="h6" component="p" color="textSecondary" align={isMd ? "left" : "center"} gutterBottom>
                We create amazing websites and digital products.
              </Typography>
              <Typography variant="h6" component="p" color="textSecondary" align={isMd ? "left" : "center"}>
                We design & develop amazing websites and digital products for startups, companies and ourselves.
              </Typography>
              <Box marginTop={4} display={"flex"} justifyContent={{ xs: "center", md: "flex-start" }}>
                <Button component={Link} variant="contained" color="primary" size="large" href={"/"}>
                  Contact us
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Cover;
