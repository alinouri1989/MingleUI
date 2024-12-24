import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ModalProvider } from './contexts/ModalContext.jsx';
import { SignalRProvider } from './contexts/SignalRContext'; // SignalRProvider'ı buraya ekliyoruz
import store from './store/index.js';
import App from './App.jsx';
import "./shared/styles/main.scss";

createRoot(document.getElementById('root')).render(

    <SignalRProvider>
        <BrowserRouter>
            <Provider store={store}>
                <ModalProvider>
                    <App />
                </ModalProvider>
            </Provider>
        </BrowserRouter>
    </SignalRProvider>
);
