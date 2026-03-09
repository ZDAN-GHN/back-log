import { useState, useEffect } from 'react';
import type { Task, Priority } from '../types';
import { Input } from './Input';
import { Button } from './Button';
import { CategoryTag } from './CategoryTag';
import { useTaskStore } from '../store/useTaskStore';
import { Calendar, AlertCircle } from 'lucide-react';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const TaskForm = ({ task, onSubmit, onCancel }: TaskFormProps) => {
  const { categories, filter } = useTaskStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: filter.categoryId === 'all' ? categories[0]?.id || '' : filter.categoryId,
    priority: 'medium' as Priority,
    dueDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        categoryId: task.categoryId,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '请输入任务标题';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      categoryId: formData.categoryId,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : undefined,
      completed: task?.completed || false,
    });
  };

  const priorityOptions: { value: Priority; label: string; color: string }[] = [
    { value: 'low', label: '低', color: 'bg-brand-green' },
    { value: 'medium', label: '中', color: 'bg-warning' },
    { value: 'high', label: '高', color: 'bg-danger' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 任务标题 */}
      <Input
        label="任务标题"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="输入任务标题"
        error={errors.title}
        required
      />

      {/* 任务描述 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          任务描述
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="输入任务描述（可选）"
          rows={3}
          className="w-full px-4 py-2.5 bg-white rounded-xl border-2 border-transparent focus:border-brand-pink/30 focus:outline-none transition-colors duration-200 placeholder:text-gray-400 resize-none"
        />
      </div>

      {/* 分类选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          选择分类
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <CategoryTag
              key={category.id}
              category={category}
              isActive={formData.categoryId === category.id}
              onClick={() => setFormData({ ...formData, categoryId: category.id })}
            />
          ))}
        </div>
      </div>

      {/* 优先级选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          优先级
        </label>
        <div className="flex gap-2">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, priority: option.value })}
              className={`
                flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${formData.priority === option.value ? option.color + ' text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 截止日期 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          截止日期
        </label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border-2 border-transparent focus:border-brand-pink/30 focus:outline-none transition-colors duration-200"
          />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          {task ? '保存' : '创建'}
        </Button>
      </div>
    </form>
  );
};
