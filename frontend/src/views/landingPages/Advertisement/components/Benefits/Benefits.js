import PropTypes from "prop-types";
import { colors } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";

const Benefits = ({ themeMode = "light" }) => {
  return (
    <Box>
      <Box marginBottom={4}>
        <Typography sx={{ textTransform: "uppercase", fontWeight: "medium" }} gutterBottom color={"secondary"} align={"center"}>
          Benefits
        </Typography>
        <Box component={Typography} sx={{ fontWeight: 700 }} variant={"h3"} gutterBottom align={"center"}>
          What our 37,500+ clients
          <br />
          love about Webbee
        </Box>
        <Typography align={"center"} color="textSecondary" variant={"h6"}>
          We design & develop amazing websites and digital products for startups, companies and ourselves.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {[
          {
            title: "Automation",
            subtitle: "We help your business gain leverage and efficiency through automation using simple, yet powerful NoCode tools.",
            icon: (
              <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            ),
            color: colors.teal,
          },
          {
            title: "Funnel Optimization",
            subtitle: "We help you optimize your website or mobile app flow to increase conversion rates and retention to drive growth.",
            icon: (
              <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            ),
            color: colors.pink,
          },
          {
            title: "Idea Creation",
            subtitle: "We meet with your team to know more about your project idea and goals.",
            icon: (
              <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        ].map((item, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Box width={1} height={"100%"} data-aos={"fade-up"}>
              <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                <Box
                  component={Avatar}
                  variant="rounded"
                  width={60}
                  height={60}
                  marginBottom={2}
                  bgcolor={item.color[themeMode === "light" ? 50 : 100]}
                  color={item.color[themeMode === "light" ? 500 : 700]}
                >
                  {item.icon}
                </Box>
                <Typography variant={"h6"} gutterBottom sx={{ fontWeight: 500 }} align={"center"}>
                  {item.title}
                </Typography>
                <Typography align={"center"} color="textSecondary">
                  {item.subtitle}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

Benefits.propTypes = {
  themeMode: PropTypes.string.isRequired,
};

export default Benefits;
