import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Task, Category, Priority } from '../types';
import { DEFAULT_CATEGORY_IDS } from '../types';

interface TaskState {
  tasks: Task[];
  categories: Category[];
  searchQuery: string;
  filter: {
    categoryId: string;
    priority: Priority | 'all';
    status: 'all' | 'completed' | 'active';
  };
  sort: {
    by: 'dueDate' | 'priority' | 'createdAt';
    direction: 'asc' | 'desc';
  };
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  
  addCategory: (category: Omit<Category, 'id' | 'isDefault'>) => void;
  deleteCategory: (id: string) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id' | 'isDefault'>>) => void;
  
  setSearchQuery: (query: string) => void;
  setFilter: (filter: Partial<TaskState['filter']>) => void;
  setSort: (sort: Partial<TaskState['sort']>) => void;
  
  // Selectors (Computed)
  getFilteredTasks: () => Task[];
}

const defaultCategories: Category[] = [
  { id: DEFAULT_CATEGORY_IDS.WORK, name: '工作', color: '#60A5FA', icon: 'briefcase', isDefault: true },
  { id: DEFAULT_CATEGORY_IDS.STUDY, name: '学习', color: '#34D399', icon: 'book-open', isDefault: true },
  { id: DEFAULT_CATEGORY_IDS.LIFE, name: '生活', color: '#F472B6', icon: 'coffee', isDefault: true },
];

const PRIORITY_MAP = { high: 3, medium: 2, low: 1 };

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: defaultCategories,
      searchQuery: '',
      filter: {
        categoryId: 'all',
        priority: 'all',
        status: 'all',
      },
      sort: {
        by: 'createdAt',
        direction: 'desc',
      },

      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: uuidv4(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: Date.now() }
              : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      toggleTaskStatus: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, completed: !task.completed, updatedAt: Date.now() }
              : task
          ),
        }));
      },

      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: uuidv4(),
          isDefault: false,
        };
        set((state) => ({ categories: [...state.categories, newCategory] }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id || c.isDefault),
          // 如果删除了某个分类，将该分类下的任务归类为默认分类或者移除分类关联？
          // 这里简单处理：将相关任务的 categoryId 设为 'all' 或者不做处理（前端展示未知分类）
          // 更好的做法可能是提示用户或转移，暂时不处理复杂逻辑，保留任务原ID
        }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setFilter: (filter) =>
        set((state) => ({ filter: { ...state.filter, ...filter } })),
        
      setSort: (sort) =>
        set((state) => ({ sort: { ...state.sort, ...sort } })),

      getFilteredTasks: () => {
        const { tasks, searchQuery, filter, sort } = get();
        
        let result = tasks;

        // 1. Search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          result = result.filter(
            (t) =>
              t.title.toLowerCase().includes(query) ||
              t.description?.toLowerCase().includes(query)
          );
        }

        // 2. Filter by Category
        if (filter.categoryId !== 'all') {
          result = result.filter((t) => t.categoryId === filter.categoryId);
        }

        // 3. Filter by Priority
        if (filter.priority !== 'all') {
          result = result.filter((t) => t.priority === filter.priority);
        }

        // 4. Filter by Status
        if (filter.status !== 'all') {
          const isCompleted = filter.status === 'completed';
          result = result.filter((t) => t.completed === isCompleted);
        }

        // 5. Sort
        result = [...result].sort((a, b) => {
          let compareValue = 0;
          
          switch (sort.by) {
            case 'dueDate':
              // 处理无截止日期的情况，通常放在最后
              if (!a.dueDate && !b.dueDate) compareValue = 0;
              else if (!a.dueDate) compareValue = 1;
              else if (!b.dueDate) compareValue = -1;
              else compareValue = a.dueDate - b.dueDate;
              break;
            case 'priority':
              compareValue = PRIORITY_MAP[a.priority] - PRIORITY_MAP[b.priority];
              break;
            case 'createdAt':
              compareValue = a.createdAt - b.createdAt;
              break;
          }

          return sort.direction === 'asc' ? compareValue : -compareValue;
        });

        return result;
      },
    }),
    {
      name: 'task-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({
        tasks: state.tasks,
        categories: state.categories,
      }), // Only persist tasks and categories
    }
  )
);
