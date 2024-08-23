import Head from "next/head";
import CatalogDashboard from "./content";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Dashboard Page</title>
      </Head>
      <div className="font-bold min-h-screen bg-custom-pastel-green relative pt-[15vh]">
        <div className="flex justify-center m-10 py-10 text-custom-Olive-Drab">
          <p className="[text-shadow:_0_1px_0_rgb(0_1_0_/_40%)]">
            If it’s re-used, repurposed, refurbished, recycled or upcycled then
            you’ll find it on Made From Recycled.
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="bg-custom-backround-satu text-justify m-10 p-10 text-white [text-shadow:_0_1px_0_rgb(0_1_0_/_40%)] flex-1 rounded-lg">
            There are brilliant entrepreneurs have taken recycling to a whole
            new level by turning our waste into beautiful, well designed
            products. And that what we have here, come, browse and see if you
            fancy what we have in store for you.
          </div>
          <div className="bg-custom-backround-dua text-justify m-10 p-10 text-white [text-shadow:_0_1px_0_rgb(0_1_0_/_40%)] flex-1 rounded-lg">
            Made it out of something could have gone to a landfill. You will
            find our Made From Recycled creative, innovative and most of all
            useful again.
          </div>
        </div>
        <div className="flex items-center justify-center">
        <div className="flex items-center justify-center m-10  w-[50vw]">
          <CatalogDashboard />
        </div>
        </div>
        
      </div>
    </>
  );
}