import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Container from "common/Container";
import { About, Download, Features, Hero, Roadmap, Team, WhitePaper } from "./components";

const Crypto = ({ themeMode }) => {
  const theme = useTheme();

  return (
    <Box>
      <Box bgcolor="alternate.main">
        <Container>
          <Hero />
        </Container>
        <Container>
          <About />
        </Container>
        <Container>
          <Features />
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
          }}
        >
          <path fill={theme.palette.background.paper} d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"></path>
        </Box>
      </Box>
      <Container paddingTop={"0 !important"}>
        <Team />
      </Container>
      <Container paddingTop={"0 !important"}>
        <WhitePaper themeMode={themeMode} />
      </Container>
      <Box bgcolor={theme.palette.alternate.main}>
        <Container paddingBottom={"0 !important"}>
          <Roadmap />
        </Container>
        <Container>
          <Divider />
        </Container>
        <Container paddingTop={"0 !important"}>
          <Download />
        </Container>
      </Box>
    </Box>
  );
};

Crypto.propTypes = {
  themeMode: PropTypes.string.isRequired,
};

export default Crypto;
