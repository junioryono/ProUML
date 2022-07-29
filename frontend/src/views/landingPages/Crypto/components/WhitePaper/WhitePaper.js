import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { colors } from "@mui/material";

const WhitePaper = ({ themeMode = "light" }) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} data-aos={isMd ? "fade-right" : "fade-up"}>
          <Box
            component={Card}
            display={"flex"}
            alignItems={"center"}
            width={"100%"}
            height={"100%"}
            bgcolor={colors.lightBlue[themeMode === "light" ? 50 : 900]}
            boxShadow={0}
          >
            <CardContent>
              <Box component={Avatar} width={60} height={60} marginBottom={6} bgcolor={colors.lightBlue[themeMode === "light" ? 900 : 50]} boxShadow={4}>
                <Box color={colors.lightBlue[themeMode === "light" ? 50 : 900]}>
                  <svg width={32} height={32} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Box>
              </Box>
              <Box component={Typography} variant={"h6"} gutterBottom fontWeight={500}>
                {"Funnel Optimization"}
              </Box>
              <Typography color="text.secondary">
                {"We help you optimize your website or mobile app flow to increase conversion rates and retention to drive growth."}
              </Typography>
            </CardContent>
          </Box>
        </Grid>
        <Grid item container alignItems={"center"} xs={12} md={6} data-aos={isMd ? "fade-left" : "fade-up"}>
          <Box>
            <Box marginBottom={2}>
              <Box component={Typography} variant={"h4"} gutterBottom fontWeight={600}>
                {"Funnel Optimization"}
              </Box>
              <Typography color="text.secondary">
                {"We help you optimize your website or mobile app flow to increase conversion rates and retention to drive growth."}
              </Typography>
            </Box>
            <Button size={"large"} variant={"contained"}>
              Learn more
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

WhitePaper.propTypes = {
  themeMode: PropTypes.string.isRequired,
};

export default WhitePaper;
