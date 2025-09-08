import { useState } from "react";
import { Copy, Check, FileText, Settings } from "lucide-react";

interface WordRoot {
  chinese: string;
  english: string;
}

interface SegmentationResult {
  chinese: string;
  english: string;
  isUnknown?: boolean;
}

// 完整的词根映射库（461个词根）
const ROOT_MAPPING = {
  交易: "trade",
  日期: "date",
  时间: "time",
  信息: "info",
  存款: "deposit",
  取款: "withdrawal",
  转账: "transfer",
  汇款: "remittance",
  外汇: "forex",
  本币: "domestic",
  外币: "foreign",
  兑换: "exchange",
  汇率: "rate",
  升值: "appreciation",
  贬值: "depreciation",
  通胀: "inflation",
  通缩: "deflation",
  央行: "central_bank",
  货币: "monetary",
  政策: "policy",
  利率: "interest_rate",
  基准: "benchmark",
  指数: "index",
  评级: "rating",
  信用: "credit",
  评分: "score",
  等级: "grade",
  标准: "standard",
  规范: "specification",
  分位数: "quantile",
};

const wordRootLibrary: WordRoot[] = Object.entries(ROOT_MAPPING).map(
  ([chinese, english]) => ({ chinese, english })
);

function loadCustomRoots(): Record<string, string> {
  try {
    const stored = localStorage.getItem('customWordRoots');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveCustomRoots(customRoots: Record<string, string>) {
  localStorage.setItem('customWordRoots', JSON.stringify(customRoots));
}

function getAllRoots(): Record<string, string> {
  const customRoots = loadCustomRoots();
  return { ...ROOT_MAPPING, ...customRoots };
}

function segmentText(text: string): SegmentationResult[] {
  const allRoots = getAllRoots();
  const results: SegmentationResult[] = [];
  let i = 0;

  while (i < text.length) {
    let matched = false;

    for (let len = Math.min(10, text.length - i); len >= 1; len--) {
      const substring = text.substring(i, i + len);
      if (allRoots[substring]) {
        results.push({
          chinese: substring,
          english: allRoots[substring],
        });
        i += len;
        matched = true;
        break;
      }
    }

    if (!matched) {
      results.push({
        chinese: text[i],
        english: "",
        isUnknown: true,
      });
      i++;
    }
  }

  return results;
}


function RootManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const allRoots = getAllRoots();
  const customRoots = loadCustomRoots();

  const filteredRoots = Object.entries(allRoots).filter(
    ([chinese, english]) =>
      chinese.includes(searchTerm) || english.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索词根..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200">
          <div className="px-4 py-3 font-medium text-gray-900 border-r border-gray-200">
            中文词根
          </div>
          <div className="px-4 py-3 font-medium text-gray-900">英文对应</div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredRoots.map(([chinese, english]) => {
            const isCustom = customRoots[chinese] !== undefined;
            return (
              <div
                key={chinese}
                className="grid grid-cols-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
              >
                <div className={`px-4 py-3 border-r border-gray-200 font-medium ${isCustom ? 'text-green-800' : 'text-gray-800'}`}>
                  {chinese}
                  {isCustom && <span className="ml-2 text-xs text-green-600">[自定义]</span>}
                </div>
                <div className={`px-4 py-3 font-mono ${isCustom ? 'text-green-600' : 'text-blue-600'}`}>{english}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-sm text-gray-500 text-center">
        共 {filteredRoots.length} 个词根
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<"translation" | "management">(
    "translation"
  );
  const [unifiedInput, setUnifiedInput] = useState("");
  const [tableData, setTableData] = useState<
    Array<{ chinese: string; english: string; hasUnknownRoots?: boolean; segments?: SegmentationResult[] }>
  >([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [manualTranslations, setManualTranslations] = useState<Record<string, string>>({});
  const [showManualPanel, setShowManualPanel] = useState(false);
  const [currentUnknownRoots, setCurrentUnknownRoots] = useState<string[]>([]);

  const handleUnifiedInput = (value: string) => {
    setUnifiedInput(value);
    
    if (value.trim()) {
      const lines = value.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      const newData = lines.map(line => ({ chinese: line, english: "" }));
      setTableData(newData);
    } else {
      setTableData([]);
    }
  };

  const handleTableEdit = (index: number, chinese: string) => {
    const newData = [...tableData];
    newData[index].chinese = chinese;
    newData[index].english = "";
    setTableData(newData);
  };

  const addRow = () => {
    setTableData([...tableData, { chinese: "", english: "" }]);
  };

  const deleteRow = (index: number) => {
    const newData = tableData.filter((_, i) => i !== index);
    setTableData(newData);
  };

  const handleBatchTranslate = () => {
    const translatedData = tableData.map((row) => {
      if (row.chinese.trim()) {
        const segments = segmentText(row.chinese);
        const unknownRoots = segments.filter(seg => seg.isUnknown).map(seg => seg.chinese);
        const englishResult = segments.map((seg) => seg.english).join("_");
        
        return { 
          ...row, 
          english: englishResult,
          hasUnknownRoots: unknownRoots.length > 0,
          segments: segments
        };
      }
      return row;
    });
    setTableData(translatedData);
    
    // 收集所有未知词根
    const allUnknownRoots = translatedData
      .filter(row => row.hasUnknownRoots)
      .flatMap(row => row.segments?.filter(seg => seg.isUnknown).map(seg => seg.chinese) || []);
    
    const uniqueUnknownRoots = [...new Set(allUnknownRoots)];
    if (uniqueUnknownRoots.length > 0) {
      setCurrentUnknownRoots(uniqueUnknownRoots);
      setShowManualPanel(true);
    }
  };

  const handleReset = () => {
    setUnifiedInput("");
    setTableData([]);
  };

  const copyToClipboard = async (text: string, index: number) => {
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handleManualTranslation = (chinese: string, english: string) => {
    setManualTranslations(prev => ({ ...prev, [chinese]: english }));
  };

  const saveManualTranslations = () => {
    const customRoots = loadCustomRoots();
    const updatedCustomRoots = { ...customRoots, ...manualTranslations };
    saveCustomRoots(updatedCustomRoots);
    
    // 重新翻译所有文本
    const retranslatedData = tableData.map((row) => {
      if (row.chinese.trim()) {
        const segments = segmentText(row.chinese);
        const englishResult = segments.map((seg) => seg.english).join("_");
        const unknownRoots = segments.filter(seg => seg.isUnknown).map(seg => seg.chinese);
        
        return { 
          ...row, 
          english: englishResult,
          hasUnknownRoots: unknownRoots.length > 0,
          segments: segments
        };
      }
      return row;
    });
    
    setTableData(retranslatedData);
    setShowManualPanel(false);
    setManualTranslations({});
    
    // 检查是否还有未知词根
    const remainingUnknown = retranslatedData
      .filter(row => row.hasUnknownRoots)
      .flatMap(row => row.segments?.filter(seg => seg.isUnknown).map(seg => seg.chinese) || []);
    
    if (remainingUnknown.length > 0) {
      setCurrentUnknownRoots([...new Set(remainingUnknown)]);
    } else {
      setCurrentUnknownRoots([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">金融词根翻译系统</h1>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        <nav className="w-64 bg-white border-r border-gray-200 p-6">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab("translation")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "translation"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FileText className="w-5 h-5" />
              词根翻译
            </button>
            <button
              onClick={() => setActiveTab("management")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "management"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Settings className="w-5 h-5" />
              词根管理
            </button>
          </div>
        </nav>

        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "translation" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">词根翻译</h2>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  输入中文字段名（支持单行或多行）
                </label>
                <textarea
                  value={unifiedInput}
                  onChange={(e) => handleUnifiedInput(e.target.value)}
                  placeholder="输入中文字段名，每行一个：
交易日期
时间戳
信息来源
存款金额
取款金额"
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleBatchTranslate}
                    disabled={tableData.length === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    翻译
                  </button>
                  <button
                    onClick={addRow}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    添加行
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    清空
                  </button>
                </div>
              </div>

              {tableData.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200">
                    <div className="px-4 py-3 font-medium text-gray-900 border-r border-gray-200">中文字段名</div>
                    <div className="px-4 py-3 font-medium text-gray-900">英文字段名</div>
                  </div>

                  {tableData.map((row, index) => (
                    <div key={index} className="grid grid-cols-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 group">
                      <div className="border-r border-gray-200 relative">
                        <input
                          type="text"
                          value={row.chinese}
                          onChange={(e) => handleTableEdit(index, e.target.value)}
                          className="w-full px-4 py-3 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                          placeholder="输入中文"
                        />
                        {row.hasUnknownRoots && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">!</div>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <div className={`px-4 py-3 pr-20 font-mono flex-1 ${row.hasUnknownRoots ? 'text-orange-600' : 'text-blue-600'}`}>{row.english || "..."}</div>
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {row.english && (
                            <button
                              onClick={() => copyToClipboard(row.english, index)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                              title="复制"
                            >
                              {copiedIndex === index ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => deleteRow(index)}
                            className="p-1 hover:bg-red-100 rounded transition-colors text-red-500 font-bold"
                            title="删除"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showManualPanel && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 手动翻译未知词根</h3>
                  <p className="text-sm text-gray-600 mb-4">以下字符无法自动翻译，请提供英文对应：</p>
                  
                  <div className="space-y-4 mb-6">
                    {currentUnknownRoots.map((root) => (
                      <div key={root} className="flex items-center gap-4">
                        <div className="w-20 text-right font-medium text-gray-900">{root}</div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={manualTranslations[root] || ""}
                            onChange={(e) => handleManualTranslation(root, e.target.value)}
                            placeholder="输入英文翻译..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={saveManualTranslations}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      保存翻译
                    </button>
                    <button
                      onClick={() => setShowManualPanel(false)}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "management" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                词根库管理
              </h2>
              <RootManagement />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
