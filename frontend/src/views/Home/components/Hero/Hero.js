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
          color={"textPrimary"}
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
      <Box>
        <Box component={Typography} variant="h6" align={"center"} color={"text.secondary"} data-aos={isMd ? "fade-right" : "fade-up"}>
          We design & develop amazing websites and digital products
          <br />
          for startups, companies and ourselves.
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
