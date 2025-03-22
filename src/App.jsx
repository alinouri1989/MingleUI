import AppRoutes from "./routes/AppRoutes";
import DataLoader from "./components/DataLoader.jsx";
import { Toaster } from "react-hot-toast";
import { ModalProvider } from "./contexts/ModalContext.jsx";

function App() {
  return (
    <DataLoader>
      {/* Tam ekran yüksekliği için div */}
      <div style={{ height: "calc(var(--vh, 1vh) * 100)" }}>
        <ModalProvider>
          <Toaster position="top-center" />
          <AppRoutes />
        </ModalProvider>
      </div>
    </DataLoader>
  );
}

export default App;