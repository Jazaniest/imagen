import { useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import WantedPosterPage from "./pages/WantedPosterPage";
import PetHumanPage from "./pages/PetHumanPage";
import FoodAutopsyPage from "./pages/FoodAutopsyPage";
import AlbumCoverPage from "./pages/AlbumCoverPage";
import CursedDioramaPage from "./pages/CursedDioramaPage";

const PAGES = {
  home: HomePage,
  wanted: WantedPosterPage,
  pethuman: PetHumanPage,
  foodautopsy: FoodAutopsyPage,
  albumcover: AlbumCoverPage,
  diorama: CursedDioramaPage,
};

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const PageComponent = PAGES[currentPage] || HomePage;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-body">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>
        <PageComponent onNavigate={setCurrentPage} />
      </main>
    </div>
  );
}