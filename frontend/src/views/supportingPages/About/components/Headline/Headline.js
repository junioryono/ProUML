import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Headline = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        "&::after": {
          position: "absolute",
          content: '""',
          width: "30%",
          zIndex: 1,
          top: 0,
          left: 0,
          height: "100%",
          backgroundSize: "18px 18px",
          backgroundImage: `radial-gradient(${theme.palette.primary.dark} 20%, transparent 20%)`,
          opacity: 0.2,
        },
      }}
    >
      <Box position="relative" zIndex={2}>
        <Typography
          sx={{
            textTransform: "uppercase",
            fontWeight: "medium",
          }}
          gutterBottom
          color={"textSecondary"}
          align={"center"}
        >
          About us
        </Typography>
        <Box marginBottom={2}>
          <Typography
            variant="h2"
            align={"center"}
            sx={{
              fontWeight: 700,
            }}
          >
            We take you by hand on each
            <br />
            step of the process
          </Typography>
        </Box>
        <Box marginBottom={4}>
          <Typography variant="h6" align={"center"} color={"textSecondary"}>
            As experts in both design & development, we help you go through the complete process. From your new website idea, to design, development, launch and scale!
          </Typography>
        </Box>
        <Box display="flex" justifyContent={"center"}>
          <Box
            component={Button}
            variant="contained"
            color="primary"
            size="large"
            endIcon={
              <svg width={16} height={16} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            }
          >
            Contact us
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Headline;
