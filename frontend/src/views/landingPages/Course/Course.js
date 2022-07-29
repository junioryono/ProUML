import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Container from "common/Container";
import { Hero, About, ContactForm, Faq, Footer, Overview, Reviews } from "./components";

const Course = ({ themeMode = "light" }) => {
  const theme = useTheme();
  return (
    <Box>
      <Box bgcolor={"alternate.dark"}>
        <Container>
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
          }}
        >
          <path fill={theme.palette.background.default} d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"></path>
        </Box>
      </Box>
      <Box>
        <Container>
          <Reviews />
        </Container>
      </Box>
      <Container paddingY={0}>
        <Divider />
      </Container>
      <Container>
        <Overview themeMode={themeMode} />
      </Container>
      <Box bgcolor={theme.palette.alternate.main}>
        <Box
          component={"svg"}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 1920 100.1"
          sx={{
            width: "100%",
            transform: "scaleY(-1)",
          }}
        >
          <path fill={theme.palette.background.paper} d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"></path>
        </Box>
        <Container>
          <About />
        </Container>
        <Divider />
        <Container maxWidth={800}>
          <Faq />
        </Container>
      </Box>
      <Container>
        <ContactForm />
      </Container>
      <Box bgcolor={theme.palette.primary.dark}>
        <Container>
          <Footer />
        </Container>
      </Box>
    </Box>
  );
};

Course.propTypes = {
  themeMode: PropTypes.string.isRequired,
};

export default Course;
