import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const Contact = () => {
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Box
        display={"flex"}
        flexDirection={{
          xs: "column",
          sm: "row",
        }}
        alignItems={"center"}
      >
        <Typography
          sx={{
            fontWeight: "medium",
          }}
          variant={"h6"}
        >
          Have a project to discuss?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          endIcon={
            <svg width={16} height={16} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          }
          sx={{
            marginLeft: { xs: 0, sm: 2 },
            marginTop: { xs: 2, sm: 0 },
          }}
        >
          Contact us
        </Button>
      </Box>
    </Box>
  );
};

export default Contact;
