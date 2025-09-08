import { useState } from "react";
import { Copy, Check, FileText, Settings } from "lucide-react";

interface WordRoot {
  chinese: string;
  english: string;
}

interface SegmentationResult {
  chinese: string;
  english: string;
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

function segmentText(text: string): SegmentationResult[] {
  const results: SegmentationResult[] = [];
  let i = 0;

  while (i < text.length) {
    let matched = false;

    for (let len = Math.min(10, text.length - i); len >= 1; len--) {
      const substring = text.substring(i, i + len);
      if (ROOT_MAPPING[substring]) {
        results.push({
          chinese: substring,
          english: ROOT_MAPPING[substring],
        });
        i += len;
        matched = true;
        break;
      }
    }

    if (!matched) {
      i++;
    }
  }

  return results;
}

function BatchTranslationTable() {
  const [tableData, setTableData] = useState<
    Array<{ chinese: string; english: string }>
  >([
    { chinese: "", english: "" },
    { chinese: "", english: "" },
    { chinese: "", english: "" },
    { chinese: "", english: "" },
    { chinese: "", english: "" },
  ]);
  const [copied, setCopied] = useState<number | null>(null);
  const [batchInput, setBatchInput] = useState("");

  const handleInputChange = (index: number, value: string) => {
    const newData = [...tableData];
    newData[index].chinese = value;
    newData[index].english = "";
    setTableData(newData);
  };

  const handleBatchInput = () => {
    const lines = batchInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (lines.length > 0) {
      const newData = lines.map(line => ({ chinese: line, english: "" }));
      setTableData(newData);
      setBatchInput("");
    }
  };

  const handleBatchTranslate = () => {
    const newData = tableData.map((row) => {
      if (row.chinese.trim()) {
        const segments = segmentText(row.chinese);
        const englishResult = segments.map((seg) => seg.english).join("_");
        return { ...row, english: englishResult };
      }
      return row;
    });
    setTableData(newData);
  };

  const handleReset = () => {
    setTableData([
      { chinese: "", english: "" },
      { chinese: "", english: "" },
      { chinese: "", english: "" },
      { chinese: "", english: "" },
      { chinese: "", english: "" },
    ]);
  };

  const addRow = () => {
    setTableData([...tableData, { chinese: "", english: "" }]);
  };

  const copyToClipboard = async (text: string, index: number) => {
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(index);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 批量输入区域 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">批量输入（支持粘贴多行）</h3>
        <div className="space-y-4">
          <textarea
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            placeholder="一次粘贴多行中文，每行一个字段名：
交易日期
时间戳
信息来源
存款金额
取款金额"
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          <div className="flex gap-4">
            <button
              onClick={handleBatchInput}
              disabled={!batchInput.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              添加到表格
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleBatchTranslate}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          批量翻译
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          重置
        </button>
        <button
          onClick={addRow}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          添加行
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200">
          <div className="px-4 py-3 font-medium text-gray-900 border-r border-gray-200">
            中文字段名
          </div>
          <div className="px-4 py-3 font-medium text-gray-900">英文字段名</div>
        </div>

        {tableData.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-2 border-b border-gray-100 last:border-b-0"
          >
            <div className="border-r border-gray-200">
              <input
                type="text"
                value={row.chinese}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder="输入中文字段名"
                className="w-full px-4 py-3 border-0 focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                value={row.english}
                readOnly
                placeholder="英文翻译结果"
                className="w-full px-4 py-3 pr-12 border-0 bg-gray-50 text-gray-700"
              />
              {row.english && (
                <button
                  onClick={() => copyToClipboard(row.english, index)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded transition-colors"
                  title="复制"
                >
                  {copied === index ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RootManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoots = Object.entries(ROOT_MAPPING).filter(
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
          {filteredRoots.map(([chinese, english]) => (
            <div
              key={chinese}
              className="grid grid-cols-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
            >
              <div className="px-4 py-3 border-r border-gray-200 font-medium text-gray-800">
                {chinese}
              </div>
              <div className="px-4 py-3 text-blue-600 font-mono">{english}</div>
            </div>
          ))}
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
  const [inputText, setInputText] = useState("");
  const [segmentationResults, setSegmentationResults] = useState<
    SegmentationResult[]
  >([]);
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    setInputText(value);

    if (value.trim()) {
      const results = segmentText(value);
      setSegmentationResults(results);

      const englishOutput = results.map((r) => r.english).join("_");
      setOutputText(englishOutput);
    } else {
      setSegmentationResults([]);
      setOutputText("");
    }
  };

  const copyToClipboard = async () => {
    if (outputText) {
      try {
        await navigator.clipboard.writeText(outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("复制失败:", error);
      }
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
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                批量词根翻译
              </h2>
              <BatchTranslationTable />

              {/* 单行翻译器（保留原有功能） */}
              <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  单行快速翻译
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      输入中文字段名
                    </label>
                    <input
                      type="text"
                      value={inputText}
                      onChange={handleInputChange}
                      placeholder="交易日期信息来源调整标志"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        分词结果
                      </label>
                      <div className="bg-gray-50 rounded-lg p-4 min-h-[100px] border border-gray-200">
                        {segmentationResults.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {segmentationResults.map((result, index) => (
                              <div
                                key={index}
                                className="bg-white rounded-md p-2 border border-gray-200"
                              >
                                <div className="text-blue-600 font-medium text-sm">
                                  {result.chinese}
                                </div>
                                <div className="text-gray-500 text-xs font-mono">
                                  {result.english}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            等待输入...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      生成的英文字段名
                    </label>
                    <div className="bg-blue-50 rounded-lg p-4 min-h-[100px] border border-blue-200">
                      <div className="flex items-center justify-between h-full">
                        <div className="text-xl font-mono text-blue-700">
                          {outputText || "awaiting_input..."}
                        </div>
                        {outputText && (
                          <button
                            onClick={copyToClipboard}
                            className={`p-2 rounded-md border transition-colors ${
                              copied
                                ? "bg-green-100 border-green-300 text-green-700"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                            title="复制到剪贴板"
                          >
                            {copied ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
