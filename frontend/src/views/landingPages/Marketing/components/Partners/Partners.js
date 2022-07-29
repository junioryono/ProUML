import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Partners = () => {
  const theme = useTheme();
  return (
    <Box>
      <Box marginBottom={4}>
        <Box component={Typography} fontWeight={700} variant={"h3"} align={"center"}>
          Trusted by open source & enterprise companies,
          <br />
          and more than 33,000 users
        </Box>
      </Box>
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
  );
};

export default Partners;
