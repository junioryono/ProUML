import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { initGraph, initListeners, initDragAndDrop, startDrag } from "./utils";
import { Graph, Cell, Model } from "@antv/x6";
import { GridLayout } from "@antv/layout";
import type { Dnd } from "@antv/x6/es/addon/dnd";
import files from "JavaToJSON/SnakeGame";
import "./Graph.css";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { brown } from "@mui/material/colors";
import LockIcon from "@mui/icons-material/Lock";
import AddLinkIcon from "@mui/icons-material/AddLink";
import Link from "@mui/material/Link";
import { Link as RouterLink, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { styled, useTheme } from "@mui/material/styles";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import UndoIcon from "@mui/icons-material/UndoRounded";
import RedoIcon from "@mui/icons-material/RedoRounded";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FlipToFrontIcon from "@mui/icons-material/FlipToFront";
import FlipToBackIcon from "@mui/icons-material/FlipToBack";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import BrushIcon from "@mui/icons-material/Brush";
import LineWeightIcon from "@mui/icons-material/LineWeight";
import LineStyleIcon from "@mui/icons-material/LineStyle";
import ArticleIcon from "@mui/icons-material/Article";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import IconButton from "@mui/material/IconButton";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import UploadIcon from "@mui/icons-material/Upload";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import InfoIcon from "@mui/icons-material/Info";
import DescriptionIcon from "@mui/icons-material/Description";
import PrintIcon from "@mui/icons-material/Print";
import { useAuth } from "supabase/Auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "supabase/supabase";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Node } from "@antv/x6";
import Quill from "quill";
import Editable from "./Editable";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import TextField from "@mui/material/TextField";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    border: 0,
    "&.Mui-disabled": {
      border: 0,
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

function GraphView() {
  const theme = useTheme();
  const { session: authSession, signIn } = useAuth();
  const navigate = useNavigate();

  const { id: documentId } = useParams();

  // Check if user has access to this document
  // If they dont, check if it is public

  const graph = useRef<Graph>();
  const dnd = useRef<Dnd>();
  const container = useRef<HTMLDivElement>();
  const minimapContainer = useRef<HTMLDivElement>();
  const [selectedCells, setSelectedCells] = useState<Cell<Cell.Properties> | Cell<Cell.Properties>[]>();
  const [freshRender, forceRender] = useReducer((x) => x + 1, 0);
  const [title, setTitle] = useState("");
  const [lastEdit, setLastEdit] = useState("");
  const [titleEditorSelected, setTitleEditorSelected] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  // const [alignment, setAlignment] = React.useState("left");
  const [alignment, setAlignment] = React.useState("");
  // const [formats, setFormats] = React.useState(() => ["italic"]);
  const [formats, setFormats] = React.useState<string[]>(() => []);

  const [fileOpen, setFileOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [shareEmailValue, setShareEmailValue] = useState("");
  const [shareEmailError, setShareEmailError] = useState<boolean | null | undefined>(false);
  const [currentlySharedWith, setCurrentlySharedWith] = useState<{ email: string; role: string }[] | null | undefined>(undefined);
  const [userMetadata, setUserMetadata] = useState<{ fullName: string | undefined; fullNameAbbreviated: string | undefined } | null | undefined>(undefined);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [expandedShapeSection, setExpandedShapeSection] = React.useState<string | false>("General");

  const handleExpandedSectionChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpandedShapeSection(newExpanded ? panel : false);
  };

  useEffect(() => {
    if (!shareDialogOpen) {
      setShareEmailValue("");
      setShareEmailError(false);
    }
  }, [shareDialogOpen]);

  useEffect(() => {
    if (!authSession || !authSession.user) {
      setUserMetadata(null);
      return;
    }

    supabase
      .from("profile")
      .select("full_name")
      .eq("id", authSession.user.id)
      .then((response) => {
        if (!response || !Array.isArray(response.data) || !response.data[0]) {
          setUserMetadata(null);
          throw new Error("Could not access document data.");
        }

        const fullNameSplit = response.data[0].full_name && response.data[0].full_name.split(" ");
        const nameAbbrev =
          fullNameSplit[0] && fullNameSplit[0][0] ? (fullNameSplit[1] && fullNameSplit[1][0] ? fullNameSplit[0][0] + fullNameSplit[1][0] : undefined) : undefined;

        setUserMetadata({
          fullName: response.data[0].full_name,
          fullNameAbbreviated: nameAbbrev,
        });
      });

    return () => {
      setUserMetadata(undefined);
    };
  }, [authSession]);

  useEffect(() => {
    if (documentId && shareDialogOpen && currentlySharedWith === undefined) {
      supabase
        .from("document")
        .select("owner, editor, viewer")
        .eq("id", documentId)
        .then((response) => {
          if (!response || !Array.isArray(response.data) || !response.data[0]) {
            setCurrentlySharedWith(null);
            throw new Error("Could not access document data.");
          }

          const allUUIDsString = [...new Set([...response.data[0].owner, ...response.data[0].editor, ...response.data[0].viewer])]
            .map((uuid) => '"' + uuid + '"')
            .join(",");

          supabase
            .from("profile")
            .select("id, email, full_name")
            .filter("id", "in", "(" + allUUIDsString + ")")
            .then((response2) => {
              if (!response2 || !Array.isArray(response2.data) || !response2.data[0]) {
                setCurrentlySharedWith(null);
                throw new Error("Could not access document data.");
              }

              const owners = response2.data
                .filter((profile: any) => {
                  if (!response.data) {
                    return false;
                  }
                  return response.data[0].owner.some((uuid: any) => uuid === profile.id);
                })
                .map((profile: any) => {
                  return {
                    email: profile.email,
                    fullName: profile.full_name,
                    role: "Owner",
                  };
                });

              const editors = response2.data
                .filter((profile: any) => {
                  if (!response.data) {
                    return false;
                  }

                  const isOwner = response.data[0].owner.some((uuid: any) => uuid === profile.id);
                  if (isOwner) {
                    return false;
                  }

                  return response.data[0].editor.some((uuid: any) => uuid === profile.id);
                })
                .map((profile: any) => {
                  return {
                    email: profile.email,
                    fullName: profile.full_name,
                    role: "Editor",
                  };
                });

              const viewers = response2.data
                .filter((profile: any) => {
                  if (!response.data) {
                    return false;
                  }

                  const isOwner = response.data[0].owner.some((uuid: any) => uuid === profile.id);
                  if (isOwner) {
                    return false;
                  }

                  const isEditor = response.data[0].editor.some((uuid: any) => uuid === profile.id);
                  if (isEditor) {
                    return false;
                  }

                  return response.data[0].viewer.some((uuid: any) => uuid === profile.id);
                })
                .map((profile: any) => {
                  return {
                    email: profile.email,
                    fullName: profile.full_name,
                    role: "Viewer",
                  };
                });

              const sharedWith = [...owners, ...editors, ...viewers];

              setCurrentlySharedWith(sharedWith);
            });
        });
    }
  }, [documentId, shareDialogOpen, currentlySharedWith]);

  const addEditor = async () => {
    setShareEmailError(false);

    if (!documentId) {
      setShareEmailError(true);
      return;
    }

    // amerjunioryono@gmail.com
    if (Array.isArray(currentlySharedWith) && currentlySharedWith.some((profile) => profile.email === shareEmailValue)) {
      setShareEmailError(null);
      return;
    }

    const [profile, editors] = await Promise.all([
      supabase
        .from("profile")
        .select("id, full_name")
        .match({ email: shareEmailValue })
        .then((response) => {
          if (!response || !Array.isArray(response.data) || !response.data[0]) {
            return false;
          }

          return response.data[0];
        }),
      supabase
        .from("document")
        .select("editor")
        .match({ id: documentId })
        .then((response) => {
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

    //   {
    //     email: any;
    //     fullName: any;
    //     role: string;
    // }

    setCurrentlySharedWith((current) => {
      const newUser = { email: shareEmailValue, fullName: profile.full_name, role: "Editor" };
      if (!current) {
        return [newUser];
      }

      return [...current, newUser];
    });
  };

  const handleFormat = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setFormats(newFormats);
  };

  // editorContext

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    newAlignment !== null && setAlignment(newAlignment);
  };

  const setLastEditFunction = (newTime: number) => {
    if (newTime < 10) {
      setLastEdit("Last edit was seconds ago");
    } else if (newTime < 60) {
      setLastEdit("Last edit was less than one minute ago");
    } else if (newTime < 3600) {
      const minutesAgo = Math.floor(newTime / 60);
      setLastEdit(`Last edit was ${minutesAgo} ${minutesAgo > 1 ? "minutes" : "minute"} ago`);
    }
  };

  useEffect(() => {
    const updateIntervalSeconds = 60;
    let intervalId: any = undefined;

    const lastEditFunction = () => {
      let newTime = updateIntervalSeconds;
      setLastEditFunction(newTime);
      newTime += updateIntervalSeconds;
    };

    supabase
      .from("document")
      .select("title, last_modified_at, json")
      .eq("id", documentId)
      .then((response) => {
        if (!response || !Array.isArray(response.data) || !response.data[0]) {
          navigate(`/document/${documentId}/unauthorized`);
          throw new Error("Could not access document.");
        }

        const documentData = response.data[0] as any;
        setTitle(documentData.title);

        const lastModifiedTime = new Date(documentData.last_modified_at);
        const now = new Date(new Date().toUTCString());
        const secondsAgo = Math.abs(now.getTime() - lastModifiedTime.getTime()) / 1000;
        setLastEditFunction(secondsAgo);
        intervalId = setInterval(() => lastEditFunction(), updateIntervalSeconds * 1000);

        if (documentData.json) {
          try {
            graph.current?.fromJSON(JSON.parse(documentData.json));
          } catch {
            throw new Error("Could not parse graph.");
          }
        }
      });

    // const listener = supabase
    //   .from(`document:id=eq.${documentId}`)
    //   .on("*", (response) => {
    //     console.log("listener event", response);
    //     if (!response || !response.new) {
    //       return;
    //     }

    //     setLastEdit("Last edit was seconds ago");
    //     intervalId = setInterval(() => lastEditFunction(), updateIntervalSeconds * 1000);

    //     if (response.new.title !== title) {
    //       setTitle(response.new.title);
    //     }

    //     if (response.new.json) {
    //       if (!response.new.json.userEdit || response.new.json.userEdit !== authSession?.user?.id) {
    //         console.log("resetting graph from json");
    //         graph.current?.fromJSON(response.new.json);
    //       }
    //     }
    //   })
    //   .subscribe();

    return () => {
      // console.log("unsubscribing");
      // listener.unsubscribe();
      // supabase.removeSubscription(listener);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (authSession === null) {
      // also need to check if user even has access, then use state to display Request Access
    }
  }, [authSession]);

  useEffect(() => {
    if (titleEditorSelected) {
      titleRef.current?.select();
    }
  }, [titleEditorSelected]);

  const submitTitleEdit = useCallback(() => {
    setTitleEditorSelected(false);
    supabase
      .from("document")
      .update({ title })
      .match({ id: documentId })
      .then((response) => console.log("response", response));
  }, [title]);

  useEffect(() => {
    if (!graph.current) {
      return;
    }

    // GROUPING
    // if (Array.isArray(selectedCells)) {
    //   for (const cell of selectedCells) {
    //     cell
    //   }
    // } else if (selectedCells) {
    //   selectedCells.removetoo
    // }
  }, [selectedCells]);

  useEffect(() => {
    const handleResize = () => {
      graph.current?.size.resizeScroller(window.innerWidth - 250, window.innerHeight - 106);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!container.current || !minimapContainer.current || !documentId) {
      console.error("Container refs not found.");
      return;
    }

    graph.current = initGraph(container.current, minimapContainer.current);
    dnd.current = initDragAndDrop(graph.current);

    initListeners(graph.current, container.current, documentId, forceRender, setSelectedCells);

    // const layout = new GridLayout({
    //   type: "grid",
    //   nodeSize: [1100, 1100],
    // });

    // const model = layout.layout({
    //   nodes: parsedForUML as any,
    // });

    // graph.current.fromJSON(model);
    // graph.current.zoomToFit();

    return () => {
      graph.current?.dispose();
    };
  }, []);

  const refContainer = (containerParam: HTMLDivElement) => {
    container.current = containerParam;
  };

  const refMinimapContainer = (containerParam: HTMLDivElement) => {
    minimapContainer.current = containerParam;
  };

  return (
    <Box display="flex" flexDirection="column">
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
                      {profile.fullName} {authSession?.user?.email === profile.email && "(you)"}
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
      <Box display="flex" height={64}>
        <Box width={150} display="flex" justifyContent="center" alignItems="center" paddingBottom={0.5}>
          <Link underline="none" component={RouterLink} to="/" height={{ xs: 28, md: 32 }} fontSize={{ xs: 20, md: 24 }} color="textPrimary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="85"
              zoomAndPan="magnify"
              viewBox="0 0 63.75 30.000001"
              height="40"
              preserveAspectRatio="xMidYMid meet"
              version="1.0"
            >
              <defs>
                <g />
                <clipPath id="id1">
                  <path d="M 55 5 L 62.601562 5 L 62.601562 22 L 55 22 Z M 55 5" clipRule="nonzero" />
                </clipPath>
                <clipPath id="id2">
                  <path d="M 63.746094 21.554688 L 55.746094 22.023438 L 54.808594 6.019531 L 62.8125 5.550781 Z M 63.746094 21.554688" clipRule="nonzero" />
                </clipPath>
                <clipPath id="id3">
                  <path d="M 63.746094 21.554688 L 55.746094 22.023438 L 54.808594 6.019531 L 62.8125 5.550781 Z M 63.746094 21.554688" clipRule="nonzero" />
                </clipPath>
                <clipPath id="id4">
                  <path d="M 63.746094 21.554688 L 55.746094 22.023438 L 54.808594 6.019531 L 62.8125 5.550781 Z M 63.746094 21.554688" clipRule="nonzero" />
                </clipPath>
                <clipPath id="id5">
                  <path d="M 1 13.648438 L 56 13.648438 L 56 28.21875 L 1 28.21875 Z M 1 13.648438" clipRule="nonzero" />
                </clipPath>
              </defs>
              <g clipPath="url(#id1)">
                <g clipPath="url(#id2)">
                  <g clipPath="url(#id3)">
                    <g clipPath="url(#id4)">
                      <path
                        fill="currentColor"
                        d="M 60.304688 21.742188 C 60.300781 21.742188 60.296875 21.742188 60.289062 21.742188 C 60.285156 21.742188 60.28125 21.742188 60.277344 21.742188 C 60.269531 21.742188 60.265625 21.738281 60.257812 21.742188 L 55.949219 21.152344 C 55.898438 21.144531 55.847656 21.125 55.804688 21.09375 C 55.761719 21.066406 55.730469 21.023438 55.707031 20.972656 C 55.6875 20.925781 55.679688 20.875 55.683594 20.824219 C 55.6875 20.773438 55.707031 20.722656 55.738281 20.679688 L 58.203125 17.234375 C 58.226562 17.199219 58.257812 17.171875 58.292969 17.152344 C 58.328125 17.128906 58.367188 17.117188 58.40625 17.105469 C 58.445312 17.101562 58.488281 17.101562 58.527344 17.109375 C 58.566406 17.117188 58.605469 17.132812 58.636719 17.15625 C 58.671875 17.179688 58.699219 17.210938 58.722656 17.242188 C 58.746094 17.277344 58.761719 17.3125 58.765625 17.351562 C 58.773438 17.390625 58.773438 17.433594 58.765625 17.472656 C 58.753906 17.511719 58.738281 17.546875 58.714844 17.578125 L 56.894531 20.125 C 58.988281 19.640625 60.839844 18.160156 61.722656 16.242188 C 62.664062 14.203125 62.488281 11.695312 61.273438 9.804688 C 60.0625 7.914062 57.824219 6.664062 55.535156 6.601562 C 55.492188 6.597656 55.453125 6.589844 55.417969 6.574219 C 55.378906 6.558594 55.34375 6.53125 55.316406 6.503906 C 55.289062 6.476562 55.265625 6.441406 55.253906 6.402344 C 55.238281 6.367188 55.230469 6.328125 55.234375 6.289062 C 55.234375 6.246094 55.242188 6.207031 55.261719 6.171875 C 55.277344 6.136719 55.300781 6.101562 55.332031 6.074219 C 55.359375 6.046875 55.398438 6.027344 55.433594 6.011719 C 55.472656 5.996094 55.515625 5.992188 55.554688 5.992188 C 58.0625 6.066406 60.476562 7.410156 61.804688 9.480469 C 63.132812 11.550781 63.320312 14.253906 62.292969 16.488281 C 61.335938 18.5625 59.371094 20.152344 57.113281 20.699219 L 60.347656 21.136719 C 60.386719 21.144531 60.425781 21.15625 60.464844 21.175781 C 60.496094 21.199219 60.527344 21.222656 60.554688 21.253906 C 60.578125 21.289062 60.59375 21.324219 60.605469 21.363281 C 60.617188 21.402344 60.617188 21.441406 60.613281 21.480469 C 60.609375 21.515625 60.59375 21.546875 60.582031 21.578125 C 60.5625 21.609375 60.539062 21.640625 60.515625 21.664062 C 60.488281 21.6875 60.457031 21.703125 60.425781 21.71875 C 60.390625 21.734375 60.355469 21.738281 60.320312 21.742188 C 60.316406 21.742188 60.308594 21.742188 60.304688 21.742188 Z M 60.304688 21.742188 "
                        fillOpacity="1"
                        fillRule="nonzero"
                      />
                    </g>
                  </g>
                </g>
              </g>
              <g clipPath="url(#id5)">
                <path
                  fill="#000000"
                  d="M 28.378906 28.210938 C 21.988281 28.210938 15.597656 28.21875 9.203125 28.210938 C 6.726562 28.210938 4.570312 27.371094 2.871094 25.546875 C 0.265625 22.761719 0.402344 18.636719 3.171875 15.996094 C 4.640625 14.609375 6.398438 13.871094 8.394531 13.679688 C 8.742188 13.648438 9.09375 13.648438 9.441406 13.648438 C 22.125 13.648438 34.816406 13.648438 47.5 13.648438 C 49.632812 13.648438 51.546875 14.273438 53.191406 15.648438 C 54.589844 16.824219 55.46875 18.289062 55.695312 20.113281 C 55.957031 22.148438 55.335938 23.9375 53.980469 25.457031 C 52.597656 27.011719 50.824219 27.863281 48.761719 28.140625 C 48.277344 28.210938 47.804688 28.21875 47.320312 28.21875 C 41.007812 28.210938 34.695312 28.210938 28.378906 28.210938 Z M 28.402344 14.183594 C 22.023438 14.183594 15.628906 14.183594 9.25 14.183594 C 8.910156 14.183594 8.574219 14.195312 8.234375 14.230469 C 6.476562 14.441406 4.910156 15.113281 3.613281 16.332031 C 2.441406 17.4375 1.707031 18.78125 1.585938 20.402344 C 1.414062 22.617188 2.28125 24.417969 3.972656 25.828125 C 5.507812 27.101562 7.3125 27.660156 9.296875 27.660156 C 22.023438 27.660156 34.738281 27.660156 47.464844 27.660156 C 49.28125 27.660156 50.960938 27.191406 52.425781 26.117188 C 53.980469 24.976562 54.964844 23.488281 55.167969 21.554688 C 55.359375 19.730469 54.792969 18.132812 53.578125 16.777344 C 51.988281 15.023438 49.957031 14.207031 47.601562 14.195312 C 41.199219 14.171875 34.796875 14.183594 28.402344 14.183594 Z M 28.402344 14.183594 "
                  fillOpacity="1"
                  fillRule="evenodd"
                />
              </g>
              <path
                fill="#8daeff"
                d="M 28.402344 14.183594 C 34.804688 14.183594 41.199219 14.171875 47.601562 14.183594 C 49.957031 14.183594 51.988281 15.011719 53.578125 16.769531 C 54.804688 18.121094 55.367188 19.730469 55.167969 21.542969 C 54.964844 23.46875 53.972656 24.964844 52.425781 26.105469 C 50.960938 27.179688 49.28125 27.648438 47.464844 27.648438 C 34.738281 27.648438 22.023438 27.648438 9.296875 27.648438 C 7.3125 27.648438 5.507812 27.089844 3.972656 25.816406 C 2.28125 24.417969 1.414062 22.617188 1.585938 20.402344 C 1.707031 18.792969 2.441406 17.449219 3.613281 16.34375 C 4.910156 15.113281 6.476562 14.441406 8.246094 14.238281 C 8.585938 14.195312 8.921875 14.195312 9.261719 14.195312 C 15.628906 14.183594 22.023438 14.183594 28.402344 14.183594 Z M 28.402344 14.183594 "
                fillOpacity="1"
                fillRule="evenodd"
              />
              <g fill="#ffffff" fillOpacity="1">
                <g transform="translate(5.599689, 22.832653)">
                  <g>
                    <path d="M 2.4375 0.078125 C 2.007812 0.078125 1.632812 -0.015625 1.3125 -0.203125 C 0.988281 -0.398438 0.734375 -0.664062 0.546875 -1 C 0.367188 -1.332031 0.28125 -1.71875 0.28125 -2.15625 C 0.28125 -2.601562 0.367188 -2.992188 0.546875 -3.328125 C 0.734375 -3.660156 0.988281 -3.921875 1.3125 -4.109375 C 1.632812 -4.296875 2.007812 -4.390625 2.4375 -4.390625 C 2.875 -4.390625 3.253906 -4.296875 3.578125 -4.109375 C 3.898438 -3.921875 4.148438 -3.660156 4.328125 -3.328125 C 4.515625 -2.992188 4.609375 -2.601562 4.609375 -2.15625 C 4.609375 -1.71875 4.515625 -1.332031 4.328125 -1 C 4.148438 -0.664062 3.898438 -0.398438 3.578125 -0.203125 C 3.253906 -0.015625 2.875 0.078125 2.4375 0.078125 Z M 2.4375 -0.640625 C 2.851562 -0.640625 3.179688 -0.773438 3.421875 -1.046875 C 3.671875 -1.316406 3.796875 -1.6875 3.796875 -2.15625 C 3.796875 -2.632812 3.671875 -3.007812 3.421875 -3.28125 C 3.179688 -3.550781 2.851562 -3.6875 2.4375 -3.6875 C 2.03125 -3.6875 1.703125 -3.550781 1.453125 -3.28125 C 1.210938 -3.007812 1.09375 -2.632812 1.09375 -2.15625 C 1.09375 -1.6875 1.210938 -1.316406 1.453125 -1.046875 C 1.703125 -0.773438 2.03125 -0.640625 2.4375 -0.640625 Z M 2.4375 -0.640625" />
                  </g>
                </g>
              </g>
              <g fill="#ffffff" fillOpacity="1">
                <g transform="translate(10.728743, 22.832653)">
                  <g>
                    <path d="M 0.421875 0 L 0.421875 -4.328125 L 2.015625 -4.328125 C 2.359375 -4.328125 2.644531 -4.265625 2.875 -4.140625 C 3.101562 -4.023438 3.269531 -3.867188 3.375 -3.671875 C 3.488281 -3.472656 3.546875 -3.25 3.546875 -3 C 3.546875 -2.757812 3.492188 -2.535156 3.390625 -2.328125 C 3.285156 -2.128906 3.117188 -1.96875 2.890625 -1.84375 C 2.660156 -1.726562 2.367188 -1.671875 2.015625 -1.671875 L 1.203125 -1.671875 L 1.203125 0 Z M 1.203125 -2.3125 L 1.96875 -2.3125 C 2.238281 -2.3125 2.4375 -2.367188 2.5625 -2.484375 C 2.6875 -2.609375 2.75 -2.78125 2.75 -3 C 2.75 -3.207031 2.6875 -3.367188 2.5625 -3.484375 C 2.4375 -3.609375 2.238281 -3.671875 1.96875 -3.671875 L 1.203125 -3.671875 Z M 1.203125 -2.3125" />
                  </g>
                </g>
              </g>
              <g fill="#ffffff" fillOpacity="1">
                <g transform="translate(14.722124, 22.832653)">
                  <g>
                    <path d="M 0.421875 0 L 0.421875 -4.328125 L 3.234375 -4.328125 L 3.234375 -3.6875 L 1.203125 -3.6875 L 1.203125 -2.5 L 3.0625 -2.5 L 3.0625 -1.875 L 1.203125 -1.875 L 1.203125 -0.640625 L 3.234375 -0.640625 L 3.234375 0 Z M 0.421875 0" />
                  </g>
                </g>
              </g>
              <g fill="#ffffff" fillOpacity="1">
                <g transform="translate(18.536511, 22.832653)">
                  <g>
                    <path d="M 0.421875 0 L 0.421875 -4.328125 L 1.203125 -4.328125 L 3.234375 -1.28125 L 3.234375 -4.328125 L 4.03125 -4.328125 L 4.03125 0 L 3.234375 0 L 1.203125 -3.03125 L 1.203125 0 Z M 0.421875 0" />
                  </g>
                </g>
              </g>
              <g fill="#ffffff" fillOpacity="1">
                <g transform="translate(23.233511, 22.832653)">
                  <g />
                </g>
              </g>
              <g fill="#ffffff" fillOpacity="1">
                <g transform="translate(24.949365, 22.832653)">
                  <g>
                    <path d="M 1.890625 0.078125 C 1.578125 0.078125 1.296875 0.0234375 1.046875 -0.078125 C 0.804688 -0.191406 0.613281 -0.347656 0.46875 -0.546875 C 0.332031 -0.753906 0.265625 -1.003906 0.265625 -1.296875 L 1.09375 -1.296875 C 1.101562 -1.097656 1.175781 -0.929688 1.3125 -0.796875 C 1.457031 -0.660156 1.648438 -0.59375 1.890625 -0.59375 C 2.097656 -0.59375 2.265625 -0.640625 2.390625 -0.734375 C 2.515625 -0.835938 2.578125 -0.972656 2.578125 -1.140625 C 2.578125 -1.316406 2.519531 -1.453125 2.40625 -1.546875 C 2.300781 -1.648438 2.15625 -1.734375 1.96875 -1.796875 C 1.789062 -1.859375 1.597656 -1.925781 1.390625 -2 C 1.054688 -2.113281 0.800781 -2.257812 0.625 -2.4375 C 0.457031 -2.613281 0.375 -2.851562 0.375 -3.15625 C 0.363281 -3.414062 0.421875 -3.632812 0.546875 -3.8125 C 0.671875 -4 0.84375 -4.140625 1.0625 -4.234375 C 1.28125 -4.335938 1.535156 -4.390625 1.828125 -4.390625 C 2.109375 -4.390625 2.359375 -4.335938 2.578125 -4.234375 C 2.796875 -4.128906 2.96875 -3.984375 3.09375 -3.796875 C 3.226562 -3.617188 3.296875 -3.398438 3.296875 -3.140625 L 2.453125 -3.140625 C 2.453125 -3.296875 2.394531 -3.429688 2.28125 -3.546875 C 2.164062 -3.671875 2.007812 -3.734375 1.8125 -3.734375 C 1.632812 -3.734375 1.488281 -3.6875 1.375 -3.59375 C 1.257812 -3.507812 1.203125 -3.382812 1.203125 -3.21875 C 1.203125 -3.070312 1.242188 -2.957031 1.328125 -2.875 C 1.421875 -2.789062 1.546875 -2.71875 1.703125 -2.65625 C 1.859375 -2.601562 2.035156 -2.539062 2.234375 -2.46875 C 2.453125 -2.394531 2.648438 -2.304688 2.828125 -2.203125 C 3.003906 -2.109375 3.144531 -1.976562 3.25 -1.8125 C 3.351562 -1.65625 3.40625 -1.453125 3.40625 -1.203125 C 3.40625 -0.972656 3.347656 -0.757812 3.234375 -0.5625 C 3.117188 -0.375 2.945312 -0.21875 2.71875 -0.09375 C 2.5 0.0195312 2.222656 0.078125 1.890625 0.078125 Z M 1.890625 0.078125" />
                  </g>
                </g>
              </g>
              <g fill="#ffffff" fillOpacity="1">
                <g transform="translate(28.88102, 22.832653)">
                  <g>
                    <path d="M 2.4375 0.078125 C 2.007812 0.078125 1.632812 -0.015625 1.3125 -0.203125 C 0.988281 -0.398438 0.734375 -0.664062 0.546875 -1 C 0.367188 -1.332031 0.28125 -1.71875 0.28125 -2.15625 C 0.28125 -2.601562 0.367188 -2.992188 0.546875 -3.328125 C 0.734375 -3.660156 0.988281 -3.921875 1.3125 -4.109375 C 1.632812 -4.296875 2.007812 -4.390625 2.4375 -4.390625 C 2.875 -4.390625 3.253906 -4.296875 3.578125 -4.109375 C 3.898438 -3.921875 4.148438 -3.660156 4.328125 -3.328125 C 4.515625 -2.992188 4.609375 -2.601562 4.609375 -2.15625 C 4.609375 -1.71875 4.515625 -1.332031 4.328125 -1 C 4.148438 -0.664062 3.898438 -0.398438 3.578125 -0.203125 C 3.253906 -0.015625 2.875 0.078125 2.4375 0.078125 Z M 2.4375 -0.640625 C 2.851562 -0.640625 3.179688 -0.773438 3.421875 -1.046875 C 3.671875 -1.316406 3.796875 -1.6875 3.796875 -2.15625 C 3.796875 -2.632812 3.671875 -3.007812 3.421875 -3.28125 C 3.179688 -3.550781 2.851562 -3.6875 2.4375 -3.6875 C 2.03125 -3.6875 1.703125 -3.550781 1.453125 -3.28125 C 1.210938 -3.007812 1.09375 -2.632812 1.09375 -2.15625 C 1.09375 -1.6875 1.210938 -1.316406 1.453125 -1.046875 C 1.703125 -0.773438 2.03125 -0.640625 2.4375 -0.640625 Z M 2.4375 -0.640625" />
                  </g>
                </g>
              </g>
              <g fill="#ffffff" fillOpacity="1">
                <g transform="translate(34.010074, 22.832653)">
                  <g>
                    <path d="M 2.09375 0.078125 C 1.769531 0.078125 1.476562 0.015625 1.21875 -0.109375 C 0.96875 -0.234375 0.765625 -0.421875 0.609375 -0.671875 C 0.460938 -0.929688 0.390625 -1.257812 0.390625 -1.65625 L 0.390625 -4.328125 L 1.1875 -4.328125 L 1.1875 -1.640625 C 1.1875 -1.304688 1.265625 -1.054688 1.421875 -0.890625 C 1.585938 -0.722656 1.816406 -0.640625 2.109375 -0.640625 C 2.390625 -0.640625 2.613281 -0.722656 2.78125 -0.890625 C 2.945312 -1.054688 3.03125 -1.304688 3.03125 -1.640625 L 3.03125 -4.328125 L 3.8125 -4.328125 L 3.8125 -1.65625 C 3.8125 -1.257812 3.734375 -0.929688 3.578125 -0.671875 C 3.421875 -0.421875 3.210938 -0.234375 2.953125 -0.109375 C 2.691406 0.015625 2.40625 0.078125 2.09375 0.078125 Z M 2.09375 0.078125" />
                  </g>
                </g>
              </g>
              <g fill="#ffffff" fillOpacity="1">
                <g transform="translate(38.460191, 22.832653)">
                  <g>
                    <path d="M 0.421875 0 L 0.421875 -4.328125 L 2 -4.328125 C 2.351562 -4.328125 2.640625 -4.265625 2.859375 -4.140625 C 3.085938 -4.023438 3.253906 -3.867188 3.359375 -3.671875 C 3.472656 -3.472656 3.53125 -3.25 3.53125 -3 C 3.53125 -2.738281 3.457031 -2.5 3.3125 -2.28125 C 3.175781 -2.0625 2.960938 -1.90625 2.671875 -1.8125 L 3.578125 0 L 2.671875 0 L 1.859375 -1.703125 L 1.203125 -1.703125 L 1.203125 0 Z M 1.203125 -2.28125 L 1.953125 -2.28125 C 2.210938 -2.28125 2.40625 -2.34375 2.53125 -2.46875 C 2.65625 -2.601562 2.71875 -2.773438 2.71875 -2.984375 C 2.71875 -3.191406 2.65625 -3.351562 2.53125 -3.46875 C 2.414062 -3.59375 2.222656 -3.65625 1.953125 -3.65625 L 1.203125 -3.65625 Z M 1.203125 -2.28125" />
                  </g>
                </g>
              </g>
              <g fill="#ffffff" fillOpacity="1">
                <g transform="translate(42.552329, 22.832653)">
                  <g>
                    <path d="M 2.375 0.078125 C 1.9375 0.078125 1.5625 -0.015625 1.25 -0.203125 C 0.9375 -0.390625 0.695312 -0.648438 0.53125 -0.984375 C 0.363281 -1.328125 0.28125 -1.71875 0.28125 -2.15625 C 0.28125 -2.59375 0.363281 -2.976562 0.53125 -3.3125 C 0.695312 -3.65625 0.9375 -3.921875 1.25 -4.109375 C 1.5625 -4.296875 1.9375 -4.390625 2.375 -4.390625 C 2.894531 -4.390625 3.316406 -4.257812 3.640625 -4 C 3.972656 -3.75 4.179688 -3.390625 4.265625 -2.921875 L 3.40625 -2.921875 C 3.351562 -3.160156 3.238281 -3.34375 3.0625 -3.46875 C 2.882812 -3.601562 2.648438 -3.671875 2.359375 -3.671875 C 1.960938 -3.671875 1.648438 -3.535156 1.421875 -3.265625 C 1.203125 -2.992188 1.09375 -2.625 1.09375 -2.15625 C 1.09375 -1.675781 1.203125 -1.300781 1.421875 -1.03125 C 1.648438 -0.769531 1.960938 -0.640625 2.359375 -0.640625 C 2.648438 -0.640625 2.882812 -0.703125 3.0625 -0.828125 C 3.238281 -0.953125 3.351562 -1.125 3.40625 -1.34375 L 4.265625 -1.34375 C 4.179688 -0.894531 3.972656 -0.546875 3.640625 -0.296875 C 3.316406 -0.046875 2.894531 0.078125 2.375 0.078125 Z M 2.375 0.078125" />
                  </g>
                </g>
              </g>
              <g fill="#ffffff" fillOpacity="1">
                <g transform="translate(47.348085, 22.832653)">
                  <g>
                    <path d="M 0.421875 0 L 0.421875 -4.328125 L 3.234375 -4.328125 L 3.234375 -3.6875 L 1.203125 -3.6875 L 1.203125 -2.5 L 3.0625 -2.5 L 3.0625 -1.875 L 1.203125 -1.875 L 1.203125 -0.640625 L 3.234375 -0.640625 L 3.234375 0 Z M 0.421875 0" />
                  </g>
                </g>
              </g>
              <g fill="currentColor" fillOpacity="1">
                <g transform="translate(1.927914, 12.008409)">
                  <g>
                    <path d="M 1.375 -0.046875 C 1.207031 -0.0234375 1.097656 -0.0546875 1.046875 -0.140625 C 0.992188 -0.234375 0.96875 -0.375 0.96875 -0.5625 C 0.96875 -0.789062 0.972656 -1 0.984375 -1.1875 L 1 -2.515625 L 1.03125 -4.359375 C 1.09375 -6.578125 1.125 -8.304688 1.125 -9.546875 C 1.125 -9.929688 1.117188 -10.160156 1.109375 -10.234375 C 1.085938 -10.460938 1.078125 -10.597656 1.078125 -10.640625 C 1.078125 -10.910156 1.132812 -11.046875 1.25 -11.046875 C 1.300781 -11.046875 1.40625 -11.039062 1.5625 -11.03125 C 1.726562 -11.019531 1.960938 -11.015625 2.265625 -11.015625 C 2.347656 -11.015625 2.5625 -11.019531 2.90625 -11.03125 C 3.25 -11.039062 3.609375 -11.046875 3.984375 -11.046875 C 4.535156 -11.046875 5.0625 -11.03125 5.5625 -11 C 6.289062 -10.957031 6.890625 -10.660156 7.359375 -10.109375 C 7.835938 -9.566406 8.078125 -8.753906 8.078125 -7.671875 C 8.078125 -6.960938 7.925781 -6.394531 7.625 -5.96875 C 7.320312 -5.550781 6.972656 -5.257812 6.578125 -5.09375 C 6.179688 -4.9375 5.828125 -4.859375 5.515625 -4.859375 C 5.234375 -4.859375 4.757812 -4.828125 4.09375 -4.765625 C 3.707031 -4.722656 3.394531 -4.695312 3.15625 -4.6875 C 3.132812 -3.726562 3.125 -3.078125 3.125 -2.734375 C 3.125 -1.367188 3.140625 -0.628906 3.171875 -0.515625 C 3.191406 -0.410156 3.171875 -0.316406 3.109375 -0.234375 C 3.054688 -0.160156 2.984375 -0.109375 2.890625 -0.078125 C 2.804688 -0.0546875 2.726562 -0.0625 2.65625 -0.09375 C 2.625 -0.101562 2.535156 -0.109375 2.390625 -0.109375 C 2.066406 -0.109375 1.726562 -0.0859375 1.375 -0.046875 Z M 5.078125 -6 C 5.460938 -6 5.820312 -6.113281 6.15625 -6.34375 C 6.5 -6.570312 6.671875 -6.984375 6.671875 -7.578125 C 6.671875 -8.210938 6.535156 -8.691406 6.265625 -9.015625 C 6.003906 -9.347656 5.625 -9.5625 5.125 -9.65625 C 4.34375 -9.820312 3.726562 -9.890625 3.28125 -9.859375 C 3.28125 -9.554688 3.273438 -9.332031 3.265625 -9.1875 C 3.242188 -8.601562 3.21875 -8.1875 3.1875 -7.9375 C 3.144531 -7.570312 3.132812 -7.160156 3.15625 -6.703125 L 3.1875 -6.09375 L 3.921875 -6.046875 C 4.203125 -6.015625 4.585938 -6 5.078125 -6 Z M 5.078125 -6" />
                  </g>
                </g>
              </g>
              <g fill="currentColor" fillOpacity="1">
                <g transform="translate(10.712359, 12.008409)">
                  <g>
                    <path d="M 3.21875 0.046875 C 3.207031 0.046875 3.125 0.0351562 2.96875 0.015625 C 2.820312 -0.00390625 2.625 -0.015625 2.375 -0.015625 L 1.15625 0 C 1 0 0.921875 -0.0625 0.921875 -0.1875 C 0.921875 -0.226562 0.921875 -0.367188 0.921875 -0.609375 C 0.929688 -0.847656 0.9375 -1.257812 0.9375 -1.84375 C 0.9375 -2.445312 0.953125 -3.023438 0.984375 -3.578125 C 1.023438 -4.128906 1.046875 -4.4375 1.046875 -4.5 L 1.140625 -7.34375 L 1.15625 -8.953125 C 1.15625 -9.066406 1.179688 -9.128906 1.234375 -9.140625 C 1.285156 -9.140625 1.398438 -9.132812 1.578125 -9.125 C 1.753906 -9.113281 1.984375 -9.109375 2.265625 -9.109375 C 2.472656 -9.109375 2.675781 -9.113281 2.875 -9.125 C 3.082031 -9.132812 3.207031 -9.140625 3.25 -9.140625 C 3.28125 -9.140625 3.304688 -9.117188 3.328125 -9.078125 C 3.359375 -9.046875 3.375 -9.019531 3.375 -9 L 3.40625 -8.5625 C 3.757812 -8.789062 4.171875 -8.984375 4.640625 -9.140625 C 5.117188 -9.304688 5.484375 -9.390625 5.734375 -9.390625 C 5.796875 -9.390625 5.835938 -9.382812 5.859375 -9.375 C 5.890625 -9.363281 5.914062 -9.316406 5.9375 -9.234375 C 5.96875 -9.160156 5.992188 -9.097656 6.015625 -9.046875 C 6.117188 -8.785156 6.1875 -8.472656 6.21875 -8.109375 C 6.226562 -7.941406 6.253906 -7.75 6.296875 -7.53125 C 6.316406 -7.4375 6.328125 -7.320312 6.328125 -7.1875 C 6.328125 -7.101562 6.320312 -7.054688 6.3125 -7.046875 C 6.226562 -6.921875 6.097656 -6.832031 5.921875 -6.78125 C 5.753906 -6.738281 5.507812 -6.695312 5.1875 -6.65625 C 4.78125 -6.613281 4.429688 -6.550781 4.140625 -6.46875 L 3.453125 -6.3125 L 3.46875 -5.671875 C 3.46875 -5.328125 3.472656 -5.148438 3.484375 -5.140625 L 3.5 -3.8125 C 3.519531 -3.125 3.53125 -2.179688 3.53125 -0.984375 C 3.53125 -0.523438 3.507812 -0.21875 3.46875 -0.0625 C 3.46875 0.0078125 3.382812 0.046875 3.21875 0.046875 Z M 3.21875 0.046875" />
                  </g>
                </g>
              </g>
              <g fill="currentColor" fillOpacity="1">
                <g transform="translate(17.849812, 12.008409)">
                  <g>
                    <path d="M 4.078125 0.34375 C 2.703125 0.34375 1.78125 -0.1875 1.3125 -1.25 C 0.851562 -2.3125 0.625 -3.445312 0.625 -4.65625 C 0.625 -5.832031 0.800781 -6.769531 1.15625 -7.46875 C 1.507812 -8.175781 1.941406 -8.671875 2.453125 -8.953125 C 2.960938 -9.234375 3.472656 -9.375 3.984375 -9.375 C 4.941406 -9.375 5.664062 -9.117188 6.15625 -8.609375 C 6.65625 -8.109375 6.972656 -7.507812 7.109375 -6.8125 C 7.242188 -6.113281 7.3125 -5.332031 7.3125 -4.46875 C 7.3125 -3.769531 7.191406 -3.046875 6.953125 -2.296875 C 6.722656 -1.546875 6.363281 -0.914062 5.875 -0.40625 C 5.382812 0.09375 4.785156 0.34375 4.078125 0.34375 Z M 3.96875 -2.703125 C 4.3125 -2.703125 4.5625 -2.863281 4.71875 -3.1875 C 4.882812 -3.507812 4.96875 -3.898438 4.96875 -4.359375 C 4.96875 -4.953125 4.890625 -5.375 4.734375 -5.625 C 4.585938 -5.875 4.363281 -6 4.0625 -6 C 3.414062 -6 3.09375 -5.410156 3.09375 -4.234375 C 3.09375 -3.796875 3.148438 -3.429688 3.265625 -3.140625 C 3.378906 -2.847656 3.613281 -2.703125 3.96875 -2.703125 Z M 3.96875 -2.703125" />
                  </g>
                </g>
              </g>
              <g fill="currentColor" fillOpacity="1">
                <g transform="translate(26.414654, 12.008409)">
                  <g>
                    <path d="M 6.703125 -9.296875 C 6.691406 -9.191406 6.695312 -8.753906 6.71875 -7.984375 C 6.769531 -6.710938 6.796875 -5.660156 6.796875 -4.828125 L 6.796875 -3.875 C 6.773438 -2.519531 6.453125 -1.539062 5.828125 -0.9375 C 5.203125 -0.34375 4.453125 -0.046875 3.578125 -0.046875 C 2.910156 -0.046875 2.367188 -0.265625 1.953125 -0.703125 C 1.546875 -1.148438 1.257812 -1.648438 1.09375 -2.203125 C 1.019531 -2.441406 0.960938 -2.8125 0.921875 -3.3125 C 0.890625 -3.820312 0.875 -4.34375 0.875 -4.875 C 0.875 -5.46875 0.890625 -5.867188 0.921875 -6.078125 C 0.941406 -6.222656 0.953125 -6.707031 0.953125 -7.53125 C 0.953125 -8.84375 0.929688 -9.796875 0.890625 -10.390625 C 0.878906 -10.453125 0.875 -10.535156 0.875 -10.640625 C 0.875 -10.960938 0.972656 -11.082031 1.171875 -11 L 1.34375 -10.984375 C 1.382812 -10.984375 1.425781 -10.988281 1.46875 -11 C 1.519531 -11.007812 1.570312 -11.015625 1.625 -11.015625 C 1.664062 -11.015625 1.691406 -10.984375 1.703125 -10.921875 C 1.691406 -10.265625 1.679688 -9.320312 1.671875 -8.09375 C 1.660156 -6.863281 1.65625 -5.671875 1.65625 -4.515625 C 1.65625 -3.910156 1.734375 -3.367188 1.890625 -2.890625 C 2.046875 -2.410156 2.257812 -2.03125 2.53125 -1.75 C 2.800781 -1.476562 3.101562 -1.34375 3.4375 -1.34375 C 3.894531 -1.34375 4.222656 -1.476562 4.421875 -1.75 C 4.628906 -2.019531 4.734375 -2.300781 4.734375 -2.59375 L 4.765625 -3.546875 C 4.796875 -5.117188 4.8125 -5.988281 4.8125 -6.15625 C 4.8125 -6.394531 4.820312 -6.867188 4.84375 -7.578125 C 4.875 -8.171875 4.890625 -8.753906 4.890625 -9.328125 C 4.890625 -9.847656 4.867188 -10.210938 4.828125 -10.421875 C 4.796875 -10.546875 4.78125 -10.644531 4.78125 -10.71875 C 4.78125 -10.863281 4.8125 -10.953125 4.875 -10.984375 C 4.945312 -11.023438 5.015625 -11.039062 5.078125 -11.03125 C 5.148438 -11.03125 5.195312 -11.03125 5.21875 -11.03125 C 5.320312 -11.019531 5.4375 -11.015625 5.5625 -11.015625 C 5.695312 -11.023438 5.820312 -11.03125 5.9375 -11.03125 L 6.34375 -11.03125 C 6.507812 -11.03125 6.601562 -11.003906 6.625 -10.953125 C 6.65625 -10.910156 6.675781 -10.8125 6.6875 -10.65625 C 6.707031 -10.425781 6.71875 -10.140625 6.71875 -9.796875 C 6.71875 -9.566406 6.710938 -9.398438 6.703125 -9.296875 Z M 1.703125 -10.84375 L 1.703125 -10.921875 Z M 1.703125 -10.84375" />
                  </g>
                </g>
              </g>
              <g fill="currentColor" fillOpacity="1">
                <g transform="translate(34.697159, 12.008409)">
                  <g>
                    <path d="M 1.3125 0 C 1.15625 0 1.0625 -0.03125 1.03125 -0.09375 C 1.007812 -0.164062 1.003906 -0.3125 1.015625 -0.53125 C 1.015625 -0.875 1.007812 -1.203125 1 -1.515625 L 0.96875 -3.453125 C 0.96875 -3.742188 0.976562 -4.046875 1 -4.359375 C 1.019531 -4.679688 1.035156 -4.96875 1.046875 -5.21875 C 1.097656 -5.976562 1.125 -6.507812 1.125 -6.8125 L 1.15625 -9.75 L 1.140625 -10.609375 C 1.140625 -10.972656 1.164062 -11.179688 1.21875 -11.234375 C 1.25 -11.265625 1.285156 -11.28125 1.328125 -11.28125 C 1.347656 -11.28125 1.382812 -11.269531 1.4375 -11.25 C 1.488281 -11.238281 1.546875 -11.234375 1.609375 -11.234375 L 2.109375 -11.25 C 2.304688 -11.25 2.453125 -11.238281 2.546875 -11.21875 C 2.640625 -11.1875 2.707031 -11.109375 2.75 -10.984375 C 2.789062 -10.867188 2.828125 -10.734375 2.859375 -10.578125 C 2.890625 -10.429688 2.914062 -10.316406 2.9375 -10.234375 C 2.988281 -9.941406 3.109375 -9.546875 3.296875 -9.046875 C 3.492188 -8.546875 3.679688 -8.109375 3.859375 -7.734375 C 4.003906 -7.484375 4.195312 -7.078125 4.4375 -6.515625 C 4.6875 -5.953125 4.863281 -5.507812 4.96875 -5.1875 C 5.03125 -5.019531 5.117188 -4.8125 5.234375 -4.5625 L 5.46875 -4 L 5.796875 -3.265625 C 6.109375 -3.859375 6.332031 -4.289062 6.46875 -4.5625 L 7.484375 -6.609375 L 8.1875 -8.015625 C 8.550781 -8.765625 8.796875 -9.25 8.921875 -9.46875 C 9.117188 -9.882812 9.328125 -10.265625 9.546875 -10.609375 C 9.773438 -10.960938 9.9375 -11.140625 10.03125 -11.140625 C 10.113281 -11.140625 10.15625 -11.070312 10.15625 -10.9375 C 10.15625 -10.8125 10.128906 -10.644531 10.078125 -10.4375 L 10.015625 -10.046875 C 9.972656 -9.753906 9.953125 -8.5 9.953125 -6.28125 C 9.953125 -5.78125 9.9375 -5.179688 9.90625 -4.484375 C 9.882812 -3.785156 9.863281 -3.320312 9.84375 -3.09375 C 9.8125 -2.820312 9.796875 -2.414062 9.796875 -1.875 L 9.828125 -0.359375 L 9.828125 -0.28125 C 9.828125 -0.15625 9.789062 -0.101562 9.71875 -0.125 L 9.6875 -0.125 C 9.632812 -0.125 9.570312 -0.117188 9.5 -0.109375 C 9.4375 -0.0976562 9.367188 -0.09375 9.296875 -0.09375 C 9.253906 -0.101562 9.222656 -0.128906 9.203125 -0.171875 C 9.191406 -0.210938 9.1875 -0.285156 9.1875 -0.390625 L 9.1875 -1.3125 C 9.1875 -2.382812 9.195312 -3.015625 9.21875 -3.203125 C 9.238281 -3.421875 9.257812 -3.828125 9.28125 -4.421875 C 9.3125 -5.015625 9.328125 -5.492188 9.328125 -5.859375 C 9.316406 -5.960938 9.320312 -6.257812 9.34375 -6.75 L 9.390625 -8.4375 C 9.316406 -8.332031 9.253906 -8.222656 9.203125 -8.109375 C 9.097656 -7.929688 9 -7.738281 8.90625 -7.53125 L 8.75 -7.21875 C 8.570312 -6.875 8.367188 -6.46875 8.140625 -6 C 7.910156 -5.53125 7.710938 -5.132812 7.546875 -4.8125 C 7.359375 -4.4375 7.117188 -3.953125 6.828125 -3.359375 C 6.546875 -2.773438 6.328125 -2.304688 6.171875 -1.953125 C 5.890625 -1.316406 5.726562 -1 5.6875 -1 C 5.65625 -1 5.609375 -1.050781 5.546875 -1.15625 C 5.484375 -1.257812 5.441406 -1.328125 5.421875 -1.359375 C 5.347656 -1.472656 5.234375 -1.71875 5.078125 -2.09375 C 4.921875 -2.46875 4.796875 -2.796875 4.703125 -3.078125 C 4.640625 -3.265625 4.367188 -3.789062 3.890625 -4.65625 C 3.515625 -5.375 3.320312 -5.75 3.3125 -5.78125 C 3.207031 -6 3.066406 -6.351562 2.890625 -6.84375 C 2.773438 -7.101562 2.6875 -7.332031 2.625 -7.53125 L 2.59375 -6.84375 L 2.5625 -5.765625 L 2.53125 -2.6875 L 2.515625 -0.234375 C 2.515625 -0.140625 2.488281 -0.0820312 2.4375 -0.0625 C 2.382812 -0.0390625 2.320312 -0.03125 2.25 -0.03125 C 2.175781 -0.0390625 2.117188 -0.046875 2.078125 -0.046875 L 1.71875 -0.03125 C 1.53125 -0.0078125 1.394531 0 1.3125 0 Z M 1.3125 0" />
                  </g>
                </g>
              </g>
              <g fill="currentColor" fillOpacity="1">
                <g transform="translate(46.367763, 12.008409)">
                  <g>
                    <path d="M 1.40625 0.125 C 1.175781 0.125 1.0625 0.0195312 1.0625 -0.1875 L 1.0625 -1.40625 L 1.125 -6.671875 C 1.125 -7.066406 1.097656 -7.785156 1.046875 -8.828125 L 0.984375 -10.765625 C 0.984375 -10.941406 1.050781 -11.03125 1.1875 -11.03125 C 1.238281 -11.03125 1.328125 -11.015625 1.453125 -10.984375 C 1.578125 -10.953125 1.675781 -10.9375 1.75 -10.9375 C 2.050781 -10.894531 2.40625 -10.875 2.8125 -10.875 C 3.09375 -10.875 3.359375 -10.890625 3.609375 -10.921875 C 3.765625 -10.941406 3.875 -10.929688 3.9375 -10.890625 C 4 -10.847656 4.03125 -10.78125 4.03125 -10.6875 C 4.03125 -10.613281 4.019531 -10.535156 4 -10.453125 C 3.988281 -10.378906 3.984375 -10.296875 3.984375 -10.203125 L 3.953125 -9.34375 C 3.910156 -8.488281 3.890625 -7.847656 3.890625 -7.421875 L 3.921875 -5.046875 C 3.929688 -4.671875 3.9375 -4.285156 3.9375 -3.890625 L 3.90625 -2.1875 L 3.890625 -1.859375 L 3.90625 -1.421875 L 3.9375 -0.875 L 6.1875 -0.796875 L 8.046875 -0.78125 L 8.078125 -0.78125 C 8.140625 -0.78125 8.175781 -0.769531 8.1875 -0.75 C 8.195312 -0.726562 8.195312 -0.695312 8.1875 -0.65625 C 8.1875 -0.625 8.1875 -0.597656 8.1875 -0.578125 C 8.175781 -0.535156 8.175781 -0.457031 8.1875 -0.34375 C 8.207031 -0.226562 8.21875 -0.125 8.21875 -0.03125 C 8.21875 0.0390625 8.191406 0.0859375 8.140625 0.109375 C 8.085938 0.128906 8.019531 0.132812 7.9375 0.125 C 7.863281 0.125 7.804688 0.125 7.765625 0.125 L 6.9375 0.078125 C 6.195312 0.015625 5.675781 -0.015625 5.375 -0.015625 C 5.039062 -0.015625 4.195312 0.015625 2.84375 0.078125 Z M 1.40625 0.125" />
                  </g>
                </g>
              </g>
            </svg>
          </Link>
        </Box>
        <Box display="flex" alignItems="center" width="-webkit-fill-available">
          <Box display="flex" flexDirection="column">
            <Box display="flex" height={31}>
              {titleEditorSelected ? (
                <ClickAwayListener onClickAway={() => submitTitleEdit()}>
                  <input
                    ref={titleRef}
                    className="documentTitle"
                    value={title}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        submitTitleEdit();
                      }
                    }}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ height: 26, fontSize: 20 }}
                  />
                </ClickAwayListener>
              ) : (
                <Box height={26} onClick={() => setTitleEditorSelected(true)} fontSize={20}>
                  {title}
                </Box>
              )}
            </Box>
            <Box
              display="flex"
              sx={{
                "& div:not(:first-of-type)": {
                  marginLeft: 2,
                },
                "& div:not(:last-of-type)": {
                  fontSize: 14,
                },
              }}
            >
              <Box
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  if (!fileOpen) setFileOpen(true);
                }}
              >
                File
                {fileOpen && (
                  <FileMenu
                    graph={graph.current}
                    documentTitle={title}
                    hideMenu={() => setFileOpen(false)}
                    openShareDialog={() => {
                      setFileOpen(false);
                      setShareDialogOpen(true);
                    }}
                    rename={() => {
                      setFileOpen(false);
                      setTitleEditorSelected(true);
                    }}
                    deleteDocument={() => {
                      supabase
                        .from("document")
                        .delete()
                        .match({ id: documentId })
                        .then(() => navigate("/dashboard"));
                    }}
                    forceRender={forceRender}
                  />
                )}
              </Box>
              <Box
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  if (!editOpen) setEditOpen(true);
                }}
              >
                Edit
                {editOpen && <EditMenu graph={graph.current} documentTitle={title} hideMenu={() => setEditOpen(false)} forceRender={forceRender} />}
              </Box>
              <Box
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  if (!viewOpen) setViewOpen(true);
                }}
              >
                View{viewOpen && <ViewMenu graph={graph.current} hideMenu={() => setViewOpen(false)} forceRender={forceRender} />}
              </Box>
              <Box fontSize={13}>
                {/* <Box fontSize={13} style={{ textDecoration: "underline" }}> */}
                {lastEdit}
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            marginLeft="auto"
            marginRight={3}
            // sx={{
            //   "& div": {
            //     color: "orange",
            //   },
            // }}
          >
            <Button
              variant="contained"
              startIcon={false ? <LockIcon /> : <AddLinkIcon />}
              sx={{ marginRight: 2.5, paddingLeft: 2, paddingRight: 2, fontWeight: 500 }}
              onClick={() => setShareDialogOpen(true)}
            >
              Share
            </Button>
            {userMetadata !== null && (
              <>
                <Avatar
                  sx={{ bgcolor: brown[500], fontSize: "1rem", cursor: "pointer" }}
                  onClick={() => {
                    if (!avatarOpen) setAvatarOpen(true);
                  }}
                >
                  {userMetadata !== undefined && userMetadata.fullNameAbbreviated}
                </Avatar>
                {avatarOpen && <AvatarMenu graph={graph.current} hideMenu={() => setAvatarOpen(false)} forceRender={forceRender} />}
              </>
            )}
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" borderTop="1px solid black">
        <Box display="flex" width="calc(100% - 250px)" height={40}>
          {/* <div style={{ flex: "1 1 auto", display: "flex" }}>
            {editablesList.map((editable: any) => (
              <Editable
                editable={editable}
                content={editable.content}
                onChangeActive={setEditableActive}
                quillEditorContainer={quillEditorContainer}
                isActive={activeEditable === editable}
                key={editable.id}
              />
            ))}
          </div> */}

          <StyledToggleButtonGroup size="small" aria-label="zoom">
            <ToggleButton value="out" aria-label="out" title="Zoom out" onClick={() => graph.current?.zoom(-0.2)}>
              <ZoomOutIcon />
            </ToggleButton>
            <ToggleButton value="in" aria-label="in" title="Zoom in" onClick={() => graph.current?.zoom(0.2)}>
              <ZoomInIcon />
            </ToggleButton>
          </StyledToggleButtonGroup>

          <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

          <StyledToggleButtonGroup size="small" aria-label="history">
            <ToggleButton
              value="undo"
              aria-label="undo"
              title="Undo"
              disabled={!graph.current?.canUndo()}
              onClick={() => {
                if (!graph.current) {
                  return;
                }

                graph.current.undo();
              }}
            >
              <UndoIcon />
            </ToggleButton>
            <ToggleButton
              value="redo"
              aria-label="redo"
              title="Redo"
              disabled={!graph.current?.canRedo()}
              onClick={() => {
                if (!graph.current) {
                  return;
                }

                graph.current.redo();
              }}
            >
              <RedoIcon />
            </ToggleButton>
          </StyledToggleButtonGroup>

          <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

          <StyledToggleButtonGroup size="small" aria-label="placement">
            <ToggleButton
              value="front"
              aria-label="front"
              title="To front"
              onClick={() => {
                for (const cell of graph.current?.getSelectedCells() || []) {
                  cell.toFront();
                }
              }}
            >
              <FlipToFrontIcon />
            </ToggleButton>
            <ToggleButton
              value="back"
              aria-label="back"
              title="To back"
              onClick={() => {
                for (const cell of graph.current?.getSelectedCells() || []) {
                  cell.toBack();
                }
              }}
            >
              <FlipToBackIcon />
            </ToggleButton>
          </StyledToggleButtonGroup>

          <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

          <StyledToggleButtonGroup size="small" value={alignment} exclusive onChange={handleAlignment} aria-label="text alignment" disabled>
            <ToggleButton value="left" aria-label="left aligned" title="Left align" onMouseDown={(e) => e.preventDefault()}>
              <FormatAlignLeftIcon />
            </ToggleButton>
            <ToggleButton value="center" aria-label="centered" title="Center align">
              <FormatAlignCenterIcon />
            </ToggleButton>
            <ToggleButton value="right" aria-label="right aligned" title="Right align">
              <FormatAlignRightIcon />
            </ToggleButton>
            <ToggleButton value="justify" aria-label="justified" title="Justify">
              <FormatAlignJustifyIcon />
            </ToggleButton>
          </StyledToggleButtonGroup>

          <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

          <StyledToggleButtonGroup size="small" value={formats} onChange={handleFormat} aria-label="text formatting" disabled>
            <ToggleButton value="bold" aria-label="bold" title="Bold" className="ql-bold" onClick={(e) => {}}>
              <FormatBoldIcon />
            </ToggleButton>
            <ToggleButton value="italic" aria-label="italic" title="Italic">
              <FormatItalicIcon />
            </ToggleButton>
            <ToggleButton value="underlined" aria-label="underlined" title="Underline">
              <FormatUnderlinedIcon />
            </ToggleButton>
            <ToggleButton value="color" aria-label="color" title="Text color" selected={false}>
              <FormatColorTextIcon />
            </ToggleButton>
            <ToggleButton value="highlight" aria-label="highlight" title="Highlight color" selected={false}>
              <BrushIcon />
            </ToggleButton>
          </StyledToggleButtonGroup>

          <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

          <StyledToggleButtonGroup size="small" value={formats} onChange={handleFormat} aria-label="text formatting" disabled>
            <ToggleButton value="background" aria-label="background" title="Background color" selected={false}>
              <FormatColorFillIcon />
            </ToggleButton>
            <ToggleButton value="border" aria-label="border" title="Border color" selected={false}>
              <BorderColorIcon />
            </ToggleButton>
            <ToggleButton value="borderWidth" aria-label="borderWidth" title="Border width" selected={false}>
              <LineWeightIcon />
            </ToggleButton>
            <ToggleButton value="borderDash" aria-label="borderDash" title="Border dash" selected={false}>
              <LineStyleIcon />
            </ToggleButton>
          </StyledToggleButtonGroup>
        </Box>
        <Box width="calc(100% - 250px)" display="flex" borderTop="1px solid black">
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              zIndex: 1,
              top: 10,
              left: 10,
              backgroundColor: "background.paper",
              border: "1px solid black",
              borderRadius: 2.5,
              height: "fit-content",
              padding: "10px 2px",
              "& > div": {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
              "& > div:not(:first-of-type)": {
                marginTop: 1.5,
              },
            }}
          >
            <Box title="Hello">
              <FormatColorFillIcon />
            </Box>
            <Box title="Hello">
              <FormatColorFillIcon />
            </Box>
            <Box title="Hello">
              <FormatColorFillIcon />
            </Box>
          </Box>
          <Box tabIndex={-1} ref={refContainer} className="mainStage" />
        </Box>
        <Box
          position="absolute"
          right={0}
          width={250}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          borderLeft="1px solid black"
          height="calc(100vh - 89px)"
          sx={{ backgroundColor: "background.paper" }}
        >
          <Box
            className="inDepthEditor"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "10px",
              overflow: "hidden",
              "& > div": {
                width: "calc(100% - 15px)",
              },
            }}
          >
            {/* {selectedShape && JSON.stringify(selectedShape)} */}
            {Array.isArray(selectedCells) ? "This is a group" : selectedCells ? <SelectedCell cell={selectedCells} freshRender={freshRender} /> : <Box></Box>}
          </Box>
          <Box ref={refMinimapContainer} className="minimapStage" />
        </Box>
      </Box>
    </Box>
  );
}

