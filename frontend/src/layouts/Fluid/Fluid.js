import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import { Topbar, Footer } from "./components";
import Container from "common/Container";

const Fluid = ({ children, themeToggler, themeMode, paletteType }) => {
  return (
    <div>
      <AppBar
        position={"fixed"}
        sx={{
          backgroundColor: "transparent",
        }}
        elevation={0}
      >
        <Container paddingY={{ xs: 1 / 2, sm: 1 }} maxWidth={"100%"}>
          <Topbar themeMode={themeMode} themeToggler={themeToggler} paletteType={paletteType} />
        </Container>
      </AppBar>
      <main>{children}</main>
      <Divider />
      <Container paddingY={4}>
        <Footer />
      </Container>
    </div>
  );
};

Fluid.propTypes = {
  children: PropTypes.node,
  themeToggler: PropTypes.func.isRequired,
  themeMode: PropTypes.string.isRequired,
  paletteType: PropTypes.string.isRequired,
};

export default Fluid;
