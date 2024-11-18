import { useCallback, useMemo, useState } from "react";
import { CheckIcon, ChevronsUpDown, PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";

import CreateWorkspaceForm from "./forms/create-workspace-form";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Skeleton } from "./ui/skeleton";

export default function WorkspaceSwitcher() {
  const { workspaceSlug } = useParams<{ workspaceSlug?: string }>();

  const [open, setOpen] = useState(false);
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);
  const router = useRouter();

  const workspacesQuery = trpc.workspaces.getWorkspaces.useQuery();
  const currentWorkspace = useMemo(
    () =>
      workspacesQuery.data?.find(
        (workspace) => workspace.workspace.slug === workspaceSlug,
      ),
    [workspaceSlug, workspacesQuery.data],
  );

  const handleChangeWorkspace = useCallback(
    async (slug: string) => {
      router.push(`/${slug}`);
    },
    [router],
  );

  if (workspacesQuery.isPending) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (workspacesQuery.isError) {
    return <p>{workspacesQuery.error.message}</p>;
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {currentWorkspace?.workspace.name ?? "Select workspace"}
            <ChevronsUpDown className="-mr-1 ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-0">
          <Command>
            <CommandInput placeholder="Search workspace..." />
            <CommandList>
              <CommandEmpty>No workspace found.</CommandEmpty>
              <CommandGroup>
                {workspacesQuery.data.map(({ workspace }) => (
                  <CommandItem
                    key={workspace.slug}
                    value={workspace.slug}
                    onSelect={async (currentValue) => {
                      handleChangeWorkspace(currentValue);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        workspace.slug === workspaceSlug
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {workspace.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  value="create-new-workspace"
                  className="whitespace-nowrap"
                  onSelect={() => {
                    setOpen(false);
                    setCreateWorkspaceOpen(true);
                  }}
                >
                  <PlusIcon className="h-4 w-4" />
                  Create new workspace
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={createWorkspaceOpen} onOpenChange={setCreateWorkspaceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new Workspace</DialogTitle>
          </DialogHeader>
          <CreateWorkspaceForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