function FileMenu({
  graph,
  documentTitle,
  hideMenu,
  openShareDialog,
  rename,
  deleteDocument,
  forceRender,
}: {
  graph: Graph | undefined;
  documentTitle: string | undefined;
  hideMenu: () => void;
  openShareDialog: () => void;
  rename: () => void;
  deleteDocument: () => void;
  forceRender: () => void;
}) {
  const { session: authSession } = useAuth();

  return (
    <ClickAwayListener
      onClickAway={() => {
        hideMenu();
      }}
    >
      <List
        sx={{
          marginTop: "7px",
          minWidth: 320,
          maxWidth: 360,
          padding: 0,
          bgcolor: "background.paper",
          position: "absolute",
          zIndex: 9999,
          border: "1px solid transparent",
          borderRadius: 1,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          boxShadow: "0 0 0 1px rgb(0 0 0 / 45%)",
          "& div:not(:first-of-type)": {
            marginLeft: "unset",
          },
          "& > div": {
            paddingTop: 0.5,
            paddingBottom: 0.5,
          },
          "& span": {
            fontSize: 14,
          },
          "& .MuiListItemIcon-root": {
            minWidth: 42,
          },
          "& .MuiListItemText-inset": {
            paddingLeft: 5.25,
          },
        }}
        component="nav"
      >
        <ListItemButton
          onClick={() => {
            hideMenu();

            if (!authSession || !authSession.user) {
              return;
            }

            supabase
              .from("document")
              .insert([{ title: "Untitled", owner: [authSession.user.id], editor: [authSession.user.id], viewer: [authSession.user.id] }])
              .then((response: any) => {
                if (!response || !Array.isArray(response.data) || !response.data[0]) {
                  throw new Error("Could not create new document.");
                }

                window.open(window.location.origin + "/document/" + response.data[0].id, "_blank");
              });
          }}
        >
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="New" />
        </ListItemButton>

        <ListItemButton
          onClick={() => {
            hideMenu();

            if (!graph || !authSession || !authSession.user) {
              return;
            }

            supabase
              .from("document")
              .insert([
                { title: "Untitled", owner: [authSession.user.id], editor: [authSession.user.id], viewer: [authSession.user.id], json: JSON.stringify(graph.toJSON()) },
              ])
              .then((response: any) => {
                if (!response || !Array.isArray(response.data) || !response.data[0]) {
                  throw new Error("Could not create new document.");
                }

                window.open(window.location.origin + "/document/" + response.data[0].id, "_blank");
              });
          }}
        >
          <ListItemIcon>
            <FileCopyIcon />
          </ListItemIcon>
          <ListItemText primary="Make a copy" />
        </ListItemButton>

        <ListItemButton disabled>
          <ListItemIcon>
            <UploadIcon />
          </ListItemIcon>
          <ListItemText primary="Import JSON" />
        </ListItemButton>

        <ListItemButton
          onClick={() => {
            if (!graph || !documentTitle) {
              return;
            }

            console.log("hello");

            const test = JSON.stringify(graph.toJSON());
            console.log("test", test);
            const blob = new Blob([test], { type: "application/json" });
            const href = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = href;
            link.download = documentTitle + ".json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          <ListItemIcon>
            <FileDownloadOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Download JSON" />
        </ListItemButton>

        <ListItemButton
          onClick={() => {
            if (!graph) {
              return;
            }

            const json = graph.toJSON();

            const files = [];
            for (let i = 0; i < json.cells.length; i++) {
              const cell = json.cells[i];
              if (!cell || cell.shape !== "class" || !cell.data || !Array.isArray(cell.data.name)) {
                continue;
              }

              let fileType = "class";
              let fileName = "Unnamed";
              if (cell.data.name.length > 1) {
                fileType = cell.data.name[0];
                fileType = fileType.slice(2, fileType.length - 2);
                fileName = cell.data.name[1];
              } else if (cell.data.name.length) {
                fileName = cell.data.name[0];
              }

              const variablesString =
                cell.data.variables
                  ?.map((variable: any) => {
                    const varSplit = variable.string.split(" ");

                    const accessModifier = varSplit[0] === "-" ? "private" : varSplit[0] === "#" ? "protected" : "public";
                    const isFinal = varSplit[varSplit.length - 1] === "{readOnly}";
                    const isStatic = variable.static;
                    const variableName = varSplit[1].slice(0, -1);
                    const type = varSplit[2];

                    let returnString = "\t" + accessModifier + " " + (isStatic ? "static " : "") + (isFinal ? "final " : "") + type + " " + variableName;

                    const hasDefaultValue = varSplit[3] === "=";
                    if (!hasDefaultValue) {
                      return returnString + ";";
                    }

                    const defaultValue = varSplit
                      .map((value: any, index: any) => {
                        if (index <= 3 || value === "{readOnly}") {
                          return undefined;
                        }

                        return value;
                      })
                      .filter((value: any) => value !== undefined)
                      .join(" ");
                    returnString += " = " + defaultValue;
                    return returnString + ";";
                  })
                  .join("\n") || "";

              const methodsString =
                cell.data.methods
                  ?.map((method: any) => {
                    const methodSplit = method.string.split(" ");

                    const accessModifier = methodSplit[0] === "-" ? "private" : methodSplit[0] === "#" ? "protected" : "public";
                    const isStatic = method.static;

                    const firstParenthesis = method.string.indexOf("(");
                    const methodName = method.string.slice(2, firstParenthesis);

                    const type = methodSplit[methodSplit.length - 1];

                    let returnString = "\t" + accessModifier + " " + (isStatic ? "static " : "") + methodName + "(";

                    // returnString += PARAMS

                    return returnString + "): " + type + ";";

                    // const defaultValue = varSplit
                    //   .map((value: any, index: any) => {
                    //     if (index <= 3 || value === "{readOnly}") {
                    //       return undefined;
                    //     }

                    //     return value;
                    //   })
                    //   .filter((value: any) => value !== undefined)
                    //   .join(" ");
                    // returnString += " = " + defaultValue;
                    // return returnString + ";";
                  })
                  .join("\n") || "";

              console.log("methodsString", methodsString);

              let text = "public " + fileType + " " + fileName + " {\n";
              text += variablesString;
              text += "\n\n";
              text += methodsString;
              text += "\n}";

              files.push({
                fileName: fileName,
                text: text,
              });
            }

            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              console.log("files", files);
              const element = document.createElement("a");
              element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(file.text));
              element.setAttribute("download", file.fileName + ".java");

              element.style.display = "none";
              document.body.appendChild(element);

              element.click();

              document.body.removeChild(element);
            }
          }}
        >
          <ListItemIcon>
            <FileDownloadOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Download Java template" />
        </ListItemButton>

        <Divider flexItem orientation="horizontal" sx={{ my: 1 }} />

        <ListItemButton onClick={() => openShareDialog()}>
          <ListItemIcon>
            <PersonAddAltIcon />
          </ListItemIcon>
          <ListItemText primary="Share" />
        </ListItemButton>

        <ListItemButton onClick={() => rename()}>
          <ListItemIcon>
            <DriveFileRenameOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="Rename" />
        </ListItemButton>

        <ListItemButton
          onClick={() => {
            deleteDocument();
          }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="Move to trash" />
        </ListItemButton>

        {/* <Divider flexItem orientation="horizontal" sx={{ my: 1 }} />

        <ListItemButton>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="Details" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Page setup" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <PrintIcon />
          </ListItemIcon>
          <ListItemText primary="Print" />
          <ListItemText secondaryTypographyProps={{ align: "right" }} secondary="Ctrl+P" />
        </ListItemButton> */}
      </List>
    </ClickAwayListener>
  );
}

function EditMenu({
  graph,
  documentTitle,
  hideMenu,
  forceRender,
}: {
  graph: Graph | undefined;
  documentTitle: string | undefined;
  hideMenu: () => void;
  forceRender: () => void;
}) {
  const { session: authSession } = useAuth();

  return (
    <ClickAwayListener
      onClickAway={() => {
        hideMenu();
      }}
    >
      <List
        sx={{
          marginTop: "7px",
          minWidth: 320,
          maxWidth: 360,
          padding: 0,
          bgcolor: "background.paper",
          position: "absolute",
          zIndex: 9999,
          border: "1px solid transparent",
          borderRadius: 1,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          boxShadow: "0 0 0 1px rgb(0 0 0 / 45%)",
          "& div:not(:first-of-type)": {
            marginLeft: "unset",
          },
          "& > div": {
            paddingTop: 0.5,
            paddingBottom: 0.5,
          },
          "& span": {
            fontSize: 14,
          },
          "& .MuiListItemIcon-root": {
            minWidth: 42,
          },
          "& .MuiListItemText-inset": {
            paddingLeft: 5.25,
          },
        }}
        component="nav"
      >
        <ListItemButton
          disabled={!graph?.canUndo()}
          onClick={() => {
            hideMenu();

            if (!graph) {
              return;
            }

            graph.undo();
          }}
        >
          <ListItemIcon>
            <UndoIcon />
          </ListItemIcon>
          <ListItemText primary="Undo" />
        </ListItemButton>

        <ListItemButton
          disabled={!graph?.canRedo()}
          onClick={() => {
            hideMenu();

            if (!graph || !authSession || !authSession.user) {
              return;
            }

            graph.redo();
          }}
        >
          <ListItemIcon>
            <RedoIcon />
          </ListItemIcon>
          <ListItemText primary="Redo" />
        </ListItemButton>

        <Divider flexItem orientation="horizontal" sx={{ my: 1 }} />

        <ListItemButton
          disabled
          onClick={() => {
            if (!graph || !documentTitle) {
              return;
            }
          }}
        >
          <ListItemIcon>
            <ContentCutIcon />
          </ListItemIcon>
          <ListItemText primary="Cut" />
        </ListItemButton>

        <ListItemButton disabled>
          <ListItemIcon>
            <ContentCopyIcon />
          </ListItemIcon>
          <ListItemText primary="Copy" />
        </ListItemButton>

        <ListItemButton disabled>
          <ListItemIcon>
            <ContentPasteIcon />
          </ListItemIcon>
          <ListItemText primary="Paste" />
        </ListItemButton>

        <ListItemButton disabled>
          <ListItemIcon>
            <ContentPasteGoIcon />
          </ListItemIcon>
          <ListItemText primary="Paste without formatting" />
        </ListItemButton>

        <Divider flexItem orientation="horizontal" sx={{ my: 1 }} />

        <ListItemButton disabled>
          <ListItemIcon>
            <SelectAllIcon />
          </ListItemIcon>
          <ListItemText primary="Select all" />
        </ListItemButton>

        <ListItemButton disabled>
          <ListItemIcon>
            <DeleteOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </ListItemButton>
      </List>
    </ClickAwayListener>
  );
}

function ViewMenu({ graph, hideMenu, forceRender }: { graph: Graph | undefined; hideMenu: () => void; forceRender: () => void }) {
  const { session: authSession } = useAuth();

  return (
    <ClickAwayListener
      onClickAway={() => {
        hideMenu();
      }}
    >
      <List
        sx={{
          marginTop: "7px",
          minWidth: 320,
          maxWidth: 360,
          padding: 0,
          bgcolor: "background.paper",
          position: "absolute",
          zIndex: 9999,
          border: "1px solid transparent",
          borderRadius: 1,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          boxShadow: "0 0 0 1px rgb(0 0 0 / 45%)",
          "& div:not(:first-of-type)": {
            marginLeft: "unset",
          },
          "& > div": {
            paddingTop: 0.5,
            paddingBottom: 0.5,
          },
          "& span": {
            fontSize: 14,
          },
          "& .MuiListItemIcon-root": {
            minWidth: 42,
          },
          "& .MuiListItemText-inset": {
            paddingLeft: 5.25,
          },
        }}
        component="nav"
      >
        <ListItemButton sx={{ cursor: "default" }}>
          <ListItemText primary="Options coming soon" />
        </ListItemButton>
      </List>
    </ClickAwayListener>
  );
}

function AvatarMenu({ graph, hideMenu, forceRender }: { graph: Graph | undefined; hideMenu: () => void; forceRender: () => void }) {
  const { session: authSession, signOut } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        hideMenu();
      }}
    >
      <List
        sx={{
          minWidth: 240,
          maxWidth: 260,
          padding: 0,
          bgcolor: "background.paper",
          // color: "#000",
          position: "fixed",
          top: 89,
          right: 1,
          zIndex: 9999,
          border: "1px solid transparent",
          borderRadius: 1,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          boxShadow: "0 0 0 1px rgb(0 0 0 / 45%)",
          "& div:not(:first-of-type)": {
            marginLeft: "unset",
          },
          "& > div": {
            paddingTop: 0.5,
            paddingBottom: 0.5,
          },
          "& span": {
            fontSize: 14,
          },
          "& .MuiListItemIcon-root": {
            minWidth: 42,
          },
          "& .MuiListItemText-inset": {
            paddingLeft: 5.25,
          },
        }}
        component="nav"
      >
        {/* <ListItemButton>
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="Single-line item" />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete" disableRipple>
              <ArrowRightIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItemButton> */}

        <ListItemButton
          onClick={() => {
            hideMenu();
            navigate("/dashboard");
          }}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          onClick={() => {
            hideMenu();

            if (!authSession || !authSession.user) {
              return;
            }

            signOut();
            navigate("/");
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </ClickAwayListener>
  );
}

