import {useState} from 'react';
import {useTaskStore} from '../store/useTaskStore';
import {CategoryTag} from '../components/CategoryTag';
import {TaskList} from '../components/TaskList';
import {Button} from '../components/Button';
import {Modal} from '../components/Modal';
import {TaskForm} from '../components/TaskForm';
import {CheckCircle, Clock, AlertCircle, TrendingUp, ChevronDown} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';
import type {Task} from '../types';

export const Todo = () => {
    const {tasks, categories, filter, setFilter, addTask, deleteTask, updateTask} = useTaskStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // 计算统计数据
    const stats = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter((t) => t.completed).length,
        pendingTasks: tasks.length - tasks.filter((t) => t.completed).length,
        completionRate: tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0,
        overdueTasks: tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < Date.now()).length,
    };

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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 bg-brand-pink rounded-xl flex items-center justify-center text-white shadow-sm">
                            <CheckCircle size={20} strokeWidth={2.5}/>
                        </div>
                        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                            Backlog
                        </h1>
                    </div>
                </div>
            </header>

            {/* 主内容区 */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 左侧列 */}
                    <div className="space-y-6">
                        {/* 左上方 - 统计数据 */}
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            className="bg-white rounded-2xl p-6 shadow-soft"
                        >
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">数据统计</h2>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-brand-pink/5 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="text-brand-pink" size={18}/>
                                        <span className="text-sm text-gray-600">总任务</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-800">{stats.totalTasks}</p>
                                </div>
                                <div className="bg-brand-green/5 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="text-brand-green" size={18}/>
                                        <span className="text-sm text-gray-600">待完成</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-800">{stats.pendingTasks}</p>
                                </div>
                                <div className="bg-success/5 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="text-success" size={18}/>
                                        <span className="text-sm text-gray-600">已完成</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-800">{stats.completedTasks}</p>
                                </div>
                                <div className="bg-warning/5 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle className="text-warning" size={18}/>
                                        <span className="text-sm text-gray-600">已过期</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-800">{stats.overdueTasks}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">完成率</span>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="text-brand-pink" size={16}/>
                                        <span className="text-xl font-bold text-gray-800">{stats.completionRate}%</span>
                                    </div>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{width: 0}}
                                        animate={{width: `${stats.completionRate}%`}}
                                        transition={{duration: 1, ease: 'easeOut'}}
                                        className="h-full bg-gradient-to-r from-brand-pink to-brand-green rounded-full"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* 左下方 - 分类筛选 */}
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.1}}
                            className="bg-white rounded-2xl p-6 shadow-soft"
                        >
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">分类筛选</h2>
                            <div className="flex flex-col gap-2">
                                <CategoryTag
                                    category={{
                                        id: 'all',
                                        name: '全部',
                                        color: '#E5E7EB',
                                        icon: 'star',
                                    }}
                                    isActive={filter.categoryId === 'all'}
                                    onClick={() => setFilter({categoryId: 'all'})}
                                    className="w-full justify-start"
                                />
                                {categories.map((category) => (
                                    <CategoryTag
                                        key={category.id}
                                        category={category}
                                        isActive={filter.categoryId === category.id}
                                        onClick={() => setFilter({categoryId: category.id})}
                                        className="w-full justify-start"
                                    />
                                ))}
                            </div>
                        </motion.div>

                    </div>

                    {/* 右侧列 */}
                    <div className="space-y-6">
                        {/* 右上方 - 任务添加 */}
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.2}}
                            className="bg-white rounded-2xl p-6 shadow-soft"
                        >
                            {/* 标题栏 */}
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => setShowAddForm(!showAddForm)}
                            >
                                <h2 className="text-lg font-semibold text-gray-800">添加任务</h2>
                                <motion.div
                                    animate={{rotate: showAddForm ? 180 : 0}}
                                    transition={{duration: 0.2}}
                                >
                                    <ChevronDown size={20} className="text-gray-400"/>
                                </motion.div>
                            </div>

                            {/* 表单内容 */}
                            <AnimatePresence>
                                {showAddForm && (
                                    <motion.div
                                        initial={{height: 0, opacity: 0}}
                                        animate={{height: 'auto', opacity: 1}}
                                        exit={{height: 0, opacity: 0}}
                                        transition={{duration: 0.2}}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-4">
                                            <TaskForm
                                                task={null}
                                                onSubmit={(taskData) => {
                                                    handleSubmitTask(taskData);
                                                    setShowAddForm(false);
                                                }}
                                                onCancel={() => setShowAddForm(false)}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* 右下方 - 所有任务 */}
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.3}}
                            className="bg-white rounded-2xl p-6 shadow-soft"
                        >
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">任务列表</h2>
                            <div className="h-[430px] overflow-y-auto">
                                <TaskList
                                    onCreateTask={handleCreateTask}
                                    onEditTask={handleEditTask}
                                    onDeleteTask={handleDeleteTask}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* 删除确认弹窗 */}
            <Modal
                isOpen={!!showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(null)}
                title="确认删除"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
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
                </div>
            </Modal>

            {/* 编辑任务弹窗 */}
            <Modal
                isOpen={!!editingTask}
                onClose={handleCloseModal}
                title="编辑任务"
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
