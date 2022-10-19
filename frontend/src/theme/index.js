import { responsiveFontSizes } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { light as lightBlue, dark as darkBlue } from "./palette";
import shadows from "./shadows";

export default function (mode) {
  return responsiveFontSizes(
    createTheme({
      palette: mode === "dark" ? darkBlue : lightBlue,
      layout: {
        contentWidth: 1236,
      },
      shadows: shadows(mode),
      typography: {
        fontFamily: '"Inter", sans-serif',
        button: {
          textTransform: "none",
          fontWeight: "medium",
        },
      },
      zIndex: {
        appBar: 1200,
        drawer: 1300,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            label: {
              fontWeight: 600,
            },
            containedSecondary: mode === "light" ? { color: "white" } : {},
          },
        },
      },
    }),
  );
}
