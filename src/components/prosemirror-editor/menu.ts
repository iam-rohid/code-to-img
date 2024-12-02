/* eslint-disable @typescript-eslint/no-explicit-any */
import { toggleMark } from "prosemirror-commands";
import { MenuElement, MenuItem, MenuItemSpec } from "prosemirror-menu";
import { MarkType, NodeType, Schema } from "prosemirror-model";
import { wrapInList } from "prosemirror-schema-list";
import { Command, EditorState } from "prosemirror-state";

const underlineIcon = document.createElement("span");
underlineIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-underline"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/></svg>`;
const boldIcon = document.createElement("span");
boldIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bold"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></svg>`;
const italicIcon = document.createElement("span");
italicIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-italic"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>`;
const codeIcon = document.createElement("span");
codeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
const bulletListIcon = document.createElement("span");
bulletListIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/></svg>`;
const orderedListIcon = document.createElement("span");
orderedListIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-ordered"><path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="M4 10h2"/><path d="M4 6h1v4"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>`;

function cmdItem(cmd: Command, options: Partial<MenuItemSpec>) {
  const passedOptions: MenuItemSpec = {
    label: options.title as string | undefined,
    run: cmd,
  };
  for (const prop in options)
    (passedOptions as any)[prop] = (options as any)[prop];
  if (!options.enable && !options.select)
    passedOptions[options.enable ? "enable" : "select"] = (state) => cmd(state);

  return new MenuItem(passedOptions);
}

function markActive(state: EditorState, type: MarkType) {
  const { from, $from, to, empty } = state.selection;
  if (empty) return !!type.isInSet(state.storedMarks || $from.marks());
  else return state.doc.rangeHasMark(from, to, type);
}

function markItem(markType: MarkType, options: Partial<MenuItemSpec>) {
  const passedOptions: Partial<MenuItemSpec> = {
    active(state) {
      return markActive(state, markType);
    },
  };
  for (const prop in options)
    (passedOptions as any)[prop] = (options as any)[prop];
  return cmdItem(toggleMark(markType), passedOptions);
}

function wrapListItem(nodeType: NodeType, options: Partial<MenuItemSpec>) {
  return cmdItem(wrapInList(nodeType, (options as any).attrs), options);
}

type MenuItemResult = {
  toggleStrong?: MenuItem;

  toggleEm?: MenuItem;

  toggleUnderline?: MenuItem;

  toggleLink?: MenuItem;

  wrapBulletList?: MenuItem;

  wrapOrderedList?: MenuItem;

  inlineMenu: MenuElement[][];

  fullMenu: MenuElement[][];
};

/// Given a schema, look for default mark and node types in it and
/// return an object with relevant menu items relating to those marks.
export function buildMenuItems(schema: Schema): MenuItemResult {
  const r: MenuItemResult = {} as any;
  let mark: MarkType | undefined;
  if ((mark = schema.marks.strong))
    r.toggleStrong = markItem(mark, {
      title: "Toggle strong style",
      icon: { dom: boldIcon },
    });
  if ((mark = schema.marks.em))
    r.toggleEm = markItem(mark, {
      title: "Toggle emphasis",
      icon: { dom: italicIcon },
    });
  if ((mark = schema.marks.u))
    r.toggleUnderline = markItem(mark, {
      title: "Toggle underline",
      icon: { dom: underlineIcon },
    });

  let node: NodeType | undefined;
  if ((node = schema.nodes.bullet_list))
    r.wrapBulletList = wrapListItem(node, {
      title: "Wrap in bullet list",
      icon: { dom: bulletListIcon },
    });
  if ((node = schema.nodes.ordered_list))
    r.wrapOrderedList = wrapListItem(node, {
      title: "Wrap in ordered list",
      icon: { dom: orderedListIcon },
    });

  r.inlineMenu = [
    cut([r.toggleStrong, r.toggleEm, r.toggleUnderline, r.toggleLink]),
    cut([r.wrapBulletList, r.wrapOrderedList]),
  ];
  r.fullMenu = r.inlineMenu;

  return r;
}

const cut = <T = any>(arr: T[]) => arr.filter((x) => x) as NonNullable<T>[];
