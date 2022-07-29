import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Container from "common/Container";
import { About, CallToAction, Hero, HowItWorks, Numbers, Pricing, Solutions } from "./components";

const DomainHosting = ({ themeMode = "light" }) => {
  const theme = useTheme();

  return (
    <Box>
      <Box bgcolor={theme.palette.alternate.main} position={"relative"}>
        <Container position={"relative"} zIndex={2}>
          <Hero />
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
            zIndex: 1,
          }}
        >
          <path fill={theme.palette.background.paper} d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"></path>
        </Box>
      </Box>
      <Container>
        <About themeMode={themeMode} />
      </Container>
      <Container>
        <Numbers />
      </Container>
      <Container>
        <HowItWorks />
      </Container>
      <Container paddingY={"0 !important"}>
        <Divider />
      </Container>
      <Container>
        <Pricing />
      </Container>
      <Box bgcolor={theme.palette.alternate.main}>
        <Container>
          <Solutions />
        </Container>
      </Box>
      <Container>
        <CallToAction />
      </Container>
    </Box>
  );
};

DomainHosting.propTypes = {
  themeMode: PropTypes.string.isRequired,
};

export default DomainHosting;
