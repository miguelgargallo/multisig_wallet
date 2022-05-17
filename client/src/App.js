import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Landing, MyToken, MultisigWallet, Error } from "./pages";
import { MenuAppBar } from "./components";
import { useState, useEffect } from "react";

function App() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  return (
    <>
      <MenuAppBar />
      {isMounted && (
        <BrowserRouter>
          <Routes>
            {/* <Route index element={<Landing />} /> */}
            {/* <Route index element={<MyToken />} /> */}
            <Route index element={<MultisigWallet />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
