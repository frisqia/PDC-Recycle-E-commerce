import SosialMedia from "./sosialmedia";

export default function ArticleDash() {
  return (
    <>
      <h1 className="flex items-center justify-center font-bold text-custom-green p-10">
        Article & Tips
      </h1>
      <div className="bg-white px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {/* Article 1 */}
          <div className="text-custom-steel-blue p-10 bg-custom-Gunmetal rounded-lg transition-transform duration-500 hover:scale-105">
            <p className="font-bold">
              Pentingnya Daur Ulang dalam Mengurangi Sampah Plastik
            </p>
            <br />
            <p>
              Daur ulang plastik adalah langkah kecil yang dapat kita lakukan
              untuk menjaga lingkungan. Dengan mengurangi, menggunakan kembali,
              dan mendaur ulang plastik, kita dapat berkontribusi dalam
              mengurangi sampah plastik dan menjaga bumi kita tetap bersih dan
              sehat.
            </p>
            <br />
            <button className="border border-custom-steel-blue p-2 rounded hover:scale-105">
              Read More
            </button>
          </div>

          {/* Article 2 */}
          <div className="text-custom-steel-blue p-10 bg-custom-Gunmetal rounded-lg transition-transform duration-500 hover:scale-105">
            <p className="font-bold">
              Kreativitas dalam Daur Ulang: Mengubah Sampah Menjadi Produk
              Berguna
            </p>
            <br />
            <p>
              Daur ulang bukan hanya tentang mengolah sampah menjadi bahan
              mentah, tetapi juga tentang bagaimana kita bisa memanfaatkan
              kembali barang-barang bekas dengan ide-ide kreatif. Dengan
              kreativitas, kita bisa mengubah sampah menjadi produk berguna yang
              memiliki nilai tambah dan membantu menjaga lingkungan.
            </p>
            <br />
            <button className="border border-custom-steel-blue p-2 rounded hover:scale-105">
              Read More
            </button>
          </div>

          {/* Article 3 */}
          <div className="text-custom-steel-blue p-10 bg-custom-Gunmetal rounded-lg transition-transform duration-500 hover:scale-105">
            <p className="font-bold">
              Daur Ulang Elektronik: Solusi untuk Limbah Elektronik yang
              Berkelanjutan
            </p>
            <br />
            <p>
              Daur ulang elektronik adalah langkah penting untuk mengatasi
              masalah limbah elektronik yang semakin meningkat. Dengan mendaur
              ulang barang-barang elektronik, kita bisa mencegah pencemaran,
              menghemat sumber daya alam, dan mengurangi jumlah sampah. Mari
              kita mulai mendaur ulang elektronik untuk lingkungan yang lebih
              bersih dan berkelanjutan.
            </p>
            <br />
            <button className="border border-custom-steel-blue p-2 rounded hover:scale-105">
              Read More
            </button>
          </div>
        </div>
        <div className="bg-white py-10 text-custom-steel-blue">
          <div className="bg-custom-light-blue py-10">
            <h2 className="p-10 text-center text-4xl">CREATE YOUR OWN SHOP</h2>
            <div className="flex flex-col items-center justify-center">
              <p className="text-center px-10 md:px-40 lg:px-80">
                It’s as easy as 1,2,3 to open your own shop on Made From
                Recycled and start selling your products. It’s FREE to list,
                you’ll get your own bespoke shop page with loads of
                functionality, receive instant payments for your sales and pay
                one of the lowest fees on the market.
              </p>
              <button className="mt-5 bg-custom-Gunmetal p-5 border items-center rounded-lg hover:bg-custom-Gunmetal/80 hover:scale-105">
                OPEN YOUR SHOP NOW
              </button>
            </div>
          </div>
        </div>
        <SosialMedia />
      </div>
    </>
  );
}
