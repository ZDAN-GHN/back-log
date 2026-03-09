import {createBrowserRouter} from 'react-router-dom';
import App from "../App.tsx";

// 创建路由配置
export const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>
    },
]);
