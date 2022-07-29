import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Hero = () => {
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
          data-aos={isMd ? "fade-right" : "fade-up"}
          sx={{
            fontWeight: 900,
          }}
        >
          We create amazing websites
          <br />
          and digital products
        </Typography>
      </Box>
      <Box marginBottom={{ xs: 6, sm: 8, md: 12 }}>
        <Box component={Typography} variant="h6" align={"center"} data-aos={isMd ? "fade-right" : "fade-up"}>
          We design & develop amazing websites and digital products
          <br />
          for startups, companies and ourselves.
        </Box>
      </Box>
      <Box display="flex" flexWrap="wrap" justifyContent={"center"}>
        {[
          "https://assets.maccarianagency.com/svg/logos/airbnb-original.svg",
          "https://assets.maccarianagency.com/svg/logos/amazon-original.svg",
          "https://assets.maccarianagency.com/svg/logos/fitbit-original.svg",
          "https://assets.maccarianagency.com/svg/logos/netflix-original.svg",
          "https://assets.maccarianagency.com/svg/logos/google-original.svg",
          "https://assets.maccarianagency.com/svg/logos/paypal-original.svg",
        ].map((item, i) => (
          <Box maxWidth={90} marginTop={2} marginRight={4} key={i}>
            <Box
              component="img"
              height={"100%"}
              width={"100%"}
              src={item}
              alt="..."
              sx={{
                filter: theme.palette.mode === "dark" ? "brightness(0) invert(0.7)" : "none",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Hero;
