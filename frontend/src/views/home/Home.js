import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "common/Container";
import { About, Features, Hero } from "./components";

const Marketing = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box
        position={"relative"}
        sx={{
          backgroundColor: theme.palette.alternate.main,
        }}
      >
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
            marginBottom: theme.spacing(-5),
          }}
        >
          <path fill={theme.palette.background.paper} d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"></path>
        </Box>
      </Box>
      <Container sx={{ marginBottom: 5 }}>
        <Features />
      </Container>
      <Box bgcolor={theme.palette.alternate.main}>
        <Container>
          <About />
        </Container>
      </Box>
    </Box>
  );
};

export default Marketing;
