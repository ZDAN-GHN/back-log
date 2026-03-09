import type { Task, Category } from '../types';
import { Check, Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState } from 'react';

interface TaskItemProps {
  task: Task;
  category: Category;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

// 优先级颜色映射
const priorityColors = {
  high: 'bg-danger',
  medium: 'bg-warning',
  low: 'bg-brand-green',
};

// 滑动阈值（像素）
const SWIPE_THRESHOLD = -80;
const MAX_SWIPE_DISTANCE = -120;

export const TaskItem = ({
  task,
  category,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemProps) => {
  const [isSwiped, setIsSwiped] = useState(false);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, -80], [0, 1]);
  const isOverdue = task.dueDate && task.dueDate < Date.now() && !task.completed;

  const handleDrag = (_: any, info: { offset: { x: number } }) => {
    // 实时更新x值，跟随用户触摸
    const newX = Math.max(info.offset.x, MAX_SWIPE_DISTANCE);
    x.set(newX);
  };

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (info.offset.x < SWIPE_THRESHOLD) {
      setIsSwiped(true);
    } else {
      setIsSwiped(false);
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(task.id);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* 操作按钮层 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end gap-2 bg-gray-50 px-4"
        style={{ opacity }}
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(task)}
          className="p-3 rounded-xl bg-brand-blue text-white shadow-sm"
          aria-label="编辑任务"
        >
          <Edit2 size={20} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(task.id)}
          className="p-3 rounded-xl bg-danger text-white shadow-sm"
          aria-label="删除任务"
        >
          <Trash2 size={20} />
        </motion.button>
      </motion.div>

      {/* 任务卡片 */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={0.05}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{ x: isSwiped ? MAX_SWIPE_DISTANCE : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ x }}
        className={clsx(
          'relative bg-white rounded-2xl shadow-card p-4 touch-none',
          task.completed && 'opacity-60'
        )}
      >
        {/* 任务卡片内容 */}
        <div className="flex items-start gap-3">
          {/* 复选框 */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleClick}
            className={clsx(
              'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200',
              task.completed
                ? 'bg-brand-green border-brand-green text-white'
                : 'border-gray-300 hover:border-brand-pink'
            )}
          >
            {task.completed && <Check size={14} strokeWidth={3} />}
          </motion.button>

          {/* 任务信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={clsx(
                  'font-medium text-gray-800 break-words',
                  task.completed && 'line-through text-gray-400'
                )}
              >
                {task.title}
              </h3>
              {/* 优先级标签 */}
              <span
                className={clsx(
                  'flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium text-white',
                  priorityColors[task.priority]
                )}
              >
                {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
              </span>
            </div>

            {task.description && (
              <p
                className={clsx(
                  'mt-1 text-sm text-gray-500 line-clamp-2',
                  task.completed && 'text-gray-300'
                )}
              >
                {task.description}
              </p>
            )}

            {/* 底部信息栏 */}
            <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
              {/* 分类标签 */}
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>

              {/* 截止日期 */}
              {task.dueDate && (
                <span
                  className={clsx(
                    'inline-flex items-center gap-1',
                    isOverdue && 'text-danger font-medium'
                  )}
                >
                  {isOverdue && <AlertCircle size={12} />}
                  <Calendar size={12} />
                  {new Date(task.dueDate).toLocaleDateString('zh-CN', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
