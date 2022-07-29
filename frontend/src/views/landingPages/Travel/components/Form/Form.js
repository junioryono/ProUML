/* eslint-disable react/no-unescaped-entities */

import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";

const Form = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  return (
    <Box>
      <Box marginBottom={4} data-aos={isMd ? "fade-right" : "fade-up"}>
        <Typography
          sx={{
            textTransform: "uppercase",
            fontWeight: "medium",
          }}
          gutterBottom
          color={"secondary"}
          align={"center"}
        >
          The best holiday experience
        </Typography>
        <Typography
          variant="h3"
          color="textPrimary"
          gutterBottom
          align={"center"}
          sx={{
            fontWeight: 700,
          }}
        >
          Stay like a local
        </Typography>
        <Typography variant="h6" component="p" color="textSecondary" align={"center"}>
          Treat yourself with the journey with your inner self.
          <br />
          Visit the world's beautiful cities, and start your spiritual travel advanture.
        </Typography>
      </Box>
      <Box component={Card} maxWidth={{ xs: "100%", md: "50%" }} boxShadow={4} data-aos={"fade-up"} margin={"0 auto"}>
        <CardContent>
          <Box
            component={"form"}
            noValidate
            autoComplete="off"
            sx={{
              "& .MuiInputBase-input.MuiOutlinedInput-input": {
                bgcolor: "background.paper",
              },
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box component={TextField} label="Where" variant="outlined" color="primary" fullWidth height={54} />
              </Grid>
              <Grid item xs={12}>
                <Box component={Button} variant="contained" color="primary" size="large" height={54} fullWidth>
                  Start
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Box>
    </Box>
  );
};

export default Form;
