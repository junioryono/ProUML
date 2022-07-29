import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const CallToAction = () => {
  return (
    <Box display={"flex"} justifyContent={"space-between"} alignItems={{ xs: "stretched", sm: "flex-start", md: "center" }} flexDirection={{ xs: "column", md: "row" }}>
      <Box maxWidth={{ xs: "100%", md: "70%" }}>
        <Typography variant={"h6"} gutterBottom>
          Secure your data in minutes.
        </Typography>
        <Typography color="text.secondary">Prevent security breaches and save money.</Typography>
      </Box>
      <Box component={Button} variant={"contained"} size={"large"} marginTop={{ xs: 2, md: 0 }} marginLeft={{ md: 2 }}>
        Start for free
      </Box>
    </Box>
  );
};

export default CallToAction;
