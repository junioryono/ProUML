import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { colors } from "@mui/material";

const Schedules = () => {
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
          Agenda
        </Typography>
        <Box component={Typography} fontWeight={700} variant={"h3"} align={"center"} gutterBottom data-aos="fade-up">
          Event Schedule
        </Box>
      </Box>
      <Grid container spacing={2}>
        {[
          {
            title: "Ep 4: The best noise-cancelling headphones of 2020",
            subtitle:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pretium est ipsum dictum lectus mauris netus. Diam sed sit quisque facilisi luctus feugiat.",
            date: "June 12, 2021",
            duration: "30 mins",
            tag: "Devices",
          },
          {
            title: "Ep 3: MacBook Pro 16’’ vs. Surface Laptop 3",
            subtitle:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pretium est ipsum dictum lectus mauris netus. Diam sed sit quisque facilisi luctus feugiat.",
            date: "June 13, 2021",
            duration: "50 mins",
            tag: "Devices",
          },
          {
            title: "Ep 2: Interview with Elon Musk, CEO of Tesla",
            subtitle:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pretium est ipsum dictum lectus mauris netus. Diam sed sit quisque facilisi luctus feugiat.",
            date: "June 14, 2021",
            duration: "1 hour",
            tag: "Tech",
          },
          {
            title: "Ep 1: Introducing the new season of Radio Podcast",
            subtitle:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pretium est ipsum dictum lectus mauris netus. Diam sed sit quisque facilisi luctus feugiat.",
            date: "June 15, 2021",
            duration: "2 hours",
            tag: "News",
          },
        ].map((item, i) => (
          <Grid item xs={12} key={i} data-aos={"fade-up"}>
            <Box
              component={Card}
              display={"flex"}
              flexDirection={{ xs: "column", md: "row" }}
              variant={"outlined"}
              sx={{
                transition: "all .2s ease-in-out",
                "&:hover": {
                  transform: `translateY(-${theme.spacing(1 / 2)})`,
                },
              }}
            >
              <Box
                minWidth={200}
                minHeight={{ xs: 200, md: "auto" }}
                color={theme.palette.primary.dark}
                bgcolor={`${theme.palette.primary.light}22`}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <svg width={64} height={64} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </Box>
              <CardContent>
                <Box display={"flex"} justifyContent={"space-between"} align={"center"}>
                  <Box paddingX={1} color={theme.palette.common.white} bgcolor={colors.red[500]} borderRadius={1}>
                    <Typography color={"inherit"} align={"center"} variant={"subtitle2"}>
                      {item.tag}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant={"subtitle2"}>
                      {item.date} - {item.duration}
                    </Typography>
                  </Box>
                </Box>
                <Box marginTop={1}>
                  <Typography variant={"h6"} gutterBottom>
                    <Box fontWeight={600}>{item.title}</Box>
                  </Typography>
                  <Typography color="text.secondary">{item.subtitle}</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"flex-end"}>
                  <Button size={"large"}>Get ticket</Button>
                </Box>
              </CardContent>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Schedules;
