import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Container from "common/Container";
import { Hero, Advantages, Partners, Platforms, Reviews, HowItWorks, Features, CtaSection } from "./components";

const Payment = () => {
  const theme = useTheme();

  return (
    <Box>
      <Container>
        <Hero />
      </Container>
      <Box maxWidth={"100%"} bgcolor={theme.palette.primary.main}>
        <Container>
          <Partners />
        </Container>
      </Box>
      <Container>
        <HowItWorks />
      </Container>
      <Divider />
      <Container>
        <Features />
      </Container>
      <Container>
        <Advantages />
      </Container>
      <Box bgcolor={theme.palette.alternate.main}>
        <Container>
          <Platforms />
        </Container>
      </Box>
      <Container>
        <Reviews />
      </Container>
      <Box maxWidth={"100%"} bgcolor={theme.palette.alternate.main}>
        <Container>
          <CtaSection />
        </Container>
      </Box>
    </Box>
  );
};

export default Payment;
