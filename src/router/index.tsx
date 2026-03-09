import { createBrowserRouter } from 'react-router-dom';
import { BasicLayout } from '../layout/BasicLayout';
import { Home } from '../pages/Home';

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
        element: <div className="p-8">今日任务页（待开发）</div>,
      },
      {
        path: 'stats',
        element: <div className="p-8">统计页（待开发）</div>,
      },
      {
        path: 'settings',
        element: <div className="p-8">设置页（待开发）</div>,
      },
    ],
  },
]);
