import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import { ConfigProvider, Spin } from 'antd';
import store from '../store/index.js';
import { Provider } from 'react-redux';
import GlobalLoader from './loader.jsx';
import { DownloadNotificationProvider } from '../src/provider/downloadProvider.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Poppins",
            colorPrimary: "#214CBC",
          },
          components: {
            Progress: {
              circleTextFontSize: "15px"
            },
            Slider: {
              handleSize:24,
              handleSizeHover:24,
              handleColor	:"#214CBC",
              handleColorDisabled	:"#214CBC",
            },
          },
        }}
      >
        <DownloadNotificationProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </DownloadNotificationProvider>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)
