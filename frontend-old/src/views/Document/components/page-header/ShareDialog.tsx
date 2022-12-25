import { useState } from "react";
import { useParams } from "react-router-dom";

import { supabase } from "supabase/supabase";
import { useAuth } from "supabase/Auth";

import { TextField, useTheme, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, Box, Avatar, Typography, Button } from "@mui/material";
import { brown } from "@mui/material/colors";

export default function ({ title, state }: { title: string; state: [boolean, React.Dispatch<React.SetStateAction<boolean>>] }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const auth = useAuth();
  const { documentId } = useParams();
  const [shareDialogOpen, setShareDialogOpen] = state;
  const [shareEmailValue, setShareEmailValue] = useState("");
  const [shareEmailError, setShareEmailError] = useState<boolean | null | undefined>(false);
  const [currentlySharedWith, setCurrentlySharedWith] = useState<{ email: string; role: string }[] | null | undefined>(undefined);

  const addEditor = async () => {
    setShareEmailError(false);

    if (!documentId) {
      setShareEmailError(true);
      return;
    }

    if (Array.isArray(currentlySharedWith) && currentlySharedWith.some((profile) => profile.email === shareEmailValue)) {
      setShareEmailError(null);
      return;
    }

    const [profile, editors] = await Promise.all([
      supabase
        .from("profile")
        .select("id, full_name")
        .match({ email: shareEmailValue })
        .then((response: any) => {
          if (!response || !Array.isArray(response.data) || !response.data[0]) {
            return false;
          }

          return response.data[0];
        }),
      supabase
        .from("document")
        .select("editor")
        .match({ id: documentId })
        .then((response: any) => {
          if (!response || !Array.isArray(response.data) || !response.data[0]) {
            return false;
          }

          return response.data[0].editor;
        }),
    ]);

    if (!profile || !profile.id || !Array.isArray(editors)) {
      setShareEmailError(true);
      return;
    }

    editors.push(profile.id);

    supabase
      .from("document")
      .update({ editor: editors })
      .match({ id: documentId })
      .then(() => {
        setShareDialogOpen(false);
      });

    setCurrentlySharedWith((current) => {
      const newUser = { email: shareEmailValue, fullName: profile.full_name, role: "Editor" };
      if (!current) {
        return [newUser];
      }

      return [...current, newUser];
    });
  };

  return (
    <Dialog fullScreen={fullScreen} open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} PaperProps={{ sx: { backgroundImage: "unset" } }}>
      <DialogTitle color="text.primary">Share "{title}"</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          onFocus={(event) => {
            event.target.select();
          }}
          margin="normal"
          id="name"
          placeholder="Add people by email"
          defaultValue={shareEmailValue}
          onChange={(e) => setShareEmailValue(e.target.value)}
          type="email"
          fullWidth
          variant="standard"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addEditor();
            }
          }}
        />
        {shareEmailError !== false &&
          (shareEmailError === null ? <Box>User already has access</Box> : undefined ? <Box>Adding user</Box> : <Box>This email is not registered with ProUML</Box>)}
        <DialogContentText color="textPrimary" fontWeight={500} marginTop={4} marginBottom={1}>
          People with access
        </DialogContentText>

        {Array.isArray(currentlySharedWith) ? (
          currentlySharedWith.map((profile: any) => {
            const nameLetter = profile.fullName.split(" ");

            return (
              <Box key={profile.email} display="flex" width={525} marginTop={2}>
                <Avatar sx={{ bgcolor: brown[500], fontSize: "1rem" }}>
                  {nameLetter[0] && nameLetter[0][0] && nameLetter[0][0]}
                  {nameLetter[1] && nameLetter[1][0] && nameLetter[1][0]}
                </Avatar>
                <Box display="flex" flexDirection="column" marginLeft={1}>
                  <Typography fontSize={14} fontWeight={500}>
                    {profile.fullName} {auth?.session?.user?.email === profile.email && "(you)"}
                  </Typography>
                  <Typography fontSize={12}>{profile.email}</Typography>
                </Box>
                <Box marginLeft={"auto"} sx={{ cursor: "default" }}>
                  {profile.role}
                </Box>
              </Box>
            );
          })
        ) : currentlySharedWith === null ? (
          <Box width={525}>An error occurred</Box>
        ) : (
          <Box width={525}>Loading</Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => setShareDialogOpen(false)}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
