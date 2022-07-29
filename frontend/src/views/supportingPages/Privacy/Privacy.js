import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "common/Container";
import { ContactCard, Content } from "./components";

const Privacy = () => {
  const theme = useTheme();

  return (
    <Box>
      <Container>
        <Box boxShadow={4} borderRadius={2}>
          <Box bgcolor={theme.palette.primary.main} borderRadius={2}>
            <Container paddingX={{ xs: 2, sm: 4 }}>
              <Typography
                variant={"h3"}
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: theme.palette.common.white,
                }}
              >
                Privacy Policy
              </Typography>
              <Typography
                gutterBottom
                sx={{
                  color: theme.palette.common.white,
                }}
              >
                Last modified on <strong>23 Feb, 2021</strong>
              </Typography>
            </Container>
            <Box
              component={"svg"}
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 1920 100.1"
              width={"100%"}
              marginBottom={-1}
            >
              <path fill={theme.palette.background.paper} d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"></path>
            </Box>
          </Box>
          <Container paddingTop={"0 !important"} paddingX={{ xs: 2, sm: 4 }} position={"relative"} top={0}>
            <Box component={Grid} container spacing={4} flexDirection={{ xs: "column-reverse", md: "row" }}>
              <Grid item xs={12} md={9}>
                <Content />
              </Grid>
              <Grid item xs={12} md={3}>
                <Box position={"sticky"} top={theme.spacing(10)} className={"sticky"}>
                  <ContactCard />
                </Box>
              </Grid>
            </Box>
          </Container>
        </Box>
      </Container>
    </Box>
  );
};

export default Privacy;
