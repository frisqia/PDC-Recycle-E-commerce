import Head from "next/head";
import Link from "next/link";

export default function FooterDash() {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </Head>
      <div className="pt-10">
      <div className="bg-custom-Gunmetal pt-10 py-50 text-custom-light-blue">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left px-10 font-bold">CUSTOMER SERVICE</th>
              <th className="text-left px-10 font-bold">EXPLORE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="align-top px-10">
                <div className="grid gap-5">
                  {[
                    "Help",
                    "Payment Method",
                    "Tracking Order Customer",
                    "Tracking Order Seller",
                    "Free Delivery",
                    "Contact Us",
                  ].map((item) => (
                    <Link
                      href="#"
                      key={item}
                      className="p-1 text-xs hover:text-white"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </td>
              <td className="align-top px-10">
                <div className="grid gap-5">
                  {[
                    "About Us",
                    "Career",
                    "Seller Policy",
                    "Buyer Policy",
                    "Blog",
                    "Seller Center",
                    "Flash Sale",
                    "Contact Media",
                  ].map((item) => (
                    <Link
                      href="#"
                      key={item}
                      className="p-1 text-xs hover:text-white"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-center pb-5">
          Copyright 2024 &nbsp; <i className="fa fa-copyright"></i> &nbsp; made from PDC Groups
        </div>
      </div>
      </div>
    </>
  );
}