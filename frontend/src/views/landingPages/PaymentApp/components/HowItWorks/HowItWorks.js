import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";

const HowItWorks = () => {
  const theme = useTheme();

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
          Platforms
        </Typography>
        <Box component={Typography} fontWeight={700} variant={"h3"} align={"center"}>
          How it works
        </Box>
      </Box>
      <Grid container spacing={4}>
        {[
          {
            title: "Fill out your intro survey",
            subtitle: "We start with a short 3-step online survey to help us determine the best banking solution for your specific startup.",
            icon: (
              <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            ),
          },
          {
            title: "We build a banking stack.",
            subtitle: "From your information, we generate a banking stack well suited to your company’s personalized needs.",
            icon: (
              <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            ),
          },
          {
            title: "Registration and filings",
            subtitle: "We handle the creation of your actual account including registering with the financial and government agencies.",
            icon: (
              <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ),
          },
        ].map((item, i) => (
          <Grid key={i} item xs={12} md={4} data-aos={"fade-up"}>
            <Box component={Avatar} marginBottom={2} variant="rounded" bgcolor={theme.palette.primary.main}>
              <Box>{item.icon}</Box>
            </Box>
            <Typography variant="h6" align={"left"} gutterBottom>
              {item.title}
            </Typography>
            <Typography color="text.secondary" align={"left"} component="p">
              {item.subtitle}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HowItWorks;
