# 技术设计

## 技术栈
- **核心框架**: React 18+ (Functional Components + Hooks) + TypeScript + Vite
- **样式**: Tailwind CSS (核心样式), `clsx` + `tailwind-merge` (样式合并与条件渲染)
- **状态管理**: Zustand (轻量级全局状态管理)
- **路由**: React Router v6 (用于管理今日任务/统计/设置等视图切换，虽为 SPA 但保持结构清晰)
- **动画**: Framer Motion (页面切换、列表项进出、交互反馈)
- **日期处理**: date-fns (轻量级日期格式化与计算)
- **数据存储**: LocalStorage (持久化用户数据)
- **音效**: `use-sound` 或原生 HTML5 Audio API (处理点击与完成音效)
- **图标库**: Lucide React 或 React Icons (风格圆润的图标)

## 项目结构 (建议)

```
src/
├── assets/             # 静态资源（音效文件、图片）
├── components/         # 公共组件
│   ├── Button.tsx      # 通用按钮（支持变体：primary/secondary/danger，带点击音效）
│   ├── Input.tsx       # 通用输入框
│   ├── Modal.tsx       # 通用弹窗
│   ├── CategoryTag.tsx # 分类标签组件
│   ├── TaskItem.tsx    # 单条任务组件（包含交互动画）
│   ├── TaskList.tsx    # 任务列表容器
│   ├── StatsCard.tsx   # 统计卡片组件
│   ├── Header.tsx      # 顶部导航/状态栏
│   └── Footer.tsx      # 底部版权/操作栏
├── hooks/              # 自定义 Hooks
│   ├── useAudio.ts     # 音效播放 Hook
│   └── useTheme.ts     # 主题切换 Hook (预留)
├── layout/
│   └── BasicLayout.tsx # 基础布局容器
├── pages/              # 页面级组件
│   ├── Home.tsx        # 首页（任务列表）
│   ├── Today.tsx       # 今日任务页
│   └── Stats.tsx       # 统计页
├── router/
│   └── index.tsx       # 路由配置
├── store/
│   ├── useTaskStore.ts # 任务状态管理 (CRUD, 筛选, 排序)
│   └── useSettingsStore.ts # 设置状态 (音效开关, 主题)
├── types/              # TypeScript 类型定义
│   └── index.ts
├── utils/              # 工具函数
│   ├── date.ts         # 日期格式化辅助
│   └── storage.ts      # LocalStorage 封装
├── App.tsx
└── main.tsx
```

## 数据管理
- **持久化**: 使用 `zustand/middleware` 的 `persist` 中间件自动同步 LocalStorage。
- **状态切片**: 将任务数据 (`tasks`) 和应用设置 (`settings`) 分离管理。

## 数据模型

### Category (分类)
```typescript
interface Category {
  id: string;
  name: string;      // 分类名称 (如: "工作", "生活")
  color: string;     // 颜色代码 (如: "#FFB6C1")
  icon?: string;     // 图标标识 (可选)
  isDefault?: boolean; // 是否为预设分类 (不可删除)
}
```

### Task (任务)
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId: string; // 关联 Category ID
  priority: 'low' | 'medium' | 'high';
  dueDate?: number;   // 时间戳
  completed: boolean;
  createdAt: number;  // 创建时间戳
  updatedAt: number;  // 更新时间戳
}
```

### Settings (设置)
```typescript
interface Settings {
  enableSound: boolean; // 音效开关
  theme: 'light' | 'dark' | 'system'; // 主题设置
}
```
