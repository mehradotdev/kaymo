"use client";

import HomePage from "~/components/HomePage";
import Navbar from "~/components/Navbar";
import BottomNav from "~/components/BottomNav";

export default function Index() {
  return (
    <>
      <Navbar />
      <HomePage />
      <BottomNav />
    </>
  );
}
