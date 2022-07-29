import PropTypes from "prop-types";
import Slider from "react-slick";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

const Partners = ({ themeMode = "light" }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.up("xs"), {
    defaultMatches: true,
  });
  const isSm = useMediaQuery(theme.breakpoints.up("sm"), {
    defaultMatches: true,
  });
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  let slidesToShow = 1;
  if (isXs) {
    slidesToShow = 1;
  }
  if (isSm) {
    slidesToShow = 2;
  }
  if (isMd) {
    slidesToShow = 3;
  }

  const sliderOpts = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
  };

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
          Our Customers
        </Typography>
        <Box component={Typography} fontWeight={700} variant={"h3"} align={"center"}>
          See how we are helping teams
          <br />
          and businesses
        </Box>
      </Box>
      <Slider {...sliderOpts}>
        {[
          {
            companyLogo: "https://assets.maccarianagency.com/svg/logos/airbnb-original.svg",
            description:
              "Unforgettable trips start with Airbnb. Find adventures nearby or in faraway places and access unique homes, experiences, and places around the world.",
          },
          {
            companyLogo: "https://assets.maccarianagency.com/svg/logos/amazon-original.svg",
            description:
              "Free delivery on millions of items with Prime. Low prices across earth's biggest selection of books, music, DVDs, electronics, computers, software",
          },
          {
            companyLogo: "https://assets.maccarianagency.com/svg/logos/fitbit-original.svg",
            description:
              "Find your fit with Fitbit's family of fitness products that help you stay motivated and improve your health by tracking your activity, exercise, food, weight and sleep.",
          },
          {
            companyLogo: "https://assets.maccarianagency.com/svg/logos/google-original.svg",
            description:
              "Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking for.",
          },
          {
            companyLogo: "https://assets.maccarianagency.com/svg/logos/hubspot-original.svg",
            description:
              "HubSpot offers a full platform of marketing, sales, customer service, and CRM software — plus the methodology, resources, and support — to help businesses.",
          },
          {
            companyLogo: "https://assets.maccarianagency.com/svg/logos/mapbox-original.svg",
            description:
              "Integrate custom live maps, location search, and turn-by-turn navigation into any mobile or web app with Mapbox APIs & SDKs. Get started for free.",
          },
          {
            companyLogo: "https://assets.maccarianagency.com/svg/logos/netflix-original.svg",
            description: "Watch Netflix movies & TV shows online or stream right to your smart TV, game console, PC, Mac, mobile, tablet and more.",
          },
          {
            companyLogo: "https://assets.maccarianagency.com/svg/logos/paypal-original.svg",
            description: "PayPal is the faster, safer way to send money, make an online payment, receive money or set up a merchant account.",
          },
          {
            companyLogo: "https://assets.maccarianagency.com/svg/logos/slack-original.svg",
            description: "Slack is a new way to communicate with your team. It's faster, better organized, and more secure than email.",
          },
        ].map((item, i) => (
          <Box key={i} padding={{ xs: 1, sm: 2, md: 3 }}>
            <Box
              component={"a"}
              href={""}
              display={"block"}
              width={"100%"}
              height={"100%"}
              sx={{
                textDecoration: "none",
                transition: "all .2s ease-in-out",
                "&:hover": {
                  transform: `translateY(-${theme.spacing(1 / 2)})`,
                },
              }}
            >
              <Box component={Card} width={"100%"} height={"100%"} borderRadius={3} display={"flex"} flexDirection={"column"}>
                <Box component={CardContent} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                  <Box maxWidth={100} marginBottom={2}>
                    <Box
                      component="img"
                      height={"100%"}
                      width={"100%"}
                      src={item.companyLogo}
                      alt="..."
                      sx={{
                        filter: themeMode === "dark" ? "contrast(0)" : "none",
                      }}
                    />
                  </Box>
                  <Typography align={"center"} variant={"body2"} color="textSecondary">
                    {item.description}
                  </Typography>
                </Box>
                <Box flexGrow={1} />
                <Box component={CardActions} justifyContent={"center"}>
                  <Button size="large">Learn More</Button>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

Partners.propTypes = {
  themeMode: PropTypes.string.isRequired,
};

export default Partners;
