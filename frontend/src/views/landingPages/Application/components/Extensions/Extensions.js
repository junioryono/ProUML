import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

const Extensions = () => {
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
          Extensions
        </Typography>
        <Box component={Typography} fontWeight={700} variant={"h3"} gutterBottom align={"center"}>
          Extensions and plugins
          <br />
          to connected with you favourite apps
        </Box>
        <Typography color="text.secondary" variant={"h6"} align={"center"}>
          Install external apps, services, plugins on your own infrastructure.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {[
          {
            title: "Google Drive",
            subtitle: "Sync any file store to Google Drive for automated sharing with people outside the company.",
            icon: "https://assets.maccarianagency.com/svg/logos/google-drive.svg",
          },
          {
            title: "Google Ad Manager",
            subtitle: "Easily manage and edit any Adwords campaign inline to improve ROI with constant review.",
            icon: "https://assets.maccarianagency.com/svg/logos/google-ad-manager.svg",
          },
          {
            title: "Atlassian",
            subtitle: "Keep your entire team in sync with development and easily manage tasks, goals, and deadlines.",
            icon: "https://assets.maccarianagency.com/svg/logos/atlassian.svg",
          },
          {
            title: "Slack",
            subtitle: "Sync your team's work and activity to share automatically in a channel with a simple plugin.",
            icon: "https://assets.maccarianagency.com/svg/logos/slack.svg",
          },
          {
            title: "Mailchimp",
            subtitle: "Communicate important messages to your users using Mailchimp as the delivery service.",
            icon: "https://assets.maccarianagency.com/svg/logos/mailchimp.svg",
          },
          {
            title: "Dropbox",
            subtitle: "Sync any file store to Dropbox for automated sharing with people outside the company.",
            icon: "https://assets.maccarianagency.com/svg/logos/dropbox.svg",
          },
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={4} key={i} data-aos={"fade-up"}>
            <Box
              component={"a"}
              href={""}
              display={"block"}
              width={"100%"}
              height={"100%"}
              sx={{
                textDecoration: "none",
                transition: "all .2s ease-in-out",
                "&:hover": {
                  transform: `translateY(-${theme.spacing(1 / 2)})`,
                },
              }}
            >
              <Box component={Card} width={"100%"} height={"100%"} borderRadius={3}>
                <Box component={CardContent} height={"100%"} display={"flex"} flexDirection={"column"}>
                  <Box component={Avatar} width={90} height={90} marginBottom={2} src={item.icon} />
                  <Box component={Typography} variant={"h6"} gutterBottom fontWeight={500}>
                    {item.title}
                  </Box>
                  <Typography color="text.secondary">{item.subtitle}</Typography>
                  <Box flexGrow={1} />
                  <Box justifyContent={"center"} marginTop={2}>
                    <Button size="large" variant={"contained"} fullWidth>
                      Install
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Extensions;
