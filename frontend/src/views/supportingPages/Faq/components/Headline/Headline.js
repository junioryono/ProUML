import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Headline = () => {
  return (
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
        F.A.Q.
      </Typography>
      <Box marginBottom={2}>
        <Typography
          variant="h2"
          align={"center"}
          sx={{
            fontWeight: 700,
          }}
        >
          Have a question?
        </Typography>
      </Box>
      <Box>
        <Typography variant="h6" align={"center"} color={"textSecondary"}>
          Search our FAQ for answers to anything you might ask.
        </Typography>
      </Box>
    </Box>
  );
};

export default Headline;
