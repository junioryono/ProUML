import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";

const Services = () => {
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
          color={"secondary"}
          align={"center"}
        >
          What we do
        </Typography>
        <Box component={Typography} fontWeight={700} variant={"h3"} gutterBottom align={"center"}>
          Digital Marketing / SEO SEM ADS
        </Box>
        <Typography variant={"h6"} component={"p"} color={"textSecondary"} align={"center"}>
          One Of The Best Agencies In Italy
        </Typography>
      </Box>
      <Box>
        <Grid container spacing={4}>
          {[
            {
              title: "Web Design",
              subtitle: "We design and develop amazing, lightning fast, and high-converting websites that make your business grow.",
              icon: (
                <svg width={40} height={40} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
            {
              title: "UI / UX Design",
              subtitle: "We design intuitive web & mobile apps focused on driving user engagement and increasing users retention.",
              icon: (
                <svg width={40} height={40} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              ),
            },
            {
              title: "Brand Design",
              subtitle: "We transform businesses into world-class brands by going through a well thought brand identity design process.",
              icon: (
                <svg width={40} height={40} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              ),
            },
            {
              title: "Product Design",
              subtitle: "We help you transform your idea into a live, intuitive and scalable digital product that your users will use and love.",
              icon: (
                <svg width={40} height={40} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              ),
            },
            {
              title: "Funnel Optimization",
              subtitle: "We help you optimize your website or mobile app flow to increase conversion rates and retention to drive growth.",
              icon: (
                <svg width={40} height={40} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
            {
              title: "Automation",
              subtitle: "We help your business gain leverage and efficiency through automation using simple, yet powerful NoCode tools.",
              icon: (
                <svg width={40} height={40} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
            },
          ].map((item, i) => (
            <Grid item xs={12} sm={6} md={4} key={i} data-aos={"fade-up"}>
              <Box display={"flex"} flexDirection={"column"}>
                <Box component={Avatar} variant="rounded" width={72} height={72} marginBottom={2} bgcolor={alpha(theme.palette.primary.main, 0.1)} borderRadius={3}>
                  <Box color={theme.palette.primary.main}>{item.icon}</Box>
                </Box>
                <Typography variant={"h6"} gutterBottom fontWeight={500}>
                  {item.title}
                </Typography>
                <Typography color="text.secondary">{item.subtitle}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Services;
