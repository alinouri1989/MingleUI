import AppRoutes from "./routes/AppRoutes";
import DataLoader from "./components/DataLoader.jsx";
import { Toaster } from "react-hot-toast";
import { SignalRProvider } from "./contexts/SignalRContext"; // SignalRProvider'ı ekledik
import { ModalProvider } from "./contexts/ModalContext.jsx";

function App() {
  return (
    <>
        <DataLoader>
          <ModalProvider>
            <Toaster position="top-center" />
            <AppRoutes />
          </ModalProvider>
        </DataLoader>
    </>
  );
}

export default App;
