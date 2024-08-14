import React from "react";
import Head from "next/head";

export default function CatalogDashboard() {
  return (
    <>
        <Head>
        <title>Recommendation Product</title>
        </Head>
    <div className="grid"> <h1 className="flex justify-center font-bold">RECOMENDATION PRODUCT</h1>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
          {[
            "PRODUCT 1",
            "PRODUCT 2",
            "PRODUCT 3",
            "PRODUCT 4",
            "PRODUCT 5",
            "PRODUCT 6",
          ].map((item, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-500 hover:scale-105">
              <img src="https://via.placeholder.com/300" alt={item} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-bold mb-2">{item}</h2>
                <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              </div>
            </div>
          ))}
        </div>
      </div></div>

     
    </>
  );
}
