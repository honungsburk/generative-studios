import { useState, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Loading from "./Pages/Loading";

// Lazy load routes to allow for code splitting.
const Home = lazy(() => import("./Pages/Home"));
const AlgoMarble = lazy(() => import("./Pages/AlgoMarble"));
function App() {
  const [count, setCount] = useState(0);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/algomarble" element={<AlgoMarble />} />
      </Routes>
    </Suspense>
  );
}

export default App;
