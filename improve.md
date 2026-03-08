### 1. 针对 [PRD.md](file:///c:\Users\LXH\IdeaProjects\vibecoding\pg-test\backlog\PRD.md) (产品需求文档) 的建议

当前 PRD 明确了核心统计和分类功能，但在基础交互和用户体验细节上可以进一步补充：

*   **补充基础 CRUD 功能**：
    *   文档目前侧重于统计、分类和搜索。建议明确补充任务的 **编辑（修改内容/截止时间）** 和 **删除** 功能，这是待办应用最基础的闭环。
    *   增加 **任务排序** 规则说明（例如：按截止时间倒序、按优先级高低排序）。
*   **细化“自定义分类”需求**：
    *   “支持用户自定义分类”需要更具体的定义。建议补充：用户是否可以管理分类（增删改）？分类是否支持自定义颜色或图标？这对于实现“可爱风/暖色主题”很重要。
*   **完善“听觉反馈”的开关**：
    *   虽然提到了“视觉+听觉”反馈，但考虑到用户体验，建议增加一个 **设置入口**，允许用户开启/关闭音效。
*   **明确“今日任务”逻辑**：
    *   定义清楚“今日任务”的判定标准（是仅截止日期为今天的？还是包含过期的？）。

### 2. 针对 [TECH_DESIGN.md](file:///c:\Users\LXH\IdeaProjects\vibecoding\pg-test\backlog\TECH_DESIGN.md) (技术设计文档) 的建议

技术栈选择合理，但组件结构和具体实现细节可以更具体：

*   **细化组件结构**：
    *   目前的 `components` 目录仅包含 `Header` 和 `Footer`，过于单薄。
    *   建议补充核心业务组件，如：
        *   `TaskItem.tsx` (单条任务，包含交互动画)
        *   `TaskList.tsx` (任务列表容器)
        *   `TaskInput/TaskForm.tsx` (任务输入/编辑)
        *   `StatsCard.tsx` (统计卡片)
        *   `CategoryTag.tsx` (分类标签)
*   **明确音频技术方案**：
    *   PRD 中提到了听觉反馈，但技术栈中未列出音频处理库。
    *   建议添加 `use-sound` 或声明使用原生 `HTML5 Audio API` 来处理点击音效。
*   **路由设计的必要性评估**：
    *   技术栈列出了 `React Router`，但目前需求看似乎是一个单页应用（SPA）。
    *   建议确认是否需要多页面（如 `/stats` 统计页, `/settings` 设置页），如果仅仅是列表过滤，可能不需要复杂的路由，用状态管理视图切换即可。
*   **数据模型优化**：
    *   `category` 字段目前看是字符串。如果支持自定义分类且要配合“暖色/可爱”主题，建议将 `Category` 单独定义为一个模型（包含 `id`, `name`, `colorTheme`），以便前端渲染不同的颜色标签。

### 3. 针对 [AGENTS.md](file:///c:\Users\LXH\IdeaProjects\vibecoding\pg-test\backlog\AGENTS.md) (AI 指令/系统提示词) 的建议

该文档作为 AI 的行为准则非常清晰，但可以加强对特定设计风格和技术细节的强调：

*   **强化设计风格指引**：
    *   在“设计要求”中，除了“美观”，建议明确“暖色主题”和“可爱风”的具体表现。例如：*“多使用圆角 (Rounded corners)、柔和的阴影 (Soft shadows) 和 暖色调 (Warm pastel colors)，避免过于尖锐的边角和冷峻的工业风设计。”*
*   **强制技术栈约束**：
    *   在“开发规范”中，明确要求使用 [TECH_DESIGN.md](file:///c:\Users\LXH\IdeaProjects\vibecoding\pg-test\backlog\TECH_DESIGN.md) 中提到的 `Framer Motion` 做动画，`Zustand` 做状态管理。防止 AI 习惯性地使用 CSS Transition 或 Context API，导致技术实现与设计文档不符。
*   **添加音效实现提醒**：
    *   在“注意事项”中添加一条：*“实现交互时，不要忘记 PRD 中要求的听觉反馈功能。”*

这些建议旨在帮助项目在开发前消除模糊地带，确保最终产出更符合预期。