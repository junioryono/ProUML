import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";

const ContactCard = () => {
  const theme = useTheme();

  return (
    <Box
      component={Card}
      boxShadow={0}
      border={{
        xs: 0,
        md: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box paddingX={{ xs: 0, md: 3 }} paddingTop={3} paddingBottom={{ xs: 0, md: 3 }}>
        <Typography
          sx={{
            fontWeight: "700",
          }}
          gutterBottom
        >
          How can you contact us about this notice?
        </Typography>
        <Typography
          variant={"body2"}
          color={"textSecondary"}
          sx={{
            marginBottom: 2,
          }}
        >
          If you have any questions or concerns about the privacy policy please contact us.
        </Typography>
        <Typography variant={"subtitle2"}>
          hi@maccarianagency.com
          <br />
          via Gola 4
          <br />
          Milan, Milano 20143
          <br />
          Italy
        </Typography>
      </Box>
    </Box>
  );
};

export default ContactCard;
