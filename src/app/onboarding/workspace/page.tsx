import CreateWorkspaceForm from "@/components/forms/create-workspace-form";

export default function Page() {
  return (
    <div className="mx-auto max-w-md px-4 container my-16">
      <div className="mb-8">
        <h1 className="font-semibold text-2xl text-center">Create Workspace</h1>
      </div>
      <CreateWorkspaceForm />
    </div>
  );
}
