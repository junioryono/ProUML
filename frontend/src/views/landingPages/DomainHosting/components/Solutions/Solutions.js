import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

const Solutions = () => {
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
        >
          All in oune solution
        </Typography>
        <Typography
          variant="h3"
          data-aos={"fade-up"}
          gutterBottom
          sx={{
            fontWeight: 700,
          }}
        >
          A one stop shop for storage.
        </Typography>
        <Typography variant="h6" color={"textSecondary"} data-aos={"fade-up"}>
          We are a complete solution for all your storage needs.
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {[
          {
            title: "Integrations",
            features: ["Basic CRUD API", "3rd party snippets", "Slack notifications", "Zapier hooks"],
          },
          {
            title: "Storage",
            features: ["SQL and SQLite", "File system access", "Infinite storage", "Mongo and NoSQL"],
          },
          {
            title: "Integrations",
            features: ["Basic CRUD API", "3rd party snippets", "Slack notifications", "Zapier hooks"],
          },
          {
            title: "Storage",
            features: ["SQL and SQLite", "File system access", "Infinite storage", "Mongo and NoSQL"],
          },
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Typography variant={"h6"} gutterBottom>
              {item.title}
            </Typography>
            {item.features.map((feature, j) => (
              <Box component={ListItem} disableGutters width={"auto"} padding={0} key={j} data-aos={"fade-up"}>
                <Box component={ListItemAvatar} minWidth={"auto !important"} marginRight={2}>
                  <Box component={Avatar} bgcolor={theme.palette.secondary.main} width={20} height={20}>
                    <svg width={12} height={12} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Box>
                </Box>
                <ListItemText primary={feature} />
              </Box>
            ))}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Solutions;
