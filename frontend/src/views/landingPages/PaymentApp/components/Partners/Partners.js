import Box from "@mui/material/Box";

const Partners = () => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent={"center"}>
      {[
        "https://assets.maccarianagency.com/svg/logos/airbnb-original.svg",
        "https://assets.maccarianagency.com/svg/logos/amazon-original.svg",
        "https://assets.maccarianagency.com/svg/logos/fitbit-original.svg",
        "https://assets.maccarianagency.com/svg/logos/netflix-original.svg",
        "https://assets.maccarianagency.com/svg/logos/google-original.svg",
        "https://assets.maccarianagency.com/svg/logos/paypal-original.svg",
      ].map((item, i) => (
        <Box maxWidth={100} marginTop={1} marginBottom={1} marginRight={4} key={i}>
          <Box
            component="img"
            height={"100%"}
            width={"100%"}
            src={item}
            alt="..."
            sx={{
              filter: "brightness(0) invert(1)",
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default Partners;
