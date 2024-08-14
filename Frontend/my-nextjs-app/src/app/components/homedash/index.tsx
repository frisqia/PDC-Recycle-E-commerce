import Head from "next/head";
import CatalogDashboard from "./content";

export default function HomeDashboard() {
  return (
    <>
      <Head>
        <title>Dashboard Page</title>
      </Head>
      <div className="min-h-screen bg-custom-pastel-green relative  pt-[15vh]">
        <div className="flex justify-center m-10 py-10 text-custom-Olive-Drab">
          {/* <div className="bg-custom-background">
          </div> */}
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
            similique iure repellat id labore natus vel beatae sit magnam
            molestias
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="bg-custom-green text-justify m-10 p-10 text-white flex-1">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto
            magni aliquid quam quod odio eligendi esse fugit totam sit impedit
            tenetur deserunt, laboriosam, aut nostrum. Architecto molestiae aut
            quisquam sequi!
          </div>
          <div className="bg-custom-green text-justify m-10 p-10 text-white flex-1">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto
            magni aliquid quam quod odio eligendi esse fugit totam sit impedit
            tenetur deserunt, laboriosam, aut nostrum. Architecto molestiae aut
            quisquam sequi!
          </div>
        </div>
        <div className="flex justify-center m-10 text-custom-Olive-Drab">
          <CatalogDashboard />
        </div>
      </div>
    </>
  );
}
