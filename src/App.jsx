import AppRoutes from "./routes/AppRoutes";
import DataLoader from "./components/DataLoader.jsx";
import { Toaster } from "react-hot-toast";


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
