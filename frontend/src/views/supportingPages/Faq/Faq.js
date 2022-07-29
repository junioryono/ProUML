import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "common/Container";
import { Content, Footer, Headline } from "./components";

const Faq = () => {
  const theme = useTheme();
  return (
    <Box>
      <Box
        sx={{
          backgroundColor: theme.palette.alternate.main,
          backgroundImage: `linear-gradient(120deg, ${theme.palette.background.paper} 0%, ${theme.palette.alternate.main} 100%)`,
        }}
      >
        <Container>
          <Headline />
        </Container>
      </Box>
      <Container maxWidth={800}>
        <Content />
      </Container>
      <Box bgcolor={theme.palette.alternate.main}>
        <Container>
          <Footer />
        </Container>
      </Box>
    </Box>
  );
};

export default Faq;
