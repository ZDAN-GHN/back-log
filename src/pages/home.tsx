import { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { CategoryTag } from '../components/CategoryTag';
import { TaskList } from '../components/TaskList';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { TaskForm } from '../components/TaskForm';
import { Plus, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '../types';
import { DEFAULT_CATEGORY_IDS } from '../types';

export const Home = () => {
  const { categories, filter, setFilter, addTask, deleteTask, updateTask } =
    useTaskStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // 处理创建任务
  const handleCreateTask = () => {
    setShowCreateModal(true);
  };

  // 处理编辑任务
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  // 提交新任务
  const handleSubmitTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      addTask(taskData);
      setShowCreateModal(false);
    }
  };

  // 关闭弹窗
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingTask(null);
  };

  // 处理删除任务
  const handleDeleteTask = (id: string) => {
    setShowDeleteConfirm(id);
  };

  // 确认删除
  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteTask(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* 侧边栏 - 分类 */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 px-2">
            分类
          </h2>
          <div className="flex flex-wrap lg:flex-col gap-2">
            <CategoryTag
              category={{
                id: 'all',
                name: '全部',
                color: '#E5E7EB',
                icon: 'star',
              }}
              isActive={filter.categoryId === 'all'}
              onClick={() => setFilter({ categoryId: 'all' })}
            />
            {categories.map((category) => (
              <CategoryTag
                key={category.id}
                category={category}
                isActive={filter.categoryId === category.id}
                onClick={() => setFilter({ categoryId: category.id })}
              />
            ))}
          </div>

          {/* 创建任务按钮 */}
          <div className="pt-4 lg:pt-0">
            <Button
              onClick={handleCreateTask}
              className="w-full"
              variant="primary"
            >
              <Plus size={18} />
              创建任务
            </Button>
          </div>
        </div>
      </aside>

      {/* 主内容区 - 任务列表 */}
      <main className="flex-1 min-w-0">
        {/* 搜索和筛选栏 */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="搜索任务..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border-2 border-transparent focus:border-brand-pink/30 focus:outline-none transition-colors"
              // TODO: 实现搜索功能
            />
          </div>
          <Button variant="ghost" className="gap-2">
            <Filter size={18} />
            筛选
          </Button>
        </div>

        {/* 任务列表 */}
        <TaskList
          onCreateTask={handleCreateTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </main>

      {/* 删除确认弹窗 */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                确认删除
              </h3>
              <p className="text-gray-600 mb-6">
                确定要删除这个任务吗？此操作无法撤销。
              </p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  取消
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={confirmDelete}
                >
                  删除
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 创建/编辑任务弹窗 */}
      <Modal
        isOpen={showCreateModal || !!editingTask}
        onClose={handleCloseModal}
        title={editingTask ? '编辑任务' : '创建任务'}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmitTask}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};
