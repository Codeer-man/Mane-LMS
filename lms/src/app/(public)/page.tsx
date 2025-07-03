import { Badge } from "@/components/ui/badge";

export default async function Home() {
  return (
    <div className="min-h-[80vh] relative h-[80vh] w-full border-b overflow-hidden px-4 sm:px-5 ">
      <Badge className=" absolute top-20">
        <h1 className="text-lg">The Future of online learning</h1>
      </Badge>
      <div className="flex  items-center justify-between h-full pb-7 px-4 sm:px-8 lg:items-end">
        <div className="text-start w-full lg:w-[30vw] pb-6 lg:pb-10 pt-6 lg:pt-10 hidden lg:block">
          <p className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-relaxed sm:leading-8 tracking-tight">
            Learn at your own pace with interactive courses, expert guidance,
            and tools to track every step of your progress.
          </p>
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-[18vh] font-bold text-center lg:text-end tracking-tighter  sm:leading-32 w-full lg:w-[40vw]">
          Unlock New Potential
        </h1>
      </div>
    </div>
  );
}
