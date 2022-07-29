import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import CardActions from "@mui/material/CardActions";

const Pricing = () => {
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
          Pricing
        </Typography>
        <Box component={Typography} fontWeight={700} variant={"h3"} align={"center"} gutterBottom>
          Flexible and transparent pricing
        </Box>
        <Typography variant={"h6"} component={"p"} color={"textSecondary"} align={"center"}>
          Whatever your status, our offers evolve according to your needs.
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {[
          {
            title: "Basic",
            price: "22",
            features: [
              {
                title: "1 User",
                isIncluded: true,
              },
              {
                title: "1 App",
                isIncluded: true,
              },
              {
                title: "Integrations",
                isIncluded: true,
              },
              {
                title: "Google Ads",
                isIncluded: false,
              },
              {
                title: "SSO via Google",
                isIncluded: false,
              },
              {
                title: "API access",
                isIncluded: false,
              },
              {
                title: "Facebook Ads",
                isIncluded: false,
              },
            ],
            isHighlighted: false,
            btnText: "Get basic",
          },
          {
            title: "Professional",
            price: "44",
            features: [
              {
                title: "1 User",
                isIncluded: true,
              },
              {
                title: "1 App",
                isIncluded: true,
              },
              {
                title: "Integrations",
                isIncluded: true,
              },
              {
                title: "Google Ads",
                isIncluded: true,
              },
              {
                title: "SSO via Google",
                isIncluded: true,
              },
              {
                title: "API access",
                isIncluded: false,
              },
              {
                title: "Facebook Ads",
                isIncluded: false,
              },
            ],
            isHighlighted: true,
            btnText: "Get pro",
          },
          {
            title: "Commercial",
            price: "77",
            features: [
              {
                title: "1 User",
                isIncluded: true,
              },
              {
                title: "1 App",
                isIncluded: true,
              },
              {
                title: "Integrations",
                isIncluded: true,
              },
              {
                title: "Google Ads",
                isIncluded: true,
              },
              {
                title: "SSO via Google",
                isIncluded: true,
              },
              {
                title: "API access",
                isIncluded: true,
              },
              {
                title: "Facebook Ads",
                isIncluded: true,
              },
            ],
            isHighlighted: false,
            btnText: "Contact us",
          },
        ].map((item, i) => (
          <Grid item xs={12} md={4} key={i} data-aos={"fade-up"}>
            <Box component={Card} height={"100%"} display={"flex"} flexDirection={"column"} boxShadow={0} border={`1px solid ${theme.palette.divider}`} borderRadius={4}>
              <Box component={CardContent} padding={4}>
                <Box marginBottom={4} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                  <Typography variant={"h6"} gutterBottom>
                    <Box component={"span"} fontWeight={600}>
                      {item.title}
                    </Box>
                  </Typography>
                  <Box display={"flex"} alignItems={"flex-start"}>
                    <Typography variant={"h4"} color={"primary"}>
                      <Box component={"span"} fontWeight={600} marginRight={1 / 2}>
                        $
                      </Box>
                    </Typography>
                    <Typography variant={"h2"} color={"primary"} gutterBottom>
                      <Box component={"span"} fontWeight={600}>
                        {item.price}
                      </Box>
                    </Typography>
                  </Box>
                  <Typography variant={"subtitle2"} color={"textSecondary"}>
                    Per user, per month
                  </Typography>
                </Box>
                <Grid container spacing={1}>
                  {item.features.map((feature, j) => (
                    <Grid item xs={12} key={j}>
                      <Typography
                        component={"p"}
                        align={"center"}
                        style={{
                          textDecoration: !feature.isIncluded ? "line-through" : "none",
                        }}
                      >
                        {feature.title}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              <Box flexGrow={1} />
              <Box component={CardActions} justifyContent={"center"} padding={4}>
                <Button size={"large"} variant={item.isHighlighted ? "contained" : "outlined"}>
                  {item.btnText}
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Pricing;
