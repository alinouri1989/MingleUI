import AppRoutes from "./routes/AppRoutes";
import DataLoader from "./components/DataLoader.jsx";
import { Toaster } from "react-hot-toast";
import { SignalRProvider } from "./contexts/SignalRContext"; // SignalRProvider'ı ekledik

function App() {
  return (
    <>
        <DataLoader>
          <Toaster position="top-center" />
          <AppRoutes />
        </DataLoader>
    </>
  );
}

export default App;
