import type { Task } from '../types';
import { TaskItem } from './TaskItem';
import { useTaskStore } from '../store/useTaskStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from './Button';

interface TaskListProps {
  onCreateTask?: () => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (id: string) => void;
}

export const TaskList = ({
  onCreateTask,
  onEditTask,
  onDeleteTask,
}: TaskListProps) => {
  const { getFilteredTasks, categories, toggleTaskStatus } = useTaskStore();
  const tasks = getFilteredTasks();

  // 根据categoryId获取分类
  const getCategoryById = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId) || {
      id: 'unknown',
      name: '未知',
      color: '#E5E7EB',
    };
  };

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-24 h-24 bg-brand-pink/10 rounded-3xl flex items-center justify-center mb-4">
          <Plus size={48} className="text-brand-pink" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          暂无任务
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          点击下方按钮创建你的第一个任务吧
        </p>
        {onCreateTask && (
          <Button onClick={onCreateTask} variant="primary">
            创建任务
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.05 }}
          >
            <TaskItem
              task={task}
              category={getCategoryById(task.categoryId)}
              onToggle={toggleTaskStatus}
              onEdit={onEditTask || (() => {})}
              onDelete={onDeleteTask || (() => {})}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
