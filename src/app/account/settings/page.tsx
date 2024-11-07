import AppBar from "@/components/app-bar";

export default function Page() {
  return (
    <>
      <AppBar
        links={[{ title: "Account", url: "/account/settings" }]}
        title="General"
      />
    </>
  );
}
