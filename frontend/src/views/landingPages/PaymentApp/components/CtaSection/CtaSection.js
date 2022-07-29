import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const CtaSection = () => (
  <Box display={"flex"} justifyContent={"space-between"} alignItems={{ xs: "flex-start", sm: "center" }} flexDirection={{ xs: "column", sm: "row" }}>
    <Box>
      <Typography fontWeight={700} variant={"h6"} gutterBottom>
        Register today. Banking tomorrow.
      </Typography>
      <Typography>Avoid the nightmare and use our platform.</Typography>
    </Box>
    <Box component={Button} marginTop={{ xs: 2, sm: 0 }} variant="contained" size={"large"}>
      Get started
    </Box>
  </Box>
);

export default CtaSection;
