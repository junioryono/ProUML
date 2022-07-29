import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Container from "common/Container";
import { About, Hero, Features, PremiumFeatures, Reviews, Partners } from "./components";

const Software = () => {
  const theme = useTheme();

  return (
    <Box>
      <Container>
        <Hero />
      </Container>
      <Container>
        <Features />
      </Container>
      <Box bgcolor={theme.palette.alternate.main} position={"relative"}>
        <Container position="relative" zIndex={2}>
          <About />
        </Container>
        <Box
          component={"svg"}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 1921 273"
          sx={{
            position: "absolute",
            width: "100%",
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 1,
            height: "35%",
          }}
        >
          <polygon fill={theme.palette.background.paper} points="0,273 1921,273 1921,0 " />
        </Box>
      </Box>
      <Container>
        <PremiumFeatures />
      </Container>
      <Divider />
      <Container>
        <Reviews />
      </Container>
      <Box bgcolor={theme.palette.alternate.main}>
        <Container>
          <Partners />
        </Container>
      </Box>
    </Box>
  );
};

export default Software;
