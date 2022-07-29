import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "common/Container";
import { Contact, Headline, Partners, Stories } from "./components";

const Customers = ({ themeMode = "light" }) => {
  const theme = useTheme();
  return (
    <Box>
      <Box
        position={"relative"}
        sx={{
          backgroundImage: 'url("https://assets.maccarianagency.com/backgrounds/img1.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&:after": {
            position: "absolute",
            content: '" "',
            width: "100%",
            height: "100%",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 1,
            background: theme.palette.common.black,
            opacity: 0.7,
          },
        }}
      >
        <Container zIndex={3} position={"relative"}>
          <Container marginLeft={"0 !important"} maxWidth={{ md: "50% !important" }}>
            <Headline />
          </Container>
        </Container>
        <Box
          component={"svg"}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 1920 100.1"
          width={"100%"}
          marginBottom={-1}
          position={"relative"}
          zIndex={2}
        >
          <path fill={theme.palette.background.paper} d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"></path>
        </Box>
      </Box>
      <Container>
        <Partners />
      </Container>
      <Container>
        <Stories themeMode={themeMode} />
      </Container>
      <Box bgcolor={theme.palette.alternate.main}>
        <Container>
          <Contact />
        </Container>
      </Box>
    </Box>
  );
};

Customers.propTypes = {
  themeMode: PropTypes.string.isRequired,
};

export default Customers;
