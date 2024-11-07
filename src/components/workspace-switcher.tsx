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
import { Button } from "./ui/button";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import { CheckIcon, ChevronsUpDown, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import CreateWorkspaceForm from "./forms/create-workspace-form";
import { useWorkspace } from "@/providers/workspace-provider";

export default function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);
  const router = useRouter();

  const { workspace } = useWorkspace();

  const workspaces = trpc.workspaces.getWorkspaces.useQuery();

  const handleChangeWorkspace = useCallback(
    async (slug: string) => {
      router.push(`/${slug}`);
    },
    [router]
  );

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
            {workspace.name}
            <ChevronsUpDown className="ml-2 -mr-1 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-0">
          <Command>
            <CommandInput placeholder="Search workspace..." />
            <CommandList>
              <CommandEmpty>No workspace found.</CommandEmpty>
              <CommandGroup>
                {workspaces.isPending ? (
                  <>
                    <Skeleton className="h-8" />
                    <Skeleton className="h-8" />
                    <Skeleton className="h-8" />
                  </>
                ) : workspaces.isError ? (
                  <p>{workspaces.error.message}</p>
                ) : (
                  workspaces.data.map((org) => (
                    <CommandItem
                      key={org.workspace.slug}
                      value={org.workspace.slug}
                      onSelect={async (currentValue) => {
                        handleChangeWorkspace(currentValue);
                        setOpen(false);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          workspace.slug === org.workspace.slug
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {org.workspace.name}
                    </CommandItem>
                  ))
                )}
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
                  <PlusIcon className="w-4 h-4" />
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
