import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "common/Container";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArticleIcon from "@mui/icons-material/Article";
import Grid from "@mui/material/Grid";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuth } from "supabase/Auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "supabase/supabase";
import FactoryMethodTemplate from "design-pattern-templates/FactoryMethod.json";
import Parser from "JavaToJSON/javatojson";

function DocumentOptions({ hideMenu, openRenameDialog, removeDocument, openDocument, id }) {
  return (
    <ClickAwayListener onClickAway={() => hideMenu()}>
      <List
        sx={{
          left: "35%",
          marginTop: "7px",
          minWidth: 240,
          maxWidth: 260,
          paddingX: 0,
          paddingY: 1,
          bgcolor: "background.paper",
          // color: "#000",
          position: "absolute",
          zIndex: 9999,
          border: "1px solid transparent",
          borderRadius: 1,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          boxShadow: "0 5px 10px 1px rgb(0 0 0 / 50%)",
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
        <ListItemButton onClick={() => openRenameDialog()}>
          <ListItemIcon>
            <TextFieldsIcon />
          </ListItemIcon>
          <ListItemText primary="Rename" />
        </ListItemButton>

        <ListItemButton onClick={() => removeDocument()}>
          <ListItemIcon>
            <DeleteOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="Remove" />
        </ListItemButton>

        <ListItemButton onClick={() => openDocument()}>
          <ListItemIcon>
            <OpenInNewOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Open in new tab" />
        </ListItemButton>
      </List>
    </ClickAwayListener>
  );
}

const NewDocument = ({ type, icon, imageURL, openDocument }) => {
  const theme = useTheme();
  const { session } = useAuth();

  return (
    <Box>
      <Card
        sx={{
          maxWidth: 144,
        }}
      >
        <CardActionArea
          onClick={() => {
            if (type === "Import Java project") {
              const input = document.createElement("input");
              input.type = "file";
              input.multiple = true;
              input.click();

              input.onchange = async (e) => {
                const getFileDataPromise = [];
                for (let i = 0; i < input.files.length; i++) {
                  const file = input.files[i];
                  if (!file.name.endsWith(".java") || file.size > 500000) {
                    return undefined;
                  }

                  const nameWithoutJava = file.name.slice(0, file.name.length - 5);
                  console.log("nameWithoutJava", nameWithoutJava);

                  const reader = new FileReader();
                  reader.readAsText(file, "UTF-8");

                  // here we tell the reader what to do when it's done reading...
                  getFileDataPromise.push(
                    new Promise((resolve) => {
                      reader.onload = (readerEvent) => {
                        resolve({ name: nameWithoutJava, text: readerEvent.target.result });
                      };
                    }),
                  );
                }

                const files = await Promise.all(getFileDataPromise);
                const parser = new Parser(files);
                const parsedFiles = parser.parseFiles();
                const parsedForUML = parsedFiles.getParsedForUML();

                console.log("parsedFiles", parsedFiles);
                console.log("parsedForUML", parsedForUML);

                supabase
                  .from("document")
                  .insert([
                    { title: "Imported Project", owner: [session.user.id], editor: [session.user.id], viewer: [session.user.id], json: JSON.stringify(parsedForUML) },
                  ])
                  .then((response) => {
                    if (!response || !Array.isArray(response.data) || !response.data[0]) {
                      throw new Error("Could not create new document.");
                    }

                    openDocument(response.data[0].id, false);
                  });
              };

              return;
            }

            if (type === "Factory Method") {
              supabase
                .from("document")
                .insert([{ title: type, owner: [session.user.id], editor: [session.user.id], viewer: [session.user.id], json: JSON.stringify(FactoryMethodTemplate) }])
                .then((response) => {
                  if (!response || !Array.isArray(response.data) || !response.data[0]) {
                    throw new Error("Could not create new document.");
                  }

                  openDocument(response.data[0].id, false);
                });

              return;
            }

            supabase
              .from("document")
              .insert([{ title: "Untitled", owner: [session.user.id], editor: [session.user.id], viewer: [session.user.id] }])
              .then((response) => {
                if (!response || !Array.isArray(response.data) || !response.data[0]) {
                  throw new Error("Could not create new document.");
                }

                openDocument(response.data[0].id, false);
              });

            return;
          }}
          sx={{
            display: "flex",
            height: 187,
            "& .Mui-focusVisible, & .MuiCardActionArea-focusHighlight": {
              opacity: "0 !important",
            },
            ":hover:before": {
              content: '" "',
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main}`,
            },
          }}
        >
          {icon ? icon : <img src={imageURL} width={144} style={{ padding: "0 10px" }} />}
        </CardActionArea>
      </Card>
      <Typography variant="text" component="div" fontSize={14} fontWeight={500} marginTop={1.4} marginLeft={0.5}>
        {type}
      </Typography>
    </Box>
  );
};

function ExistingDocument({ title, lastEdited, id, renameDocument, openDocument, removeDocument }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [optionsMenuOpen, setOptionsMenuOpen] = React.useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState(title);

  useEffect(() => {
    if (optionsMenuOpen && renameDialogOpen) {
      setOptionsMenuOpen(false);
    }
  }, [optionsMenuOpen, renameDialogOpen]);

  const handleDocumentRename = () => {
    setRenameDialogOpen(false);
    renameDocument(id, renameValue);
  };

  return (
    <>
      <Dialog fullScreen={fullScreen} open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)} PaperProps={{ sx: { backgroundImage: "unset" } }}>
        <DialogTitle color="text.primary">Rename</DialogTitle>
        <DialogContent>
          <DialogContentText color="text.secondary">Please enter a new name for the item:</DialogContentText>
          <TextField
            autoFocus
            onFocus={(event) => {
              event.target.select();
            }}
            margin="dense"
            id="name"
            defaultValue={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleDocumentRename();
              }
            }}
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setRenameDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleDocumentRename}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Card
        sx={{
          width: 265,
        }}
      >
        <CardActionArea
          onClick={() => {
            openDocument(id, false);
          }}
          sx={{
            "& .Mui-focusVisible, & .MuiCardActionArea-focusHighlight": {
              opacity: "0 !important",
            },
            ":hover:before": {
              content: '" "',
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main}`,
            },
          }}
        >
          <CardContent>
            <Typography variant="text" component="div" fontSize={14} fontWeight={500} marginBottom={0.45}>
              {title}
            </Typography>
            <Box display="flex" alignItems="center">
              <ArticleIcon color="primary" />
              <Typography variant="body2" color="text.secondary" fontSize={12} letterSpacing={0.2} whiteSpace="nowrap" marginLeft={0.5}>
                {lastEdited}
              </Typography>
            </Box>
          </CardContent>
          <MoreVertIcon
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log("e", e);
              setOptionsMenuOpen(!optionsMenuOpen);
            }}
            sx={{
              position: "absolute",
              bottom: 10,
              right: 8,
              transition: "outline 0.25s, background 0.25s",
              outlineColor: "transparent",
              borderRadius: "100%",
              width: "1.5em",
              height: "1.5em",
              padding: 0.5,
              ":hover": {
                outlineWidth: 1,
                outlineStyle: "solid",
                outlineColor: "background.paper",
                backgroundColor: "background.paper",
              },
            }}
          />
        </CardActionArea>
      </Card>
      {optionsMenuOpen && (
        <DocumentOptions
          hideMenu={() => setOptionsMenuOpen(false)}
          openRenameDialog={() => setRenameDialogOpen(true)}
          openDocument={() => openDocument(id, true)}
          removeDocument={() => removeDocument(id)}
          id={id}
        />
      )}
    </>
  );
}

