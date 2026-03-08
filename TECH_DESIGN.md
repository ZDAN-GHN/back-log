# 技术设计

## 技术栈
- React + TypeScript + Vite
- Tailwind CSS
- React Router（如果需要多页面）
- Framer Motion（动画效果）
- Zustand（状态管理）
- date-fns （日期处理）
- LocalStorage（数据存储）

## 项目结构
src

| -- components

​	|-- Header.tsx

​	|-- Footer.tsx

| -- layout

​	| -- basiclayout.tsx

| -- router

​	| -- index.ts

| -- store

​	| --  task.ts	

| -- utils （存放工具类）

|-- App.tsx

|-- main.tsx

## 数据管理
- 使用 LocalStorage 作为数据存储
- 使用 Zustand 作为状态管理

## 数据模型

包含以下字段：

- id（唯一标识）
- title（标题）
- description（描述）
- category（分类）
- priority（优先级：低、中、高）
- dueDate（截止日期）
- completed（是否完成）
- createdAt（创建时间）

