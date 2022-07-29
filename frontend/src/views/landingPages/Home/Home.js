import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "common/Container";
import { DemoPages, Features, Footer, Hero, Highlights } from "./components";

const Home = () => {
  const theme = useTheme();
  return (
    <Box>
      <Box bgcolor={theme.palette.alternate.main} position={"relative"}>
        <Container position="relative" zIndex={2}>
          <Hero />
        </Container>
      </Box>
      <Container>
        <Highlights />
      </Container>
      <Container>
        <Features />
      </Container>
      <Box bgcolor={theme.palette.alternate.main}>
        <Container>
          <DemoPages />
        </Container>
      </Box>
      <Container>
        <Footer />
      </Container>
    </Box>
  );
};

export default Home;
