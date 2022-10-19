import { useCallback, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { supabase } from "supabase/supabase";

import { Box, ClickAwayListener } from "@mui/material";

export default function ({ state }: { state: [string, React.Dispatch<React.SetStateAction<string>>] }) {
  const { documentId } = useParams();

  const [title, setTitle] = state;
  const [titleEditorSelected, setTitleEditorSelected] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const submitTitleEdit = useCallback(() => {
    if (!documentId) {
      return;
    }

    setTitleEditorSelected(false);
    supabase
      .from("document")
      .update({ title })
      .match({ id: documentId })
      .then((response) => console.log("response", response));
  }, [documentId, title]);

  useEffect(() => {
    if (titleEditorSelected) {
      ref.current?.select();
    }
  }, [titleEditorSelected]);

  return (
    <Box display="flex" alignItems="center" width="-webkit-fill-available">
      <Box display="flex" flexDirection="column">
        <Box display="flex" height={31}>
          {titleEditorSelected ? (
            <ClickAwayListener onClickAway={() => submitTitleEdit()}>
              <input
                ref={ref}
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
      </Box>
    </Box>
  );
}
