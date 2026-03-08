export type Priority = 'low' | 'medium' | 'high';

export interface Category {
  id: string;
  name: string;      // 分类名称 (如: "工作", "生活")
  color: string;     // 颜色代码 (如: "#FFB6C1")
  icon?: string;     // 图标标识 (可选)
  isDefault?: boolean; // 是否为预设分类 (不可删除)
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId: string; // 关联 Category ID
  priority: Priority;
  dueDate?: number;   // 时间戳
  completed: boolean;
  createdAt: number;  // 创建时间戳
  updatedAt: number;  // 更新时间戳
}

export interface Settings {
  enableSound: boolean; // 音效开关
  theme: 'light' | 'dark' | 'system'; // 主题设置
}

// 预设分类 ID 常量，方便引用
export const DEFAULT_CATEGORY_IDS = {
  ALL: 'all',
  WORK: 'work',
  STUDY: 'study',
  LIFE: 'life',
} as const;
