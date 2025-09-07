# 金融词根翻译器

一个现代化的金融术语词根翻译工具，基于 React + TypeScript + Vite 构建。

## 功能特性

- 🔍 金融术语词根查询与翻译
- ⚡ 基于 Vite 的快速开发体验
- 🎨 使用 Tailwind CSS 进行样式设计
- 📱 响应式设计，支持移动端
- 🛠️ TypeScript 提供类型安全

## 技术栈

- **前端框架**: React 19
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **开发语言**: TypeScript
- **包管理器**: Bun
- **图标库**: Lucide React

## 快速开始

### 环境要求

- Node.js 18+ 或 Bun 1.0+
- 现代浏览器支持

### 安装依赖

```bash
# 使用 Bun（推荐）
bun install

# 或使用 npm
npm install
```

### 开发模式

```bash
# 启动开发服务器
bun run dev
# 或
npm run dev
```

访问 http://localhost:3000 查看应用。

### 构建生产版本

```bash
# 构建优化版本
bun run build
# 或
npm run build
```

构建产物将输出到 `dist/` 目录。

### 预览生产构建

```bash
# 本地预览生产构建
bun run preview
# 或
npm run preview
```

## 项目结构

```
rootify/
├── src/                 # 源代码目录
│   ├── App.tsx         # 主应用组件
│   ├── main.tsx        # 应用入口点
│   └── index.css       # 全局样式
├── index.html          # HTML 模板
├── package.json        # 项目配置和依赖
├── tsconfig.json       # TypeScript 配置
├── vite.config.ts      # Vite 配置
├── tailwind.config.js  # Tailwind CSS 配置
└── postcss.config.js   # PostCSS 配置
```

## 开发指南

### 添加新功能

1. 在 `src/` 目录下创建新的组件文件
2. 在 `App.tsx` 中引入并使用新组件
3. 根据需要添加类型定义

### 样式开发

项目使用 Tailwind CSS，可以直接在组件中使用 utility classes：

```tsx
function MyComponent() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">标题</h2>
    </div>
  )
}
```

### 代码规范

- 使用 TypeScript 严格模式
- 组件使用函数式组件和 Hooks
- 遵循 React 最佳实践
- 保持代码简洁和可维护性

## 部署

### Vercel 部署（推荐）

1. 连接 GitHub 仓库到 Vercel
2. 配置构建命令: `bun run build`
3. 输出目录: `dist`
4. 自动部署每次 git push

### 其他平台

构建后的 `dist/` 目录可以部署到任何静态文件托管服务：
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- 任何支持静态文件的 Web 服务器


## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

