# 金融词根翻译器 - 项目规格说明书

## 项目概述

金融词根翻译器是一个现代化的Web应用，专门为金融从业者和学习者提供金融术语词根查询和翻译服务。

### 核心价值
- 快速查询金融术语的词根和含义
- 提供准确的翻译和解释
- 简洁直观的用户界面
- 响应式设计，支持多设备访问

## 技术架构

### 前端架构
```
┌─────────────────┐
│   React 19      │  # 用户界面框架
├─────────────────┤
│   TypeScript    │  # 类型安全开发
├─────────────────┤
│   Vite          │  # 构建工具和开发服务器
├─────────────────┤
│   Tailwind CSS  │  # 样式框架
├─────────────────┤
│   Lucide React  │  # 图标库
└─────────────────┘
```

### 开发工具链
- **包管理器**: Bun (替代 npm/yarn)
- **构建工具**: Vite
- **样式处理**: PostCSS + Tailwind CSS
- **类型检查**: TypeScript
- **代码格式化**: 待配置 ESLint/Prettier

## 功能模块

### 1. 核心查询模块
**功能描述**: 提供金融术语的词根查询和翻译

**实现细节**:
- 输入框组件：接收用户查询的金融术语
- 查询按钮：触发搜索操作
- 结果显示：展示词根分解和翻译结果
- 历史记录：保存最近的查询记录

**技术实现**:
```tsx
// 伪代码结构
function SearchComponent() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  
  const handleSearch = async (term: string) => {
    // 调用词根分析算法
    const analysis = analyzeTerm(term)
    setResults(analysis)
  }
  
  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        placeholder="输入金融术语"
      />
      <button onClick={() => handleSearch(query)}>查询</button>
      <ResultsList results={results} />
    </div>
  )
}
```

### 2. 词根数据库模块
**功能描述**: 存储和管理金融词根数据

**数据结构**:
```typescript
interface FinancialRoot {
  id: string
  root: string          // 词根
  meaning: string       // 中文含义
  origin: string        // 词源（拉丁/希腊/英语等）
  examples: string[]    // 使用示例
  category: string      // 分类（会计/投资/银行等）
}

interface SearchResult {
  term: string          // 查询术语
  roots: FinancialRoot[] // 匹配的词根
  translation: string   // 完整翻译
  confidence: number    // 匹配置信度
}
```

**实现方案**:
- 初期使用内存数据或JSON文件存储
- 后期可迁移到IndexedDB或后端API
- 支持词根数据的增删改查

### 3. 用户界面模块
**组件结构**:
```
src/
├── components/
│   ├── SearchBar.tsx      # 搜索输入组件
│   ├── ResultsList.tsx    # 结果展示组件
│   ├── RootCard.tsx       # 单个词根卡片
│   ├── HistoryPanel.tsx   # 历史记录面板
│   └── Layout.tsx         # 页面布局组件
├── hooks/
│   ├── useSearch.ts       # 搜索逻辑Hook
│   └── useHistory.ts      # 历史记录Hook
├── utils/
│   ├── analyzer.ts        # 词根分析算法
│   └── data.ts           # 数据管理工具
└── types/
    └── index.ts          # 类型定义
```

### 4. 样式主题模块
**设计系统**:
- **色彩方案**: 专业金融蓝色调
- **字体**: 系统字体栈，确保可读性
- **间距**: Tailwind标准间距系统
- **响应式断点**: mobile-first设计

**组件样式**:
```tsx
// 示例组件样式
function RootCard({ root }: { root: FinancialRoot }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-blue-800">{root.root}</h3>
      <p className="text-gray-600 mt-2">{root.meaning}</p>
      <span className="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded mt-2">
        {root.origin}
      </span>
    </div>
  )
}
```

## 算法设计

### 词根分析算法
**输入**: 金融术语字符串
**输出**: 词根分解结果和翻译

**处理流程**:
1. **标准化处理**: 转换为小写，去除特殊字符
2. **词根匹配**: 与词根数据库进行前缀/后缀匹配
3. **分解算法**: 最长匹配优先原则
4. **翻译生成**: 组合匹配词根的含义
5. **置信度计算**: 基于匹配程度计算可信度

**伪代码**:
```typescript
function analyzeTerm(term: string): SearchResult {
  const normalized = normalizeTerm(term)
  const matchedRoots = findMatchingRoots(normalized)
  const translation = generateTranslation(matchedRoots)
  const confidence = calculateConfidence(matchedRoots, term)
  
  return {
    term,
    roots: matchedRoots,
    translation,
    confidence
  }
}
```

## 数据模型

### 初始词根数据
```typescript
const financialRoots: FinancialRoot[] = [
  {
    id: 'fin-001',
    root: 'fin',
    meaning: '财务，金融',
    origin: '拉丁语 finis',
    examples: ['finance', 'financial', 'financier'],
    category: '通用金融'
  },
  {
    id: 'cred-001', 
    root: 'cred',
    meaning: '信用，信任',
    origin: '拉丁语 credere',
    examples: ['credit', 'creditor', 'credibility'],
    category: '银行信贷'
  },
  // 更多词根数据...
]
```

## 开发路线图

### Phase 1: MVP (最小可行产品)
- [ ] 基础搜索界面
- [ ] 内存词根数据库
- [ ] 基本词根分析算法
- [ ] 结果展示组件
- [ ] 响应式布局

### Phase 2: 功能增强
- [ ] 搜索历史记录
- [ ] 词根收藏功能
- [ ] 更精确的分析算法
- [ ] 分类筛选
- [ ] 性能优化

### Phase 3: 高级特性
- [ ] 用户账户系统
- [ ] 云端数据同步
- [ ] 移动端应用
- [ ] 离线支持
- [ ] 多语言支持

## 性能考虑

### 前端性能优化
- **代码分割**: 使用React.lazy进行路由级分割
- **图片优化**: 使用现代图片格式
- **缓存策略**: 合理的HTTP缓存头
- **打包优化**: Vite的tree-shaking和压缩

### 数据分析性能
- **词根匹配**: 使用Trie树数据结构优化搜索
- **内存管理**: 合理的数据缓存策略
- **算法复杂度**: 确保O(n)或O(log n)的查询性能

## 测试策略

### 单元测试
```typescript
// 示例测试
import { analyzeTerm } from './analyzer'

describe('词根分析器', () => {
  test('应该正确分析金融术语', () => {
    const result = analyzeTerm('financial')
    expect(result.roots).toContainEqual(
      expect.objectContaining({ root: 'fin' })
    )
    expect(result.confidence).toBeGreaterThan(0.8)
  })
})
```

### 集成测试
- 组件交互测试
- 端到端搜索流程测试
- 响应式布局测试

### 性能测试
- 搜索响应时间基准
- 大规模数据加载测试
- 内存使用监控

## 部署架构

### 开发环境
- **本地开发**: Vite开发服务器 + HMR
- **代码质量**: ESLint + Prettier
- **类型检查**: TypeScript严格模式

### 生产环境
- **构建输出**: Vite优化构建
- **托管平台**: Vercel/Netlify
- **CDN**: 静态资源CDN加速
- **监控**: 错误跟踪和性能监控

## 维护指南

### 代码规范
- 使用函数组件和Hooks
- 遵循React最佳实践
- 保持组件单一职责
- 使用有意义的命名

### 数据维护
- 定期更新词根数据库
- 验证翻译准确性
- 收集用户反馈改进算法

### 安全考虑
- 输入验证和清理
- XSS防护
- 避免敏感数据泄露

---

*最后更新: 2025-09-07*
*版本: 1.0.0*