function SelectedCell({ cell, freshRender }: { cell: Cell<Cell.Properties>; freshRender: any }) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [angle, setAngle] = useState(0);

  const [name, setName] = useState("");
  const [variables, setVariables] = useState([""]);
  const [methods, setMethods] = useState([""]);

  const refreshCell = useCallback(() => {
    const bbox = cell.getBBox();
    setX(bbox.x);
    setY(bbox.y);
    setWidth(bbox.width);
    setHeight(bbox.height);
    setAngle(cell.getProp("angle") || 0);

    const data = cell.getData();
    console.log("data", data);

    if (Array.isArray(data.name)) {
      setName(data.name[data.name.length - 1]);
    }
  }, [cell]);

  useEffect(() => {
    refreshCell();
  }, [cell]);

  useEffect(() => {
    if (freshRender) {
      refreshCell();
    }
  }, [freshRender]);

  return (
    <>
      <Box display="flex">
        <Box sx={{ alignSelf: "center", marginRight: 1 }}>Name</Box>
        <input
          style={{
            width: "inherit",
          }}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            const original = cell.getData().name;
            original[original.length - 1] = e.target.value;
            try {
              cell
                .setData({
                  name: original,
                })
                .trigger("change:data");
            } catch {}
          }}
        />
      </Box>
      <Box display="flex" marginTop={2}>
        <Box
          display="flex"
          sx={{
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              marginRight: 1,
            }}
          >
            W
          </Box>
          <input
            style={{
              width: 30,
            }}
            value={width}
            onChange={(event) => {
              const newValue = parseInt(event.target.value) || 0;
              setWidth(newValue);
              cell.setProp(
                {
                  size: {
                    width: newValue,
                  },
                },
                { deep: false, overwrite: true },
              );
            }}
          />
        </Box>
        <Box
          display="flex"
          sx={{
            alignItems: "center",
            marginLeft: 8,
          }}
        >
          <Box
            sx={{
              marginRight: 1,
            }}
          >
            H
          </Box>
          <input
            style={{
              width: 30,
            }}
            value={height}
            onChange={(event) => {
              const newValue = parseInt(event.target.value) || 0;
              setHeight(newValue);
              cell.setProp(
                {
                  size: {
                    height: newValue,
                  },
                },
                { deep: false, overwrite: true },
              );
            }}
          />
        </Box>
      </Box>
      <Box>
        <Box>Left:</Box>
        <input
          value={x}
          onChange={(event) => {
            const newValue = parseInt(event.target.value) || 0;
            setX(newValue);
            cell.setProp(
              {
                position: {
                  x: newValue,
                },
              },
              { deep: false, overwrite: true },
            );
          }}
        />
      </Box>
      <Box>
        <Box>Top:</Box>
        <input
          value={y}
          onChange={(event) => {
            const newValue = parseInt(event.target.value) || 0;
            setY(newValue);
            cell.setProp(
              {
                position: {
                  y: newValue,
                },
              },
              { deep: false, overwrite: true },
            );
          }}
        />
      </Box>
      <Box>
        <Box>Angle:</Box>
        <input
          value={angle}
          onChange={(event) => {
            const newValue = parseInt(event.target.value) || 0;
            setAngle(newValue);
            cell.setProp(
              {
                angle: newValue,
              },
              { deep: false, overwrite: true },
            );
          }}
        />
      </Box>
      <Box>Hello {JSON.stringify(cell)}</Box>
    </>
  );
}

export default GraphView;
