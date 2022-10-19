import { Box } from "@mui/material";
import PageHeaderView from "./components/page-header";
import GraphView from "./components/graph";
import "./index.css";

export default function () {
  return (
    <Box display="flex" flexDirection="column">
      <PageHeaderView />
      <GraphView />
    </Box>
  );
}
