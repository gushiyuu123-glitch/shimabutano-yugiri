// src/App.jsx
import Nav from "./components/Nav";
import Hero from "./sections/Hero";
import Course from "./sections/Course";
import Signature from "./sections/Signature";
import Space from "./sections/Space";
import Flow from "./sections/Flow";
import Reserve from "./sections/Reserve";
import Info from "./sections/Info";
import Footer from "./components/Footer";
const NAV_ITEMS = [
  { id: "course", label: "コース" },
  { id: "signature", label: "出汁と豚" },
  { id: "space", label: "空間" },
  { id: "flow", label: "流れ" },
  { id: "reserve", label: "予約" },
  { id: "info", label: "店舗情報" },
  
];

export default function App() {
  return (
    <>
      <Nav items={NAV_ITEMS} heroId="hero" footerId="footer" offset={84} />

      <Hero />
      <Course />
      <Signature />
      <Space />
      <Flow />

<Reserve />

      <Info />

      <Footer />
    </>
  );
}