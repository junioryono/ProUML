import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

const Process = () => {
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
        <Box component={Typography} fontWeight={700} variant={"h3"} gutterBottom align={"center"}>
          Our working process is simple & effective
        </Box>
        <Typography variant={"h6"} component={"p"} color={"textSecondary"} align={"center"}>
          Our process to bring your company to the next level.
          <br />
          Automate all your ad management strategies for Facebook, Google and Snapchat Ads in a single interface.
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {[
          {
            title: "Share Requirements",
            subtitle: "You provide details about the services you're looking for, ideal budget, and timeline.",
          },
          {
            title: "We Identify Best-Fits",
            subtitle: "We anonymize your project brief and send it to the service providers who meet your requirements.",
          },
          {
            title: "Get Matched",
            subtitle: "We introduce you to 1-4 best-fit service providers via email within 24 hours of the free consultation.",
          },
          {
            title: "Begin Discussions",
            subtitle: "You take it from there. Typically, companies will reach out to schedule introductory calls within a few days of connecting.",
          },
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i} data-aos={"fade-up"}>
            <Box display={"flex"} flexDirection={"column"}>
              <Box display={"flex"} alignItems={"center"} marginBottom={1}>
                <Box
                  borderRadius={"100%"}
                  bgcolor={theme.palette.secondary.main}
                  marginRight={2}
                  width={40}
                  height={40}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Box component={Typography} variant={"h6"} fontWeight={600} color={theme.palette.common.white}>
                    {i + 1}
                  </Box>
                </Box>
                <Typography variant={"h6"} gutterBottom fontWeight={500}>
                  {item.title}
                </Typography>
              </Box>
              <Typography color="text.secondary">{item.subtitle}</Typography>
            </Box>
          </Grid>
        ))}
        <Grid item container xs={12} justifyContent={"center"} data-aos={"fade-up"}>
          <Button variant={"contained"} color={"primary"} size={"large"}>
            Get started now
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Process;
