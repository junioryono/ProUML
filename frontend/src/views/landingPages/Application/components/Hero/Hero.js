import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const Hero = ({ themeMode = "light" }) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  return (
    <Box>
      <Box marginBottom={2}>
        <Typography
          variant="h2"
          align={"center"}
          sx={{
            fontWeight: 700,
          }}
        >
          Build beautiful landing pages
          <br />
          fast and easy
        </Typography>
      </Box>
      <Box marginBottom={4}>
        <Typography variant="h6" align={"center"} color={"textSecondary"}>
          We make designing easy and performance fast
        </Typography>
      </Box>
      <Box
        marginBottom={{ xs: 4, sm: 6, md: 8 }}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent={"center"}
        alignItems={{ xs: "stretched", sm: "center" }}
      >
        <Box
          component={Button}
          variant="contained"
          color="primary"
          size="large"
          fullWidth={!isMd}
          startIcon={
            <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        >
          Download now
        </Box>
        <Box component={Button} variant="outlined" color="primary" size="large" fullWidth={!isMd} marginTop={{ xs: 1, sm: 0 }} marginLeft={{ sm: 2 }}>
          Learn more
        </Box>
      </Box>
      <Box display={"flex"} alignItems={"baseline"} justifyContent={"center"}>
        <Box component={Card} maxWidth={700} boxShadow={3} border={`1px solid ${theme.palette.divider}`} borderRadius={3}>
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
        <Box component={Card} maxWidth={250} boxShadow={3} border={`1px solid ${theme.palette.divider}`} borderRadius={5} marginLeft={-12} zIndex={1}>
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

Hero.propTypes = {
  themeMode: PropTypes.string.isRequired,
};

export default Hero;
