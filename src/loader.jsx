import { Spin } from 'antd';
import { useSelector } from 'react-redux';

function GlobalLoader() {
    const isLoading = useSelector(state => state?.TeamReducer?.userInsertLoading);
    if (!isLoading) return null;

    return (
        <div style={{
            height: "100svh",
            width: '100vw',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 999,
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Spin size="large" />
        </div>
    );
}

export default GlobalLoader;