function Dashboard() {
  const { session: authSession } = useAuth();

  // console.log("authSession", authSession);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  const [existingDocuments, setExistingDocuments] = useState(undefined);

  useEffect(() => {
    if (!authSession) {
      setExistingDocuments(false);
    }

    supabase
      .from("document")
      .select("*")
      .order("last_modified_at", { ascending: false })
      .then((response) => {
        console.log("response", response);
        if (!response || !Array.isArray(response.data) || !response.data[0]) {
          setExistingDocuments(false);
          return;
        }

        setExistingDocuments(
          response.data.map((document) => {
            const lastModifiedTime = new Date(document.last_modified_at);
            const now = new Date(new Date().toUTCString());
            const secondsAgo = Math.abs(now.getTime() - lastModifiedTime.getTime()) / 1000;

            let lastEdited = undefined;
            if (secondsAgo < 10) {
              lastEdited = "Edited seconds ago";
            } else if (secondsAgo < 60) {
              lastEdited = "Edited less than a minute ago";
            } else if (secondsAgo < 3600) {
              const minutesAgo = Math.floor(secondsAgo / 60);
              lastEdited = `Edited ${minutesAgo} ${minutesAgo > 1 ? "minutes" : "minute"} ago`;
            } else if (secondsAgo < 7200) {
              const hoursAgo = Math.floor(secondsAgo / 3600);
              lastEdited = `Edited ${hoursAgo} ${hoursAgo > 1 ? "hours" : "hour"} ago`;
            } else {
              lastEdited = `Edited on ${lastModifiedTime.getMonth() + 1}/${lastModifiedTime.getDate()}/${lastModifiedTime.getFullYear()}`;
            }

            return {
              ...document,
              lastEdited,
            };
          }),
        );
      });
  }, [authSession]);

  // useEffect(() => {
  //   if (existingDocuments === undefined) {
  //     // Fetch users documents
  //     setExistingDocuments([
  //       {
  //         image: "https://via.placeholder.com/208x263",
  //         title: "Amer Yono Resume",
  //         lastOpened: "Opened 12:13 AM",
  //         id: "test-id1",
  //       },
  //       {
  //         image: "https://via.placeholder.com/208x263",
  //         title: "Amer Yono Resume",
  //         lastOpened: "Opened 12:13 AM",
  //         id: "test-id2",
  //       },
  //       {
  //         image: "https://via.placeholder.com/208x263",
  //         title: "Amer Yono Resume",
  //         lastOpened: "Opened 12:13 AM",
  //         id: "test-id3",
  //       },
  //       {
  //         image: "https://via.placeholder.com/208x263",
  //         title: "Amer Yono Resume",
  //         lastOpened: "Opened 12:13 AM",
  //         id: "test-id4",
  //       },
  //       {
  //         image: "https://via.placeholder.com/208x263",
  //         title: "Amer Yono Resume",
  //         lastOpened: "Opened 12:13 AM",
  //         id: "test-id5",
  //       },
  //       {
  //         image: "https://via.placeholder.com/208x263",
  //         title: "Amer Yono Resume",
  //         lastOpened: "Opened 12:13 AM",
  //         id: "test-id6",
  //       },
  //       {
  //         image: "https://via.placeholder.com/208x263",
  //         title: "Amer Yono Resume",
  //         lastOpened: "Opened 12:13 AM",
  //         id: "test-id7",
  //       },
  //       {
  //         image: "https://via.placeholder.com/208x263",
  //         title: "Amer Yono Resume",
  //         lastOpened: "Opened 12:13 AM",
  //         id: "test-id8",
  //       },
  //       {
  //         image: "https://via.placeholder.com/208x263",
  //         title: "Amer Yono Resume",
  //         lastOpened: "Opened 12:13 AM",
  //         id: "test-id9",
  //       },
  //       {
  //         image: "https://via.placeholder.com/208x263",
  //         title: "Amer Yono Resume",
  //         lastOpened: "Opened 12:13 AM",
  //         id: "test-id10",
  //       },
  //       {
  //         image: "https://via.placeholder.com/208x263",
  //         title: "Amer Yono Resume",
  //         lastOpened: "Opened 12:13 AM",
  //         id: "test-id11",
  //       },
  //       {
  //         image: "https://via.placeholder.com/208x263",
  //         title: "Amer Yono Resume",
  //         lastOpened: "Opened 12:13 AM",
  //         id: "test-id12",
  //       },
  //     ]);
  //   }
  // }, [existingDocuments]);

  // useEffect(() => {
  //   supabase.from("profile").on("*").subscribe(callback);
  // }, []);

  const renameDocument = (documentId, title) => {
    if (!documentId || !title || !Array.isArray(existingDocuments)) {
      return;
    }

    setExistingDocuments((current) => {
      if (!Array.isArray(current)) {
        return;
      }

      return current.map((document) => {
        if (document.id === documentId) {
          return { ...document, title };
        }

        return document;
      });
    });

    supabase
      .from("document")
      .update({ title })
      .match({ id: documentId })
      .then((response) => console.log(response));

    // Update document in database
  };

  const removeDocument = (documentId) => {
    if (!documentId || !Array.isArray(existingDocuments)) {
      return;
    }

    setExistingDocuments((current) => {
      if (!Array.isArray(current)) {
        return;
      }

      return current.filter((document) => {
        if (document.id === documentId) {
          return false;
        }

        return true;
      });
    });

    supabase
      .from("document")
      .delete()
      .match({ id: documentId })
      .then((response) => console.log("removed", response));

    // Delete document in database
  };

  const openDocument = (documentId, newTab) => {
    if (!documentId || typeof newTab !== "boolean") {
      return;
    }

    const pathname = "/document/" + documentId;
    if (newTab) {
      window.open(window.location.origin + pathname, "_blank");
    } else {
      // TODO: need to use useTransition
      navigate(pathname);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: theme.palette.alternate.main,
          // backgroundImage: `linear-gradient(120deg, ${theme.palette.background.paper} 0%, ${theme.palette.alternate.main} 100%)`,
        }}
      >
        <Box maxWidth={{ sm: 720, md: 1140 }} width={"100%"} margin={"0 auto"} paddingX={2} paddingTop={{ xs: 2, sm: 3, md: 4 }} paddingBottom={{ xs: 2, sm: 3, md: 4 }}>
          <Box display="flex" justifyContent="space-between" paddingBottom={2.5}>
            <Typography color="textPrimary">Start a new document</Typography>
            {false && (
              <Typography color="textSecondary" sx={{ cursor: "pointer" }}>
                Show all
              </Typography>
            )}
          </Box>
          <Box>
            <Grid container columnSpacing={2} rowSpacing={3}>
              <Grid item>
                <NewDocument
                  type="Import Java project"
                  icon={<DriveFolderUploadOutlinedIcon sx={{ width: 144, height: 187, padding: 5 }} />}
                  openDocument={openDocument}
                />
              </Grid>
              <Grid item>
                <NewDocument type="Start from scratch" icon={<AddSharpIcon sx={{ width: 144, height: 187, padding: 4 }} />} openDocument={openDocument} />
              </Grid>
              <Grid item>
                <NewDocument type="Factory Method" imageURL={"https://refactoring.guru/images/patterns/cards/factory-method-mini-3x.png"} openDocument={openDocument} />
              </Grid>
              <Grid item>
                <NewDocument type="Abstract Factory" imageURL={"https://refactoring.guru/images/patterns/cards/abstract-factory-mini.png"} openDocument={openDocument} />
              </Grid>
              <Grid item>
                <NewDocument
                  type="Builder"
                  imageURL={"https://refactoring.guru/images/patterns/cards/builder-mini.png?id=19b95fd05e6469679752c0554b116815"}
                  openDocument={openDocument}
                />
              </Grid>
              <Grid item>
                <NewDocument
                  type="Prototype"
                  imageURL={"https://refactoring.guru/images/patterns/cards/prototype-mini.png?id=bc3046bb39ff36574c08d49839fd1c8e"}
                  openDocument={openDocument}
                />
              </Grid>
              <Grid item>
                <NewDocument
                  type="Singleton"
                  imageURL={"https://refactoring.guru/images/patterns/cards/singleton-mini.png?id=914e1565dfdf15f240e766163bd303ec"}
                  openDocument={openDocument}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      {((Array.isArray(existingDocuments) && existingDocuments.length > 0) || existingDocuments === undefined) && (
        <Box maxWidth={{ sm: 720, md: 1140 }} width={"100%"} margin={"0 auto"} paddingX={2} paddingTop={{ xs: 2, sm: 3, md: 4 }} paddingBottom={{ xs: 3, sm: 4, md: 6 }}>
          {!Array.isArray(existingDocuments) ? (
            <Box>Loading</Box>
          ) : (
            <>
              <Box display="flex" justifyContent="space-between" paddingBottom={2.5}>
                <Typography color="textPrimary" fontWeight={500}>
                  Recent documents
                </Typography>
              </Box>
              <Grid container columnSpacing={2} rowSpacing={3}>
                {existingDocuments.map(({ title, lastEdited, id }) => {
                  return (
                    <Grid key={id} item position="relative">
                      <ExistingDocument
                        title={title}
                        lastEdited={lastEdited}
                        id={id}
                        renameDocument={renameDocument}
                        openDocument={openDocument}
                        removeDocument={removeDocument}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}
        </Box>
      )}

      <Box bgcolor={theme.palette.alternate.main}>
        <Container>
          <Box>
            <Box marginBottom={4}>
              <Typography
                variant="h4"
                align="center"
                color="textPrimary"
                sx={{
                  fontWeight: "medium",
                }}
              >
                Didn't find
                <br />
                what you are looking for?
              </Typography>
            </Box>
            <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent={"center"} alignItems={{ xs: "stretched", sm: "center" }}>
              <Box
                component={Button}
                variant="contained"
                color="primary"
                size="large"
                fullWidth={!isMd}
                startIcon={
                  <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                }
              >
                Download the guide
              </Box>
              <Box component={Button} variant="outlined" color="primary" size="large" fullWidth={!isMd} marginTop={{ xs: 1, sm: 0 }} marginLeft={{ sm: 2 }}>
                Send us an email
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;
