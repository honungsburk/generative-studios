import { useState, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Loading from "./Pages/Loading";

// Lazy load routes to allow for code splitting.
const Home = lazy(() => import("./Pages/Home"));
const AlgoMarble = lazy(() => import("./Pages/AlgoMarble"));
const StainedGlass = lazy(() => import("./Pages/StainedGlass"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="/algomarble" element={<AlgoMarble />} />
        <Route path="/stained-glass" element={<StainedGlass />} />
      </Routes>
    </Suspense>
  );
}

export default App;
