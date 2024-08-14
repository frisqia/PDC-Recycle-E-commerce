import NavbarPage from "./components/navbar";
import HomeDashboard from "./components/homedash";
import FooterDash from "./components/footer";
import ArticleDash from "./components/article";

export default function Home() {
  return (
    <div>
      <NavbarPage />
      <div className="pt-20">
        <HomeDashboard />
        <ArticleDash />
        <FooterDash />
      </div>
    </div>
  );
}
