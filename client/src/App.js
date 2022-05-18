import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MultisigWallet, Error } from "./pages";
import { MenuAppBar } from "./components";
import { useIsMounted } from "./hooks";

function App() {
  const isMounted = useIsMounted();
  if (!isMounted) return null;
  return (
    <>
      <MenuAppBar />
      <BrowserRouter>
        <Routes>
          <Route index element={<MultisigWallet />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
