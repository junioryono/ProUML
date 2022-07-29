import Box from "@mui/material/Box";

const Partners = () => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent={"center"}>
      {[
        "https://assets.maccarianagency.com/svg/logos/airbnb-original.svg",
        "https://assets.maccarianagency.com/svg/logos/amazon-original.svg",
        "https://assets.maccarianagency.com/svg/logos/fitbit-original.svg",
        "https://assets.maccarianagency.com/svg/logos/google-original.svg",
        "https://assets.maccarianagency.com/svg/logos/hubspot-original.svg",
        "https://assets.maccarianagency.com/svg/logos/mapbox-original.svg",
        "https://assets.maccarianagency.com/svg/logos/netflix-original.svg",
        "https://assets.maccarianagency.com/svg/logos/paypal-original.svg",
        "https://assets.maccarianagency.com/svg/logos/slack-original.svg",
      ].map((item, i) => (
        <Box maxWidth={110} marginTop={{ xs: 1 }} marginRight={{ xs: 3, sm: 6, md: 12 }} key={i}>
          <Box
            component="img"
            height={"100%"}
            width={"100%"}
            src={item}
            alt="..."
            sx={{
              filter: "contrast(0)",
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default Partners;
