import { createBrowserRouter } from 'react-router-dom';
import { BasicLayout } from '../layout/BasicLayout';
import { Home } from '../pages/Home';
import {Today} from "../pages/Today.tsx";
import { Stats } from '../pages/Stats';

// 创建路由配置
export const router = createBrowserRouter([
  {
    path: '/',
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'today',
        element: <Today />,
      },
      {
        path: 'stats',
        element: <Stats />,
      },
    ],
  },
]);
