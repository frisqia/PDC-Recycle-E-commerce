import Head from "next/head";
import SosialMedia from "./sosialmedia";
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
      <div className="bg-white">
        <SosialMedia />
        <div className="flex flex-col md:flex-row justify-between bg-custom-Gunmetal text-custom-light-blue p-10">
          <div className="flex">
            <div className="grid">
              <h1 className="px-10 font-bold">CUSTOMER SERVICE</h1>
              <div className="p-10 grid gap-5">
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
            </div>
            <div className="grid">
              <h1 className="px-10 font-bold">EXPLORE</h1>
              <div className="p-10 grid gap-5">
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
            </div>
          </div>

          <div className="mt-10 md:mt-0 md:w-1/2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63461.990190771015!2d106.78437720128385!3d-6.214256805978925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f41c03eaadeb%3A0x13f90424139e1edf!2sStasiun%20Sudirman!5e0!3m2!1sid!2sid!4v1722360928722!5m2!1sid!2sid"
              className="w-full h-64 md:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
