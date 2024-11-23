import Image from "next/image";

export default function FullScreenLoader() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Image
        src="/code-to-img.svg"
        alt="codetoimg logo"
        width={128}
        height={128}
        className="h-20 w-20"
      />
    </div>
  );
}
