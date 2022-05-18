import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  //Landing, MyToken,
  MultisigWallet,
  Error,
} from "./pages";
import { MenuAppBar } from "./components";

function App() {
  return (
    <>
      <MenuAppBar />
      <BrowserRouter>
        <Routes>
          {/* <Route index element={<Landing />} /> */}
          {/* <Route index element={<MyToken />} /> */}
          <Route index element={<MultisigWallet />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
