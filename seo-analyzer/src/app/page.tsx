'use client';

import { useState } from 'react';
import { 
  Search, Loader2, Copy, CheckCircle, AlertCircle, 
  Globe, FileText, Image, Link2, Code, Brain,
  List, Table, HelpCircle, BookOpen, TrendingUp, Zap
} from 'lucide-react';

interface SEOAnalysis {
  url: string;
  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  h1: string[];
  h2: string[];
  h3: string[];
  images: { src: string; alt: string | null }[];
  imagesWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  wordCount: number;
  canonical: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  hasSchema: boolean;
  schemaTypes: string[];
  robots: string | null;
  viewport: string | null;
  language: string | null;
}

interface GEOAnalysis {
  hasStructuredContent: boolean;
  hasFAQ: boolean;
  hasLists: boolean;
  hasTables: boolean;
  hasDefinitions: boolean;
  contentClarity: 'high' | 'medium' | 'low';
  hasSummary: boolean;
  hasNumberedSteps: boolean;
  questionCount: number;
  citationIndicators: number;
  readabilityScore: 'easy' | 'medium' | 'hard';
  entityClarity: 'high' | 'medium' | 'low';
  contentDepth: 'shallow' | 'medium' | 'deep';
}

interface AnalysisResult {
  success: boolean;
  error?: string;
  seo?: SEOAnalysis;
  geo?: GEOAnalysis;
  score?: {
    seo: number;
    geo: number;
    overall: number;
  };
  recommendations?: string[];
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  const analyzeUrl = async () => {
    if (!url.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch {
      setResult({ success: false, error: '網路錯誤，請稍後再試' });
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    if (!result?.success || !result.seo || !result.geo || !result.score) return '';

    const seo = result.seo;
    const geo = result.geo;
    const score = result.score;

    return `📊 SEO & GEO 分析報告
━━━━━━━━━━━━━━━━━━━━━━━━

🔗 網址: ${seo.url}
📅 分析時間: ${new Date().toLocaleString('zh-TW')}

═══════════════════════════
📈 綜合評分
═══════════════════════════
• SEO 分數: ${score.seo}/100
• GEO 分數: ${score.geo}/100  
• 總體評分: ${score.overall}/100

═══════════════════════════
🔍 SEO 分析結果
═══════════════════════════

【標題 Title】
${seo.title || '❌ 未設定'}
長度: ${seo.titleLength} 字元 ${seo.titleLength >= 30 && seo.titleLength <= 60 ? '✅' : '⚠️'}

【Meta Description】
${seo.metaDescription || '❌ 未設定'}
長度: ${seo.metaDescriptionLength} 字元 ${seo.metaDescriptionLength >= 120 && seo.metaDescriptionLength <= 160 ? '✅' : '⚠️'}

【標題結構】
• H1: ${seo.h1.length} 個 ${seo.h1.length === 1 ? '✅' : '⚠️'}
${seo.h1.map(h => `  - ${h}`).join('\n')}
• H2: ${seo.h2.length} 個
${seo.h2.slice(0, 5).map(h => `  - ${h}`).join('\n')}${seo.h2.length > 5 ? '\n  ...更多' : ''}
• H3: ${seo.h3.length} 個

【圖片】
• 總數: ${seo.images.length} 張
• 缺少 Alt: ${seo.imagesWithoutAlt} 張 ${seo.imagesWithoutAlt === 0 ? '✅' : '⚠️'}

【連結】
• 內部連結: ${seo.internalLinks} 個
• 外部連結: ${seo.externalLinks} 個

【其他設定】
• Canonical: ${seo.canonical ? '✅ 已設定' : '❌ 未設定'}
• Open Graph: ${seo.ogTitle ? '✅ 已設定' : '❌ 未設定'}
• Schema: ${seo.hasSchema ? `✅ ${seo.schemaTypes.join(', ')}` : '❌ 未設定'}
• 語言標籤: ${seo.language || '❌ 未設定'}
• 字數: ${seo.wordCount} 字

═══════════════════════════
🤖 GEO 分析結果 (AI 搜尋優化)
═══════════════════════════

【內容結構】
• 結構化內容: ${geo.hasStructuredContent ? '✅ 有' : '❌ 無'}
• 清單列表: ${geo.hasLists ? '✅ 有' : '❌ 無'}
• 表格: ${geo.hasTables ? '✅ 有' : '❌ 無'}
• 步驟說明: ${geo.hasNumberedSteps ? '✅ 有' : '❌ 無'}

【AI 友善度】
• FAQ 區塊: ${geo.hasFAQ ? '✅ 有' : '❌ 無'}
• 總結摘要: ${geo.hasSummary ? '✅ 有' : '❌ 無'}
• 內容清晰度: ${geo.contentClarity === 'high' ? '✅ 高' : geo.contentClarity === 'medium' ? '⚠️ 中' : '❌ 低'}
• 可讀性: ${geo.readabilityScore === 'easy' ? '✅ 易讀' : geo.readabilityScore === 'medium' ? '⚠️ 中等' : '❌ 較難'}
• 內容深度: ${geo.contentDepth === 'deep' ? '✅ 深入' : geo.contentDepth === 'medium' ? '⚠️ 中等' : '❌ 淺層'}

【權威性指標】
• 引用來源: ${geo.citationIndicators} 處
• 實體清晰度: ${geo.entityClarity === 'high' ? '✅ 高' : geo.entityClarity === 'medium' ? '⚠️ 中' : '❌ 低'}

═══════════════════════════
💡 改善建議
═══════════════════════════
${result.recommendations?.map((r, i) => `${i + 1}. ${r}`).join('\n') || '無'}

━━━━━━━━━━━━━━━━━━━━━━━━
由 SEO & GEO 分析器生成 🐻
`;
  };

  const copyReport = async () => {
    const report = generateReport();
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      {/* Decorative elements */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <Globe className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              SEO & GEO 分析器
            </h1>
          </div>
          <p className="text-slate-300">掃描網頁 SEO 結構，分析 AI 搜尋優化程度</p>
        </div>

        {/* Input Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && analyzeUrl()}
              placeholder="輸入網址，例如 https://example.com"
              className="flex-1 px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 
                         focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent
                         text-white placeholder:text-slate-400 transition-all"
            />
            <button
              onClick={analyzeUrl}
              disabled={loading || !url.trim()}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 
                         hover:from-purple-600 hover:to-blue-600 
                         disabled:from-slate-600 disabled:to-slate-700
                         text-white rounded-2xl font-medium transition-all
                         flex items-center gap-2 shadow-lg hover:shadow-xl 
                         disabled:shadow-none hover:scale-105 active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              分析
            </button>
          </div>
        </div>

        {/* Error */}
        {result && !result.success && (
          <div className="bg-red-500/20 backdrop-blur-lg rounded-2xl border border-red-500/30 p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200">{result.error}</span>
          </div>
        )}

        {/* Results */}
        {result?.success && result.seo && result.geo && result.score && (
          <>
            {/* Score Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-5 text-center">
                <div className={`text-4xl font-bold ${getScoreColor(result.score.seo)}`}>
                  {result.score.seo}
                </div>
                <div className="text-slate-400 text-sm mt-1">SEO 分數</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-5 text-center">
                <div className={`text-4xl font-bold ${getScoreColor(result.score.geo)}`}>
                  {result.score.geo}
                </div>
                <div className="text-slate-400 text-sm mt-1">GEO 分數</div>
              </div>
              <div className={`bg-gradient-to-br ${getScoreBg(result.score.overall)} rounded-2xl p-5 text-center`}>
                <div className="text-4xl font-bold text-white">
                  {result.score.overall}
                </div>
                <div className="text-white/80 text-sm mt-1">總體評分</div>
              </div>
            </div>

            {/* Copy Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={copyReport}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 
                           backdrop-blur-sm rounded-xl border border-white/20 text-white transition-all"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">已複製！</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>複製報告</span>
                  </>
                )}
              </button>
            </div>

            {/* SEO Analysis */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-400" />
                SEO 分析
              </h2>
              
              <div className="space-y-4">
                {/* Title */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">標題 (Title)</div>
                  <div className="text-white">{result.seo.title || '未設定'}</div>
                  <div className="text-slate-500 text-xs mt-1">
                    {result.seo.titleLength} 字元 
                    {result.seo.titleLength >= 30 && result.seo.titleLength <= 60 
                      ? ' ✅ 長度適中' 
                      : ' ⚠️ 建議 30-60 字元'}
                  </div>
                </div>

                {/* Meta Description */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">Meta Description</div>
                  <div className="text-white text-sm">{result.seo.metaDescription || '未設定'}</div>
                  <div className="text-slate-500 text-xs mt-1">
                    {result.seo.metaDescriptionLength} 字元
                    {result.seo.metaDescriptionLength >= 120 && result.seo.metaDescriptionLength <= 160 
                      ? ' ✅ 長度適中' 
                      : ' ⚠️ 建議 120-160 字元'}
                  </div>
                </div>

                {/* Headings */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-2">標題結構</div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className={`text-2xl font-bold ${result.seo.h1.length === 1 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {result.seo.h1.length}
                      </div>
                      <div className="text-slate-500 text-xs">H1</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{result.seo.h2.length}</div>
                      <div className="text-slate-500 text-xs">H2</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400">{result.seo.h3.length}</div>
                      <div className="text-slate-500 text-xs">H3</div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <Image className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <div className="text-white font-medium">{result.seo.images.length}</div>
                    <div className="text-slate-500 text-xs">圖片</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <Link2 className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <div className="text-white font-medium">{result.seo.internalLinks}</div>
                    <div className="text-slate-500 text-xs">內部連結</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <Globe className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <div className="text-white font-medium">{result.seo.externalLinks}</div>
                    <div className="text-slate-500 text-xs">外部連結</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <FileText className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <div className="text-white font-medium">{result.seo.wordCount}</div>
                    <div className="text-slate-500 text-xs">字數</div>
                  </div>
                </div>

                {/* Technical */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-2">技術設定</div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs ${result.seo.canonical ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      Canonical {result.seo.canonical ? '✓' : '✗'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs ${result.seo.ogTitle ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      Open Graph {result.seo.ogTitle ? '✓' : '✗'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs ${result.seo.hasSchema ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      Schema {result.seo.hasSchema ? '✓' : '✗'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs ${result.seo.viewport ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      Viewport {result.seo.viewport ? '✓' : '✗'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs ${result.seo.language ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      Lang: {result.seo.language || '未設定'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* GEO Analysis */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-purple-400" />
                GEO 分析 (AI 搜尋優化)
              </h2>
              
              <div className="space-y-4">
                {/* Content Structure */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-3">內容結構</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${result.geo.hasLists ? 'bg-green-500/20' : 'bg-slate-500/20'}`}>
                      <List className={`w-4 h-4 ${result.geo.hasLists ? 'text-green-400' : 'text-slate-400'}`} />
                      <span className={`text-sm ${result.geo.hasLists ? 'text-green-400' : 'text-slate-400'}`}>清單</span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${result.geo.hasTables ? 'bg-green-500/20' : 'bg-slate-500/20'}`}>
                      <Table className={`w-4 h-4 ${result.geo.hasTables ? 'text-green-400' : 'text-slate-400'}`} />
                      <span className={`text-sm ${result.geo.hasTables ? 'text-green-400' : 'text-slate-400'}`}>表格</span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${result.geo.hasFAQ ? 'bg-green-500/20' : 'bg-slate-500/20'}`}>
                      <HelpCircle className={`w-4 h-4 ${result.geo.hasFAQ ? 'text-green-400' : 'text-slate-400'}`} />
                      <span className={`text-sm ${result.geo.hasFAQ ? 'text-green-400' : 'text-slate-400'}`}>FAQ</span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${result.geo.hasNumberedSteps ? 'bg-green-500/20' : 'bg-slate-500/20'}`}>
                      <Zap className={`w-4 h-4 ${result.geo.hasNumberedSteps ? 'text-green-400' : 'text-slate-400'}`} />
                      <span className={`text-sm ${result.geo.hasNumberedSteps ? 'text-green-400' : 'text-slate-400'}`}>步驟</span>
                    </div>
                  </div>
                </div>

                {/* AI Friendliness */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-3">AI 友善度指標</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">內容清晰度</span>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        result.geo.contentClarity === 'high' ? 'bg-green-500/20 text-green-400' :
                        result.geo.contentClarity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {result.geo.contentClarity === 'high' ? '高' : result.geo.contentClarity === 'medium' ? '中' : '低'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">可讀性</span>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        result.geo.readabilityScore === 'easy' ? 'bg-green-500/20 text-green-400' :
                        result.geo.readabilityScore === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {result.geo.readabilityScore === 'easy' ? '易讀' : result.geo.readabilityScore === 'medium' ? '中等' : '較難'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">內容深度</span>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        result.geo.contentDepth === 'deep' ? 'bg-green-500/20 text-green-400' :
                        result.geo.contentDepth === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {result.geo.contentDepth === 'deep' ? '深入' : result.geo.contentDepth === 'medium' ? '中等' : '淺層'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">有總結摘要</span>
                      <span className={`px-3 py-1 rounded-full text-xs ${result.geo.hasSummary ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                        {result.geo.hasSummary ? '是' : '否'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">引用來源</span>
                      <span className="text-white">{result.geo.citationIndicators} 處</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  改善建議
                </h2>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <span className="text-slate-500">{i + 1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-8">
          Made with ❤️ by 廖小雄 🐻
        </p>
      </div>
    </div>
  );
}
