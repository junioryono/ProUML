import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { colors } from "@mui/material";

const Process = ({ themeMode = "light" }) => {
  return (
    <Box>
      <Box marginBottom={4}>
        <Typography
          sx={{
            textTransform: "uppercase",
            fontWeight: "medium",
          }}
          gutterBottom
          color={"textSecondary"}
          align={"center"}
        >
          What we do
        </Typography>
        <Box component={Typography} fontWeight={700} variant={"h3"} gutterBottom align={"center"}>
          You do business we do the softwere
        </Box>
        <Typography variant={"h6"} component={"p"} color={"textSecondary"} align={"center"}>
          Since 2007, we have helped 25 companies launch over 1k incredible products
        </Typography>
        <Box marginTop={3} display={"flex"} justifyContent={"center"}>
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
      <Grid container spacing={4}>
        {[
          {
            title: "Idea",
            subtitle:
              "We meet with your team to know more about your project idea and goals. After that, our team will work together to create an action plan and proposal for your project.",
            icon: (
              <svg width={40} height={40} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            ),
            color: colors.amber,
          },
          {
            title: "Design",
            subtitle:
              "We start by designing a mockup or prototype of your website, and present it to you. Once with the initial mockup, we start the revision process to perfect it.",
            icon: (
              <svg width={40} height={40} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            ),
            color: colors.purple,
          },
          {
            title: "Development",
            subtitle:
              "We develop your website using the best practices and standards, so you have a perfectly responsive, lightning fast, SEO-friendly, and super scalable website.",
            icon: (
              <svg width={40} height={40} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            ),
            color: colors.green,
          },
        ].map((item, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Box color={item.color[themeMode === "light" ? 500 : 700]}>{item.icon}</Box>
            <Box component={Typography} variant={"h6"} gutterBottom fontWeight={500}>
              {item.title}
            </Box>
            <Typography color="text.secondary">{item.subtitle}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

Process.propTypes = {
  themeMode: PropTypes.string.isRequired,
};

export default Process;
