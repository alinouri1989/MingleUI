import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes'
import { Toaster } from 'react-hot-toast';
import IncomingCall from "./components/Calls/Components/IncomingCall/IncomingCall.jsx";
import ScreenShare from './components/ScreenShare.jsx';
function App() {
  return (
    <>
      {/* DataLoader and Some First Render Component will be implemented */}
      {/* <IncomingCall/> */}
      <Toaster position="top-center" />
      <AppRoutes />
      {/* <ScreenShare/> */}
    </>
  )
}

export default App
