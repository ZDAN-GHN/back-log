import { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { TaskItem } from '../components/TaskItem';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { TaskForm } from '../components/TaskForm';
import { EmptyState } from '../components/EmptyState';
import { Plus, Calendar, CheckCircle2, Clock, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '../types';
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';

export const Today = () => {
  const { tasks, categories, addTask, deleteTask, updateTask } = useTaskStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'active'>('all');

  // 获取今日任务
  const getTodayTasks = () => {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    return tasks.filter((task) => {
      if (task.dueDate) {
        return isWithinInterval(task.dueDate, {
          start: startOfToday,
          end: endOfToday,
        });
      }
      return false;
    });
  };

  // 根据状态筛选今日任务
  const getFilteredTodayTasks = () => {
    const todayTasks = getTodayTasks();
    if (filterStatus === 'all') return todayTasks;
    return todayTasks.filter((task) =>
      filterStatus === 'completed' ? task.completed : !task.completed
    );
  };

  const allTodayTasks = getTodayTasks();
  const todayTasks = getFilteredTodayTasks();
  const completedCount = allTodayTasks.filter(t => t.completed).length;
  const totalCount = allTodayTasks.length;

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
    // 如果没有设置截止日期，默认设置为今天
    if (!taskData.dueDate) {
      taskData.dueDate = Date.now();
    }

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

  // 根据categoryId获取分类
  const getCategoryById = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId) || {
      id: 'unknown',
      name: '未知',
      color: '#E5E7EB',
    };
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* 侧边栏 - 状态筛选 */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-4">
          {/* 今日概览 */}
          <div className="bg-gradient-to-br from-brand-pink to-brand-purple rounded-2xl p-6 text-white shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <Calendar size={24} />
              <h2 className="text-lg font-semibold">今日任务</h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/80">已完成</span>
                <span className="text-2xl font-bold">{completedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">总计</span>
                <span className="text-2xl font-bold">{totalCount}</span>
              </div>
              {totalCount > 0 && (
                <div className="mt-3 bg-white/20 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-full h-full"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 状态筛选 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 px-2 mb-3">
              状态筛选
            </h2>
            <div className="flex flex-col gap-2">
              <Button
                variant={filterStatus === 'all' ? 'primary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setFilterStatus('all')}
              >
                <List size={18} className="mr-2" />
                全部任务
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'primary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setFilterStatus('active')}
              >
                <Clock size={18} className="mr-2" />
                未完成
              </Button>
              <Button
                variant={filterStatus === 'completed' ? 'primary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setFilterStatus('completed')}
              >
                <CheckCircle2 size={18} className="mr-2" />
                已完成
              </Button>
            </div>
          </div>

          {/* 创建任务按钮 */}
          <div className="pt-4">
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            今日任务
          </h1>
          <p className="text-gray-500">
            {totalCount === 0 ? '今天还没有任务' : `共 ${totalCount} 个任务，已完成 ${completedCount} 个`}
          </p>
        </div>

        {/* 任务列表 */}
        {todayTasks.length === 0 ? (
          <EmptyState
            icon={
              filterStatus === 'all'
                ? List
                : filterStatus === 'completed'
                  ? CheckCircle2
                  : Clock
            }
            title={
              filterStatus === 'all'
                ? '今天还没有任务'
                : filterStatus === 'completed'
                  ? '还没有已经完成的任务呢'
                  : '还没有未完成的任务呢'
            }
            description={
              filterStatus === 'all'
                ? '点击下方按钮创建今天的第一个任务吧'
                : undefined
            }
            actionText={filterStatus === 'all' ? '创建任务' : undefined}
            onAction={filterStatus === 'all' ? handleCreateTask : undefined}
          />
        ) : (
          <div className="space-y-3">
            {todayTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TaskItem
                  task={task}
                  category={getCategoryById(task.categoryId)}
                  onToggle={(id) => useTaskStore.getState().toggleTaskStatus(id)}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              </motion.div>
            ))}
          </div>
        )}
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
