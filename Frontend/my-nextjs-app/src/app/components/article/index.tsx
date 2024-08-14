export default function ArticleDash() {
  return (
    <>
      <h1 className="flex items-center justify-center font-bold text-custom-green p-10">
        Article & Tips
      </h1>
      <div className="bg-white min-h-screen px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {/* Article 1 */}
          <div className="text-custom-steel-blue p-10 bg-custom-Gunmetal rounded-lg transition-transform duration-500 hover:scale-105">
            <p className="font-bold">Article satu</p>
            <br />
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Recusandae consectetur laudantium officiis asperiores consequuntur
              quae eius debitis voluptates ipsam, reiciendis sint consequatur
              maiores exercitationem non! Error molestias possimus reprehenderit
              libero.
            </p>
            <br />
            <button className="border border-custom-steel-blue p-2 rounded hover:scale-105">
              Read More
            </button>
          </div>

          {/* Article 2 */}
          <div className="text-custom-steel-blue p-10 bg-custom-Gunmetal rounded-lg transition-transform duration-500 hover:scale-105">
            <p className="font-bold">Article dua</p>
            <br />
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Doloremque, voluptatum quis. Cupiditate delectus voluptatem
              distinctio quia quam debitis veniam minima reprehenderit molestiae
              ut, provident quaerat eaque quod praesentium sapiente qui?
            </p>
            <br />
            <button className="border border-custom-steel-blue p-2 rounded hover:scale-105">
              Read More
            </button>
          </div>

          {/* Article 3 */}
          <div className="text-custom-steel-blue p-10 bg-custom-Gunmetal rounded-lg transition-transform duration-500 hover:scale-105">
            <p className="font-bold">Article tiga</p>
            <br />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis,
              sint eveniet, delectus modi beatae ducimus ex exercitationem, ut
              distinctio dolorem porro molestiae animi saepe nihil. Fugit maxime
              facere voluptatum ex.
            </p>
            <br />
            <button className="border border-custom-steel-blue p-2 rounded hover:scale-105">
              Read More
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
