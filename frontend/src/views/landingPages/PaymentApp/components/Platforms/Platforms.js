import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";

const Platforms = () => {
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
          Integrations
        </Typography>
        <Box component={Typography} fontWeight={700} variant={"h3"} align={"center"} gutterBottom>
          Sync your banking data anywhere.
        </Box>
        <Typography variant={"h6"} component={"p"} color={"textSecondary"} align={"center"}>
          Compliance, financial reviews, tax auditing, and any financial task has never been easier.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {[
          {
            title: "Slack",
            subtitle: "Sync your team's work and activity to share automatically in a channel with a simple plugin.",
            icon: "https://assets.maccarianagency.com/svg/logos/slack.svg",
          },
          {
            title: "Mailchimp",
            subtitle: "Communicate important messages to your users through Landkit using Mailchimp as the delivery service.",
            icon: "https://assets.maccarianagency.com/svg/logos/mailchimp.svg",
          },
          {
            title: "Atlassian",
            subtitle: "Keep your entire team in sync with development and easily manage tasks, goals, and deadlines.",
            icon: "https://assets.maccarianagency.com/svg/logos/atlassian.svg",
          },
        ].map((item, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Box width={1} height={"100%"} data-aos={"fade-up"}>
              <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                <Box component={Avatar} width={90} height={90} marginBottom={2} src={item.icon} />
                <Typography variant={"h6"} gutterBottom fontWeight={500} align={"center"}>
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

export default Platforms;
