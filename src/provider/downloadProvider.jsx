import { message, notification, Progress } from 'antd';
import { createContext, useContext } from 'react';
import { useState } from 'react';
import Style from './providersStyle.module.css'
import { baseUrl } from '../../store/config.json'

const DownloadNotificationContext = createContext();

export const DownloadNotificationProvider = ({ children }) => {
    const [fileLoader, setFileLoader] = useState(false);
    const [api, contextHolderNotification] = notification.useNotification();
    const [messageApi, contextHolderMessage] = message.useMessage();
    const NOTIF_KEY = 'download-progress';

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const updateNotificationProgress = (percent, { filename, fileSize, timeLeft }) => {
        api.open({
            key: NOTIF_KEY,
            message: `Downloading 1 item`,
            description: (
                <>
                    <div className={Style.DownloadNotTime}>{timeLeft}</div>
                    <div className={Style.DownloadData}>
                        <div style={{ width: "80%" }}>
                            <p>{filename}</p>
                            <span>{fileSize}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20%' }}>
                            <Progress type="circle" percent={percent} size={30} />
                        </div>
                    </div>
                </>
            ),
            placement: 'bottomRight',
            duration: 100000,
        });
    };

    const downloadWorkOrderFile = async (Url, method, format = 'pdf') => {
        setFileLoader(true);
        updateNotificationProgress(0, {
            filename: "Loading...",
            fileSize: "calculating...",
            timeLeft: "calculating...",
        });

        const url = `${baseUrl}${Url}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1000000);
        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
                signal: controller.signal,
            });

            if (!response.ok) throw new Error('Failed to download file');

            const contentLength = response.headers.get('Content-Length');
            const total = contentLength ? parseInt(contentLength, 10) : null;

            if (!total) throw new Error('Unable to determine file size');

            const totalSizeReadable = formatBytes(total);
            const extension = format === 'pdf' ? 'pdf' : format === 'excel' ? 'xlsx' : 'zip';
            const filename = `work_order_report_${Date.now()}.${extension}`;
            const reader = response.body.getReader();
            const chunks = [];
            let loaded = 0;
            const startTime = Date.now();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                loaded += value.length;
                const percent = Math.floor((loaded / total) * 100);
                const elapsed = (Date.now() - startTime) / 1000;
                const speed = loaded / elapsed;
                const remaining = total - loaded;
                const timeLeft = speed > 0 ? Math.ceil(remaining / speed) : 0;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                const timeLeftText = minutes > 0
                    ? `${minutes}m ${seconds}s left`
                    : `${seconds}s left`;

                updateNotificationProgress(percent, {
                    filename,
                    fileSize: totalSizeReadable,
                    timeLeft: timeLeftText,
                });

                await new Promise((resolve) => setTimeout(resolve, 10));
            }

            clearTimeout(timeout);
            const blob = new Blob(chunks);
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            setFileLoader(false);
            setTimeout(() => api.destroy(), 3000);
        } catch (error) {
            console.error(error);
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong",
            });
            setFileLoader(false);
            setTimeout(() => api.destroy(), 3000);
        }
    };

    return (
        <DownloadNotificationContext.Provider value={{ downloadWorkOrderFile ,fileLoader}}>
            {contextHolderNotification}
            {contextHolderMessage}
            {children}
        </DownloadNotificationContext.Provider>
    );
};


export const useDownloadNotification = () => useContext(DownloadNotificationContext);
