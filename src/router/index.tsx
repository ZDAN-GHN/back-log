import { createBrowserRouter } from 'react-router-dom';
import { BasicLayout } from '../layout/BasicLayout';
import { Home } from '../pages/Home';
import { Today } from '../pages/today';
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
      {
        path: 'settings',
        element: <div className="p-8">设置页（待开发）</div>,
      },
    ],
  },
]);
