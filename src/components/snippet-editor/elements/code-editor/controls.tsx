function MacOSControl() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-[#FF5F57]" />
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-[#FEBC2E]" />
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-[#28C840]" />
    </div>
  );
}
function MacOSMutedControl() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-gray-500/50" />
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-gray-500/50" />
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-gray-500/50" />
    </div>
  );
}
function MacOSOutlinedControl() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-[#FF5F57]" />
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-[#FEBC2E]" />
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-[#28C840]" />
    </div>
  );
}
function MacOSOutlinedMutedControl() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full border border-gray-500/50" />
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full border border-gray-500/50" />
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full border border-gray-500/50" />
    </div>
  );
}
function WindowsControl() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-3.5 w-3.5">
        <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-gray-500/50"></div>
      </div>
      <div className="relative h-3.5 w-3.5 border-2 border-gray-500/50" />
      <div className="relative h-3.5 w-3.5">
        <div className="absolute left-1/2 top-1/2 h-[2px] w-[calc(100%+6px)] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gray-500/50"></div>
        <div className="absolute left-1/2 top-1/2 h-[2px] w-[calc(100%+6px)] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-gray-500/50"></div>
      </div>
    </div>
  );
}

export const TITLE_BAR_CONTROLS = [
  {
    id: "macos-default",
    Control: MacOSControl,
  },
  {
    id: "macos-muted",
    Control: MacOSMutedControl,
  },
  {
    id: "macos-outlined",
    Control: MacOSOutlinedControl,
  },
  {
    id: "macos-outlined-muted",
    Control: MacOSOutlinedMutedControl,
  },
  {
    id: "windows",
    Control: WindowsControl,
  },
  {
    id: "no-control",
    Control: null,
  },
];
