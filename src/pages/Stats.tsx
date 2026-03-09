import { useTaskStore } from '../store/useTaskStore';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

export const Stats = () => {
  const { tasks, categories } = useTaskStore();

  // 计算统计数据
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 按分类统计
    const categoryStats = categories.map((category) => {
      const categoryTasks = tasks.filter((t) => t.categoryId === category.id);
      const categoryCompleted = categoryTasks.filter((t) => t.completed).length;
      return {
        ...category,
        total: categoryTasks.length,
        completed: categoryCompleted,
        rate: categoryTasks.length > 0 ? Math.round((categoryCompleted / categoryTasks.length) * 100) : 0,
      };
    }).filter((cat) => cat.total > 0);

    // 按优先级统计
    const priorityStats = {
      high: tasks.filter((t) => t.priority === 'high').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      low: tasks.filter((t) => t.priority === 'low').length,
    };

    // 过期任务统计
    const overdueTasks = tasks.filter(
      (t) => !t.completed && t.dueDate && t.dueDate < Date.now()
    ).length;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      categoryStats,
      priorityStats,
      overdueTasks,
    };
  }, [tasks, categories]);

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* 页面标题 */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">数据统计</h1>
        <p className="text-gray-500">查看您的任务完成情况</p>
      </motion.div>

      {/* 总览卡片 */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-brand-pink/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-brand-pink" size={20} />
            </div>
            <span className="text-sm text-gray-500 font-medium">总任务</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.totalTasks}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center">
              <Clock className="text-brand-green" size={20} />
            </div>
            <span className="text-sm text-gray-500 font-medium">待完成</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.pendingTasks}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-success" size={20} />
            </div>
            <span className="text-sm text-gray-500 font-medium">已完成</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.completedTasks}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
              <AlertCircle className="text-warning" size={20} />
            </div>
            <span className="text-sm text-gray-500 font-medium">已过期</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.overdueTasks}</p>
        </div>
      </motion.div>

      {/* 完成率进度 */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">完成率</h2>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-brand-pink" size={20} />
            <span className="text-2xl font-bold text-gray-800">{stats.completionRate}%</span>
          </div>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.completionRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-brand-pink to-brand-green rounded-full"
          />
        </div>
      </motion.div>

      {/* 分类统计 */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">分类统计</h2>
        <div className="space-y-4">
          {stats.categoryStats.map((category) => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {category.completed}/{category.total}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${category.rate}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 优先级统计 */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">优先级分布</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-brand-pink/5 rounded-xl">
            <p className="text-3xl font-bold text-brand-pink mb-1">{stats.priorityStats.high}</p>
            <p className="text-sm text-gray-500">高优先级</p>
          </div>
          <div className="text-center p-4 bg-brand-yellow/20 rounded-xl">
            <p className="text-3xl font-bold text-yellow-600 mb-1">{stats.priorityStats.medium}</p>
            <p className="text-sm text-gray-500">中优先级</p>
          </div>
          <div className="text-center p-4 bg-brand-green/10 rounded-xl">
            <p className="text-3xl font-bold text-brand-green mb-1">{stats.priorityStats.low}</p>
            <p className="text-sm text-gray-500">低优先级</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
