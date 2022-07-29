import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TeamWorkingIllustration from "svg/illustrations/TeamWorking";

const Story = () => {
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
          color={"textSecondary"}
          align={"center"}
        >
          Our story
        </Typography>
        <Box component={Typography} fontWeight={700} variant={"h3"} gutterBottom align={"center"}>
          We design and implement creative solutions
          <br />
          to everyday business problems
        </Box>
        <Typography variant={"h6"} component={"p"} color={"textSecondary"} align={"center"}>
          We are a team of creative consultants who help bridge the digital gap between companies and their clients with websites that not only serve as marketing
          platforms but also provide solutions to online business problems and digital marketing strategies that connect you with the ideal client and help create a loyal
          customer.
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
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"} marginBottom={4}>
        <Box height={"100%"} width={"100%"} maxWidth={600}>
          <TeamWorkingIllustration height={"100%"} width={"100%"} />
        </Box>
      </Box>
      <Box>
        <Typography
          sx={{
            textTransform: "uppercase",
            fontWeight: "medium",
          }}
          gutterBottom
          color={"textSecondary"}
          align={"center"}
        >
          As seen on
        </Typography>
        <Box display="flex" flexWrap="wrap" justifyContent={"center"}>
          {[
            "https://assets.maccarianagency.com/svg/logos/airbnb-original.svg",
            "https://assets.maccarianagency.com/svg/logos/amazon-original.svg",
            "https://assets.maccarianagency.com/svg/logos/fitbit-original.svg",
            "https://assets.maccarianagency.com/svg/logos/netflix-original.svg",
            "https://assets.maccarianagency.com/svg/logos/google-original.svg",
            "https://assets.maccarianagency.com/svg/logos/paypal-original.svg",
          ].map((item, i) => (
            <Box maxWidth={90} marginTop={2} marginRight={4} key={i}>
              <Box
                component="img"
                height={"100%"}
                width={"100%"}
                src={item}
                alt="..."
                sx={{
                  filter: theme.palette.mode === "dark" ? "brightness(0) invert(0.7)" : "none",
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Story;
