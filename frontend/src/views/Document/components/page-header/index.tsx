import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { supabase } from "supabase/supabase";
import { useAuth } from "supabase/Auth";

import { Box } from "@mui/material";

import ShareDialog from "./ShareDialog";
import Logo from "./Logo";
import Title from "./Title";

const getLastEditString = (newTime: number) => {
  if (newTime < 10) {
    return "Last edit was seconds ago";
  } else if (newTime < 60) {
    return "Last edit was less than one minute ago";
  } else if (newTime < 3600) {
    const minutesAgo = Math.floor(newTime / 60);
    return `Last edit was ${minutesAgo} ${minutesAgo > 1 ? "minutes" : "minute"} ago`;
  }

  return "";
};

export default function () {
  const auth = useAuth();
  const navigate = useNavigate();
  const { documentId } = useParams();

  const shareDialogState = useState(false);

  const titleState = useState("");
  const [lastEdit, setLastEdit] = useState("");

  /*
   * Set title from database and auto-update
   */
  useEffect(() => {
    const updateIntervalSeconds = 60;
    let intervalId: any = undefined;

    const lastEditFunction = () => {
      let newTime = updateIntervalSeconds;
      setLastEdit(getLastEditString(newTime));
      newTime += updateIntervalSeconds;
    };

    supabase
      .from("document")
      .select("title, last_modified_at")
      .eq("id", documentId)
      .then((response) => {
        if (!response || !Array.isArray(response.data) || !response.data[0]) {
          navigate(`/document/${documentId}/unauthorized`);
          throw new Error("Could not access document.");
        }

        const documentData = response.data[0] as any;
        titleState[1](documentData.title);

        const lastModifiedTime = new Date(documentData.last_modified_at);
        const now = new Date(new Date().toUTCString());
        const secondsAgo = Math.abs(now.getTime() - lastModifiedTime.getTime()) / 1000;
        setLastEdit(getLastEditString(secondsAgo));
        intervalId = setInterval(() => lastEditFunction(), updateIntervalSeconds * 1000);
      });

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <ShareDialog title={titleState[0]} state={shareDialogState} />
      <Box display="flex" height={64}>
        <Logo />
        <Title state={titleState} />
      </Box>
    </>
  );
}
