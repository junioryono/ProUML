import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

const PremiumFeatures = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box component={Typography} fontWeight={700} variant={"h3"} marginBottom={4}>
        Premium Features
      </Box>
      <Grid container spacing={4}>
        {[
          {
            title: "Authentication",
            subtitle:
              "We meet with your team to know more about your idea, project and goal. After that, our team sits to create an action plan and proposal for your project.",
            icon: (
              <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
                />
              </svg>
            ),
          },
          {
            title: "Developer first",
            subtitle:
              "We start by designing a mockup or prototype of your website/app, and present it to you. Once with the initial mockup, we start the revision process to perfect it.",
            icon: (
              <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            ),
          },
          {
            title: "NPM support",
            subtitle: "We develop your website using the best practices and standards, so you have a perfectly responsive, lightning fast, and super scalable website.",
            icon: (
              <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            ),
          },
          {
            title: "Dark mode",
            subtitle:
              "When the project is ready, we help you to launch it and push it live. After that, we meet with your team to train them on how to edit, update and scale it.",
            icon: (
              <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            ),
          },
        ].map((item, i) => (
          <Grid key={i} item xs={12} md={6}>
            <ListItem
              component="div"
              disableGutters
              data-aos={"fade-up"}
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                padding: 0,
              }}
            >
              <Box component={ListItemAvatar} marginBottom={1} minWidth={"auto !important"}>
                <Box color={theme.palette.primary.dark}>{item.icon}</Box>
              </Box>
              <ListItemText
                primary={item.title}
                secondary={item.subtitle}
                primaryTypographyProps={{ variant: "h6", gutterBottom: true }}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: 700,
                  },
                  margin: 0,
                }}
              />
            </ListItem>
          </Grid>
        ))}
        <Grid item container justifyContent={"center"}>
          <Button size={"large"} variant={"contained"}>
            Book a demo
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PremiumFeatures;
