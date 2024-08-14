export default function SosialMedia() {
  return (
    <>
      <div className="bg-white p-10 text-white ">
        <div className="grid justify-center text-center bg-custom-steel-blue p-10 rounded-lg  ">
          <h1 className="text-4xl">Our Social Media</h1>
          <p>
            Join us and follow to get latest products, offers and innovative
            ideas on Made From Recycled
          </p>
          <div className=" grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-6 p-5">
            <a
              href="#"
              className="fa fa-facebook p-7 text-white border border-white border-4 rounded-full transition-transform duration-500 hover:scale-105"
            ></a>
            <a
              href="#"
              className="fa fa-twitter p-7 text-white border border-white border-4 rounded-full transition-transform duration-500 hover:scale-105"
            ></a>
            <a
              href="#"
              className="fa fa-google p-7 text-white border border-white border-4 rounded-full transition-transform duration-500 hover:scale-105"
            ></a>
            <a
              href="#"
              className="fa fa-linkedin p-7 text-white border border-white border-4 rounded-full transition-transform duration-500 hover:scale-105"
            ></a>
            <a
              href="#"
              className="fa fa-youtube p-7 text-white border border-white border-4 rounded-full transition-transform duration-500 hover:scale-105"
            ></a>
            <a
              href="#"
              className="fa fa-instagram p-7 text-white border border-white border-4 rounded-full transition-transform duration-500 hover:scale-105"
            ></a>
          </div>
        </div>
      </div>
    </>
  );
}
