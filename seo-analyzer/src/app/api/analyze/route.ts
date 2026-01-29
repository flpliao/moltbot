import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

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

export async function POST(request: NextRequest): Promise<NextResponse<AnalysisResult>> {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ success: false, error: '請輸入網址' });
    }

    // Validate URL
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json({ success: false, error: '無效的網址格式' });
    }

    // Fetch the page
    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOAnalyzer/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        error: `無法獲取頁面 (HTTP ${response.status})` 
      });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // SEO Analysis
    const title = $('title').text().trim() || null;
    const metaDescription = $('meta[name="description"]').attr('content') || null;
    
    const h1: string[] = [];
    const h2: string[] = [];
    const h3: string[] = [];
    
    $('h1').each((_, el) => h1.push($(el).text().trim()));
    $('h2').each((_, el) => h2.push($(el).text().trim()));
    $('h3').each((_, el) => h3.push($(el).text().trim()));

    const images: { src: string; alt: string | null }[] = [];
    $('img').each((_, el) => {
      images.push({
        src: $(el).attr('src') || '',
        alt: $(el).attr('alt') || null,
      });
    });

    let internalLinks = 0;
    let externalLinks = 0;
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (href.startsWith('http') && !href.includes(validUrl.hostname)) {
        externalLinks++;
      } else if (href.startsWith('/') || href.includes(validUrl.hostname)) {
        internalLinks++;
      }
    });

    // Word count (approximate)
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = bodyText.split(/\s+/).filter(w => w.length > 0).length;

    // Schema detection
    const schemaScripts: string[] = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || '{}');
        if (json['@type']) {
          schemaScripts.push(json['@type']);
        }
      } catch {
        // Invalid JSON
      }
    });

    const seo: SEOAnalysis = {
      url: validUrl.toString(),
      title,
      titleLength: title?.length || 0,
      metaDescription,
      metaDescriptionLength: metaDescription?.length || 0,
      h1,
      h2,
      h3,
      images,
      imagesWithoutAlt: images.filter(img => !img.alt).length,
      internalLinks,
      externalLinks,
      wordCount,
      canonical: $('link[rel="canonical"]').attr('href') || null,
      ogTitle: $('meta[property="og:title"]').attr('content') || null,
      ogDescription: $('meta[property="og:description"]').attr('content') || null,
      ogImage: $('meta[property="og:image"]').attr('content') || null,
      hasSchema: schemaScripts.length > 0,
      schemaTypes: schemaScripts,
      robots: $('meta[name="robots"]').attr('content') || null,
      viewport: $('meta[name="viewport"]').attr('content') || null,
      language: $('html').attr('lang') || null,
    };

    // GEO Analysis
    const hasLists = $('ul, ol').length > 0;
    const hasTables = $('table').length > 0;
    const hasFAQ = $('[itemtype*="FAQPage"]').length > 0 || 
                   bodyText.toLowerCase().includes('常見問題') ||
                   bodyText.toLowerCase().includes('faq') ||
                   (h2.some(h => h.includes('?') || h.includes('？')));
    
    const hasDefinitions = $('dl, dfn, abbr').length > 0;
    const hasSummary = bodyText.toLowerCase().includes('總結') ||
                       bodyText.toLowerCase().includes('結論') ||
                       bodyText.toLowerCase().includes('摘要') ||
                       bodyText.toLowerCase().includes('summary') ||
                       bodyText.toLowerCase().includes('conclusion');
    
    const hasNumberedSteps = $('ol').length > 0 || 
                             /步驟\s*[1-9一二三四五六七八九十]/.test(bodyText) ||
                             /step\s*[1-9]/i.test(bodyText);

    // Count questions in content
    const questionCount = (bodyText.match(/[?？]/g) || []).length;

    // Citation indicators
    const citationIndicators = (bodyText.match(/根據|研究顯示|調查指出|according to|study shows|research indicates/gi) || []).length +
                               $('a[href*="doi.org"], a[href*="pubmed"], cite, blockquote').length;

    // Content clarity (based on structure)
    let clarityScore = 0;
    if (h1.length === 1) clarityScore += 2;
    if (h2.length >= 2) clarityScore += 2;
    if (hasLists) clarityScore += 1;
    if (hasTables) clarityScore += 1;
    if (metaDescription) clarityScore += 1;
    
    const contentClarity: 'high' | 'medium' | 'low' = 
      clarityScore >= 5 ? 'high' : clarityScore >= 3 ? 'medium' : 'low';

    // Readability (simplified check based on sentence length)
    const sentences = bodyText.split(/[.。!！?？]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.length > 0 
      ? bodyText.length / sentences.length 
      : 0;
    const readabilityScore: 'easy' | 'medium' | 'hard' = 
      avgSentenceLength < 50 ? 'easy' : avgSentenceLength < 100 ? 'medium' : 'hard';

    // Entity clarity (proper nouns, names, specific terms)
    const entityClarity: 'high' | 'medium' | 'low' = 
      seo.hasSchema && schemaScripts.length >= 2 ? 'high' :
      seo.hasSchema ? 'medium' : 'low';

    // Content depth
    const contentDepth: 'shallow' | 'medium' | 'deep' = 
      wordCount > 2000 && h2.length >= 5 ? 'deep' :
      wordCount > 800 && h2.length >= 2 ? 'medium' : 'shallow';

    const geo: GEOAnalysis = {
      hasStructuredContent: hasLists || hasTables || h2.length >= 2,
      hasFAQ,
      hasLists,
      hasTables,
      hasDefinitions,
      contentClarity,
      hasSummary,
      hasNumberedSteps,
      questionCount,
      citationIndicators,
      readabilityScore,
      entityClarity,
      contentDepth,
    };

    // Calculate scores
    let seoScore = 0;
    if (title && seo.titleLength >= 30 && seo.titleLength <= 60) seoScore += 15;
    else if (title) seoScore += 8;
    if (metaDescription && seo.metaDescriptionLength >= 120 && seo.metaDescriptionLength <= 160) seoScore += 15;
    else if (metaDescription) seoScore += 8;
    if (h1.length === 1) seoScore += 10;
    if (h2.length >= 2) seoScore += 10;
    if (seo.imagesWithoutAlt === 0 && images.length > 0) seoScore += 10;
    else if (seo.imagesWithoutAlt < images.length / 2) seoScore += 5;
    if (seo.canonical) seoScore += 5;
    if (seo.ogTitle && seo.ogDescription) seoScore += 10;
    if (seo.hasSchema) seoScore += 15;
    if (seo.viewport) seoScore += 5;
    if (seo.language) seoScore += 5;

    let geoScore = 0;
    if (geo.hasStructuredContent) geoScore += 15;
    if (geo.hasFAQ) geoScore += 15;
    if (geo.hasLists) geoScore += 10;
    if (geo.hasTables) geoScore += 5;
    if (geo.hasSummary) geoScore += 10;
    if (geo.hasNumberedSteps) geoScore += 10;
    if (geo.contentClarity === 'high') geoScore += 15;
    else if (geo.contentClarity === 'medium') geoScore += 8;
    if (geo.readabilityScore === 'easy') geoScore += 10;
    else if (geo.readabilityScore === 'medium') geoScore += 5;
    if (geo.citationIndicators > 0) geoScore += 10;
    if (geo.contentDepth === 'deep') geoScore += 10;
    else if (geo.contentDepth === 'medium') geoScore += 5;

    // Generate recommendations
    const recommendations: string[] = [];
    
    // SEO recommendations
    if (!title) recommendations.push('❌ 缺少頁面標題 (Title Tag)');
    else if (seo.titleLength < 30) recommendations.push('⚠️ 標題太短，建議 30-60 字元');
    else if (seo.titleLength > 60) recommendations.push('⚠️ 標題太長，可能被截斷');
    
    if (!metaDescription) recommendations.push('❌ 缺少 Meta Description');
    else if (seo.metaDescriptionLength < 120) recommendations.push('⚠️ Meta Description 太短，建議 120-160 字元');
    else if (seo.metaDescriptionLength > 160) recommendations.push('⚠️ Meta Description 太長，可能被截斷');
    
    if (h1.length === 0) recommendations.push('❌ 缺少 H1 標題');
    else if (h1.length > 1) recommendations.push('⚠️ 有多個 H1 標題，建議只保留一個');
    
    if (h2.length === 0) recommendations.push('⚠️ 缺少 H2 子標題，影響內容結構');
    
    if (seo.imagesWithoutAlt > 0) {
      recommendations.push(`⚠️ ${seo.imagesWithoutAlt} 張圖片缺少 Alt 屬性`);
    }
    
    if (!seo.canonical) recommendations.push('💡 建議添加 Canonical URL');
    if (!seo.ogTitle || !seo.ogDescription) recommendations.push('💡 建議完善 Open Graph 標籤');
    if (!seo.hasSchema) recommendations.push('💡 建議添加 Schema 結構化資料');
    if (!seo.language) recommendations.push('💡 建議在 HTML 標籤添加 lang 屬性');

    // GEO recommendations
    if (!geo.hasStructuredContent) recommendations.push('🤖 GEO: 建議增加結構化內容（清單、表格）');
    if (!geo.hasFAQ) recommendations.push('🤖 GEO: 建議添加 FAQ 常見問題區塊');
    if (!geo.hasSummary) recommendations.push('🤖 GEO: 建議添加總結/摘要段落');
    if (geo.contentClarity === 'low') recommendations.push('🤖 GEO: 內容結構需要改善，增加小標題');
    if (geo.readabilityScore === 'hard') recommendations.push('🤖 GEO: 句子偏長，建議簡化以提高可讀性');
    if (geo.citationIndicators === 0) recommendations.push('🤖 GEO: 建議引用權威來源增加可信度');
    if (geo.contentDepth === 'shallow') recommendations.push('🤖 GEO: 內容深度不足，建議擴充更多細節');

    return NextResponse.json({
      success: true,
      seo,
      geo,
      score: {
        seo: Math.min(seoScore, 100),
        geo: Math.min(geoScore, 100),
        overall: Math.round((seoScore + geoScore) / 2),
      },
      recommendations,
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ 
      success: false, 
      error: '分析過程發生錯誤，請稍後再試' 
    });
  }
}
