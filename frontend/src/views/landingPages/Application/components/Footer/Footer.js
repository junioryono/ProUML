import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box>
      <Typography
        variant="h6"
        align="left"
        gutterBottom
        sx={{
          color: theme.palette.common.white,
          fontWeight: 900,
        }}
      >
        Learn how to build better websites
      </Typography>
      <Box marginBottom={4}>
        <Typography sx={{ color: theme.palette.common.white }}>
          Over 300 stand-alone atomic components that will help you to boost your frontend development productivity.
        </Typography>
      </Box>
      <Box component={Card} maxWidth={600} boxShadow={4}>
        <CardContent>
          <Box display="flex" flexDirection={"column"} justifyContent={"center"}>
            <Box marginBottom={2}>
              <Typography variant="body1" component="p">
                Join over 5000 subscribers for our newsletter
              </Typography>
            </Box>
            <form noValidate autoComplete="off">
              <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretched", sm: "flex-start" }}>
                <Box flex={"1 1 auto"} component={TextField} label="Enter your email" variant="outlined" color="primary" fullWidth height={54} />
                <Box component={Button} variant="contained" color="primary" size="large" height={54} marginTop={{ xs: 2, sm: 0 }} marginLeft={{ sm: 2 }}>
                  Subscribe
                </Box>
              </Box>
            </form>
          </Box>
        </CardContent>
      </Box>
    </Box>
  );
};

export default Footer;
