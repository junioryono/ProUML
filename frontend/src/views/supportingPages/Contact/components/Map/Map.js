/* eslint-disable react/no-unescaped-entities */

import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const Map = ({ themeMode = "light" }) => {
  return (
    <Box>
      <Box>
        <Typography
          sx={{
            textTransform: "uppercase",
            fontWeight: "medium",
          }}
          gutterBottom
          color={"textSecondary"}
        >
          Contact us
        </Typography>
        <Box marginBottom={2}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
            }}
          >
            Get in touch
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" color={"textSecondary"}>
            We'd love to talk about how we can help you.
          </Typography>
        </Box>
      </Box>
      <Box marginY={4}>
        <Box
          component={"iframe"}
          borderRadius={2}
          minHeight={400}
          width="100%"
          height="100%"
          frameBorder="0"
          title="map"
          marginHeight="0"
          marginWidth="0"
          scrolling="no"
          src="https://maps.google.com/maps?width=100%&height=100%&hl=en&q=Milan&ie=UTF8&t=&z=14&iwloc=B&output=embed"
          sx={{
            filter: themeMode === "dark" ? "grayscale(0.5) opacity(0.7)" : "none",
          }}
        />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant={"body1"} gutterBottom sx={{ fontWeight: "medium" }}>
            Call us:
          </Typography>
          <Typography variant={"subtitle1"}>+39 34 111 222</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant={"body1"} gutterBottom sx={{ fontWeight: "medium" }}>
            Email us:
          </Typography>
          <Typography variant={"subtitle1"}>hi@maccarianagency.com</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant={"body1"} gutterBottom sx={{ fontWeight: "medium" }}>
            Address:
          </Typography>
          <Typography variant={"subtitle1"}>Via E. Gola 4, Milan MI, Italy</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

Map.propTypes = {
  themeMode: PropTypes.string.isRequired,
};

export default Map;
