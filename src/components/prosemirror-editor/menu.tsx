import { ReactNode, useCallback, useMemo } from "react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ListIcon,
  ListOrderedIcon,
} from "lucide-react";
import { toggleMark } from "prosemirror-commands";
import { MarkType, Node } from "prosemirror-model";
import { wrapInList } from "prosemirror-schema-list";
import { Command, EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

import { schema } from "./schema";

function markActive(state: EditorState, type: MarkType) {
  const { from, $from, to, empty } = state.selection;
  if (empty) return !!type.isInSet(state.storedMarks || $from.marks());
  else return state.doc.rangeHasMark(from, to, type);
}

const setTextAlign =
  (align: string) =>
  (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { schema, selection } = state;
    const { from, to } = selection;
    const tr = state.tr;

    state.doc.nodesBetween(from, to, (node, pos) => {
      const { paragraph, list_item } = schema.nodes;
      if (node.type === paragraph || node.type === list_item) {
        tr.setNodeMarkup(pos, node.type, {
          ...node.attrs,
          textAlign: align,
        });
      }
    });

    if (tr.docChanged && dispatch) {
      dispatch(tr);
      return true;
    }
    return false;
  };

export const getTextAlign = (state: EditorState): string | null => {
  const { from, to } = state.selection;
  const { doc } = state;

  let textAlign: string | null = null;

  // Check all nodes in the selection
  doc.nodesBetween(from, to, (node: Node) => {
    if (node.attrs && node.attrs.textAlign) {
      textAlign = node.attrs.textAlign;
    }
  });

  return textAlign;
};

export default function CustomMenu({
  editorState,
  editorView,
}: {
  editorState?: EditorState;
  editorView?: EditorView;
}) {
  const rect = useMemo(
    () => editorView?.dom.getBoundingClientRect(),
    [editorView?.dom],
  );
  const applyCommand = useCallback(
    (command: Command) => {
      if (!editorState || !editorView) {
        return;
      }
      command(editorState, editorView.dispatch);
    },
    [editorState, editorView],
  );

  if (!editorState || !editorView) {
    return null;
  }

  return createPortal(
    <div
      className="fixed z-50 flex h-10 -translate-x-1/2 items-center gap-px rounded-lg border bg-card p-1 shadow-md"
      style={{
        left: rect ? rect.x + rect.width / 2 : 0,
        top: (rect?.y ?? 0) - 56,
      }}
    >
      <MenuItem
        icon={"B"}
        className="bold"
        onClick={() => applyCommand(toggleMark(schema.marks.strong))}
        label="Bold"
        isActive={markActive(editorState, schema.marks.strong)}
      />
      <MenuItem
        icon={"I"}
        className="italic"
        onClick={() => applyCommand(toggleMark(schema.marks.em))}
        isActive={markActive(editorState, schema.marks.em)}
        label="Italic"
      />
      <MenuItem
        icon={"U"}
        className="underline"
        onClick={() => applyCommand(toggleMark(schema.marks.u))}
        isActive={markActive(editorState, schema.marks.u)}
        label="Underline"
      />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <MenuItem
        icon={<ListIcon />}
        onClick={() => applyCommand(wrapInList(schema.nodes.bullet_list))}
        label="Wrap in bullet list"
      />
      <MenuItem
        icon={<ListOrderedIcon />}
        onClick={() => applyCommand(wrapInList(schema.nodes.ordered_list))}
        label="Wrap in ordered list"
      />
      <Separator orientation="vertical" className="mx-1" />
      <MenuItem
        icon={<AlignLeftIcon />}
        label="Align left"
        onClick={() => applyCommand(setTextAlign("left"))}
        isActive={getTextAlign(editorState) === "left"}
      />
      <MenuItem
        icon={<AlignCenterIcon />}
        label="Align center"
        onClick={() => applyCommand(setTextAlign("center"))}
        isActive={getTextAlign(editorState) === "center"}
      />
      <MenuItem
        icon={<AlignRightIcon />}
        label="Align right"
        onClick={() => applyCommand(setTextAlign("right"))}
        isActive={getTextAlign(editorState) === "right"}
      />
    </div>,
    document.body,
  );
}

function MenuItem({
  icon,
  label,
  className,
  onClick,
  isActive,
}: {
  icon: ReactNode;
  className?: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClick?.();
          }}
          className={cn(
            "h-7 w-7 font-serif text-muted-foreground",
            {
              "bg-secondary text-secondary-foreground": isActive,
            },
            className,
          )}
        >
          {icon}
          <div className="sr-only">{label}</div>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
