import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const About = ({ themeMode = "light" }) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  return (
    <Box>
      <Box marginBottom={4}>
        <Typography
          sx={{
            textTransform: "uppercase",
            fontWeight: "medium",
          }}
          gutterBottom
          color={"secondary"}
          align={"center"}
        >
          Complete control
        </Typography>
        <Typography
          variant="h3"
          align={"center"}
          data-aos={"fade-up"}
          gutterBottom
          sx={{
            fontWeight: 700,
          }}
        >
          All the help and tools you need
          <br />
          to be online.
        </Typography>
        <Typography variant="h6" align={"center"} color={"textSecondary"} data-aos={"fade-up"}>
          Make your business the centre of attention.
        </Typography>
      </Box>
      <Box display={"flex"} alignItems={"baseline"} justifyContent={"center"}>
        <Box component={Card} maxWidth={700} boxShadow={3} border={`1px solid ${theme.palette.divider}`} borderRadius={3} data-aos={isMd ? "fade-right" : "fade-up"}>
          <Box component={CardContent}>
            <Box border={`1px solid ${theme.palette.divider}`}>
              <LazyLoadImage
                height={"100%"}
                width={"100%"}
                src={
                  themeMode === "light"
                    ? "https://assets.maccarianagency.com/screenshots/software-desktop.png"
                    : "https://assets.maccarianagency.com/screenshots/software-desktop--dark.png"
                }
                alt="..."
                effect="blur"
              />
            </Box>
          </Box>
        </Box>
        <Box
          component={Card}
          maxWidth={250}
          boxShadow={3}
          border={`1px solid ${theme.palette.divider}`}
          borderRadius={5}
          marginLeft={-12}
          zIndex={1}
          data-aos={isMd ? "fade-left" : "fade-up"}
        >
          <Box component={CardContent}>
            <Box border={`1px solid ${theme.palette.divider}`}>
              <LazyLoadImage
                height={"100%"}
                width={"100%"}
                src={
                  themeMode === "light"
                    ? "https://assets.maccarianagency.com/screenshots/software-mobile.png"
                    : "https://assets.maccarianagency.com/screenshots/software-mobile--dark.png"
                }
                alt="..."
                effect="blur"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

About.propTypes = {
  themeMode: PropTypes.string.isRequired,
};

export default About;
