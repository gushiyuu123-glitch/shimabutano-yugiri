// src/App.jsx
import { useEffect, useState } from "react";

import Nav from "./components/Nav";
import Footer from "./components/Footer";

// PC（既存）
import Hero from "./sections/Hero";
import Course from "./sections/Course";
import Signature from "./sections/Signature";
import Space from "./sections/Space";
import Flow from "./sections/Flow";
import Reserve from "./sections/Reserve";
import Info from "./sections/Info";

// SP（新規：空）
import NavSp from "./components/NavSp";
import HeroSp from "./sections/HeroSp";
import CourseSp from "./sections/CourseSp";
import SignatureSp from "./sections/SignatureSp";
import SpaceSp from "./sections/SpaceSp";
import FlowSp from "./sections/FlowSp";
import ReserveSp from "./sections/ReserveSp";
import InfoSp from "./sections/InfoSp";
import FooterSp from "./components/FooterSp";

const BREAKPOINT_PX = 860;

const NAV_ITEMS_PC = [
  { id: "course", label: "コース" },
  { id: "signature", label: "出汁と豚" },
  { id: "space", label: "空間" },
  { id: "flow", label: "流れ" },
  { id: "reserve", label: "予約" },
  { id: "info", label: "店舗情報" },
];

const NAV_ITEMS_SP = [
  { id: "courseSp", label: "コース" },
  { id: "signatureSp", label: "出汁と豚" },
  { id: "spaceSp", label: "空間" },
  { id: "flowSp", label: "流れ" },
  { id: "reserveSp", label: "予約" },
  { id: "infoSp", label: "店舗情報" },
];

function getIsSp() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.(`(max-width: ${BREAKPOINT_PX}px)`)?.matches ?? false;
}

export default function App() {
  const [isSp, setIsSp] = useState(getIsSp);

  useEffect(() => {
    const mq = window.matchMedia?.(`(max-width: ${BREAKPOINT_PX}px)`);
    if (!mq) return;

    const onChange = () => setIsSp(!!mq.matches);
    onChange();

    mq.addEventListener?.("change", onChange);
    mq.addListener?.(onChange);

    return () => {
      mq.removeEventListener?.("change", onChange);
      mq.removeListener?.(onChange);
    };
  }, []);

  // ✅ DOM分離：片方だけ描画（id衝突ゼロ）
  if (isSp) {
    return (
      <div key="sp">
        <NavSp items={NAV_ITEMS_SP} heroId="heroSp" footerId="footerSp" offset={72} />

        <HeroSp id="heroSp" />
        <CourseSp id="courseSp" />
        <SignatureSp id="signatureSp" />
        <SpaceSp id="spaceSp" />
        <FlowSp id="flowSp" />
        <ReserveSp id="reserveSp" />
        <InfoSp id="infoSp" />

        <FooterSp id="footerSp" />
      </div>
    );
  }

  // PC：既存そのまま
  return (
    <div key="pc">
      <Nav items={NAV_ITEMS_PC} heroId="hero" footerId="footer" offset={84} />

      <Hero />
      <Course />
      <Signature />
      <Space />
      <Flow />
      <Reserve />
      <Info />
      <Footer />
    </div>
  );
}