import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "common/Container";
import { Extensions, Features, Footer, Hero, Pricing, Reviews } from "./components";

const Application = ({ themeMode = "light" }) => {
  const theme = useTheme();

  return (
    <Box>
      <Box bgcolor={theme.palette.alternate.main} position={"relative"}>
        <Container position={"relative"} zIndex={2}>
          <Hero themeMode={themeMode} />
        </Container>
        <Box
          component={"svg"}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 1920 100.1"
          sx={{
            width: "100%",
            marginBottom: theme.spacing(-1),
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            height: "20%",
            [theme.breakpoints.up("sm")]: {
              height: "30%",
            },
          }}
        >
          <path fill={theme.palette.background.paper} d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"></path>
        </Box>
      </Box>
      <Container>
        <Features />
      </Container>
      <Box bgcolor={theme.palette.alternate.main}>
        <Container>
          <Extensions />
        </Container>
      </Box>
      <Container>
        <Pricing />
      </Container>
      <Box bgcolor={theme.palette.alternate.main} position={"relative"}>
        <Container paddingX={"0 !important"} maxWidth={"100%"}>
          <Reviews themeMode={themeMode} />
        </Container>
      </Box>
      <Box bgcolor={theme.palette.primary.dark}>
        <Container>
          <Footer />
        </Container>
      </Box>
    </Box>
  );
};

Application.propTypes = {
  themeMode: PropTypes.string.isRequired,
};

export default Application;
