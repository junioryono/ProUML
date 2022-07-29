import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "common/Container";
import { About, Hero, Numbers, Registration, Reviews, Schedules, Speakers } from "./components";

const Event = () => {
  const theme = useTheme();
  return (
    <Box>
      <Box
        minHeight={{ xs: "auto", md: "calc(100vh - 64px)" }}
        height={"auto"}
        position={"relative"}
        sx={{
          backgroundImage: 'url("https://assets.maccarianagency.com/backgrounds/img19.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundAttachment: "fixed",
          "&:after": {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: "100%",
            width: "100%",
            content: '" "',
            zIndex: 1,
            backgroundColor: theme.palette.primary.dark,
            backgroundAttachment: "fixed",
            opacity: 0.7,
          },
        }}
      >
        <Box
          position={{ xs: "relative", md: "absolute" }}
          top={{ xs: 0, md: "50%" }}
          width={"100%"}
          height={"auto"}
          sx={{
            transform: { md: "translateY(-50%)" },
          }}
          zIndex={2}
        >
          <Container>
            <Hero />
          </Container>
        </Box>
      </Box>
      <Container>
        <Numbers />
      </Container>
      <Container>
        <About />
      </Container>
      <Container>
        <Reviews />
      </Container>
      <Container>
        <Schedules />
      </Container>
      <Box bgcolor={theme.palette.alternate.main}>
        <Container>
          <Speakers />
        </Container>
      </Box>
      <Container>
        <Registration />
      </Container>
    </Box>
  );
};

export default Event;
