/* eslint-disable react/no-unescaped-entities */

import PropTypes from "prop-types";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "@mui/material/styles";
import { colors } from "@mui/material";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "common/Container";
import { light as lightGreen, dark as darkGreen } from "theme/palette--green";
import { light as lightBlue, dark as darkBlue } from "theme/palette--blue";
import { light as lightIndigo, dark as darkIndigo } from "theme/palette--indigo";
import { light as lightPink, dark as darkPink } from "theme/palette--pink";
import { light as lightOrange, dark as darkOrange } from "theme/palette--orange";

const Colors = ({ themeMode = "light" }) => {
  const theme = useTheme();

  const colorScheme = [
    {
      name: "Green",
      palette: themeMode === "dark" ? darkGreen : lightGreen,
    },
    {
      name: "Blue",
      palette: themeMode === "dark" ? darkBlue : lightBlue,
    },
    {
      name: "Indigo",
      palette: themeMode === "dark" ? darkIndigo : lightIndigo,
    },
    {
      name: "Pink",
      palette: themeMode === "dark" ? darkPink : lightPink,
    },
    {
      name: "Orange",
      palette: themeMode === "dark" ? darkOrange : lightOrange,
    },
  ];

  const renderCodeBlock = (code = "", language = "jsx") => {
    return (
      <Box
        component={SyntaxHighlighter}
        language={language}
        style={vs2015}
        padding={`${theme.spacing(2)} !important`}
        borderRadius={2}
        margin={`${theme.spacing(0)} !important`}
      >
        {code}
      </Box>
    );
  };

  return (
    <Box>
      <Container>
        <Box marginBottom={4}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
            }}
          >
            Colors
          </Typography>
          <Typography
            sx={{
              "& code": {
                background: colors.yellow[400],
                color: theme.palette.common.black,
              },
            }}
          >
            The Material-UI <code>palette</code> object declaration is <code>src/theme/palette.js</code>
          </Typography>
        </Box>
        <Box>
          {colorScheme.map((item, i) => (
            <Box key={i} marginBottom={4}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 700,
                }}
              >
                {item.name}
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Primary
                  </Typography>
                  <Grid container spacing={2}>
                    {[item.palette.primary.light, item.palette.primary.main, item.palette.primary.dark].map((color) => (
                      <Grid item xs={12} sm={4} key={color}>
                        <Box component={Card} boxShadow={3} borderRadius={4}>
                          <Box width={1} height={200} bgcolor={color} />
                          <CardContent>{color}</CardContent>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Secondary
                  </Typography>
                  <Grid container spacing={2}>
                    {[item.palette.secondary.light, item.palette.secondary.main, item.palette.secondary.dark].map((color) => (
                      <Grid item xs={12} sm={4} key={color}>
                        <Box component={Card} boxShadow={3} borderRadius={4}>
                          <Box width={1} height={200} bgcolor={color} />
                          <CardContent>{color}</CardContent>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      </Container>
      <Container paddingTop={"0 !important"}>
        <Box marginBottom={4}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
            }}
          >
            How to add a new color?
          </Typography>
          <Typography
            gutterBottom
            sx={{
              "& code": {
                background: colors.yellow[400],
                color: theme.palette.common.black,
              },
            }}
          >
            The available color types are declared in <code>src/common/paletteTypes.js</code>
          </Typography>
          <Box marginBottom={2}>
            {renderCodeBlock(
              `const palettes = ['green', 'blue', 'indigo', 'pink', 'orange'];

export default palettes;`,
              "javascript",
            )}
          </Box>
          <Typography gutterBottom>
            First, add you new theme color in the array mentioned above. The colors should be picked from{" "}
            <Link href={"https://next.material-ui.com/customization/color/#color-palette"} target={"_blank"}>
              Material-UI color palette
            </Link>
          </Typography>
          <Typography
            gutterBottom
            sx={{
              "& code": {
                background: colors.yellow[400],
                color: theme.palette.common.black,
              },
            }}
          >
            Then, create a new file in <code>src/theme</code> and name it <code>palette--[your color name].js</code>, where <code>[your color name]</code> is the name of
            your color, for example <code>blue</code>.
          </Typography>
          <Typography
            gutterBottom
            sx={{
              "& code": {
                background: colors.yellow[400],
                color: theme.palette.common.black,
              },
            }}
          >
            The color palette should be created by following to already existing palette object and{" "}
            <Link href={"https://next.material-ui.com/customization/color/"} target={"_blank"}>
              Material-UI palette declaration.
            </Link>
          </Typography>
          <Typography
            sx={{
              "& code": {
                background: colors.yellow[400],
                color: theme.palette.common.black,
              },
            }}
          >
            Finaly, open <code>src/palette.js</code> file and add a new case for your new color. That's it!
          </Typography>
          <Box marginTop={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 700,
              }}
            >
              Recommendation
            </Typography>
            <Typography gutterBottom>We recommend picking colors with these values:</Typography>
            <ul>
              {["Light: 500", "Main: 700", "Dark: 900"].map((item, i) => (
                <Box component={"li"} key={i} marginY={1 / 2} marginX={0}>
                  <Typography>{item}</Typography>
                </Box>
              ))}
            </ul>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

Colors.propTypes = {
  themeMode: PropTypes.string.isRequired,
};

export default Colors;
