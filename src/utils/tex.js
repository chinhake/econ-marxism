import katex from 'katex'

// 解码 HTML 实体（数学片段里可能带 &lt; &gt; 等，传给 katex 前需还原）
function decodeEntities(s) {
  const map = { lt: '<', gt: '>', amp: '&', quot: '"', '#39': "'", nbsp: ' ' }
  return s.replace(/&(lt|gt|amp|quot|#39|nbsp);/g, (m, k) => map[k])
}

// 匹配 $$...$$（独立行）或 $...$（行内），顺序：display 优先
const MATH_RE = /(\$\$[^$]+\$\$|\$[^$]+\$)/g

/**
 * 把 HTML 字符串中的 $...$ / $$...$$ 数学片段渲染为 KaTeX 输出，
 * 其余内容原样保留。数据里没有 $ 时直接原样返回（零开销）。
 */
export function renderMath(html) {
  if (!html || !html.includes('$')) return html
  return html.split(MATH_RE).map((part) => {
    if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
      return katex.renderToString(decodeEntities(part.slice(2, -2)), {
        throwOnError: false,
        strict: false,
        displayMode: true,
      })
    }
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      return katex.renderToString(decodeEntities(part.slice(1, -1)), {
        throwOnError: false,
        strict: false,
      })
    }
    return part
  }).join('')
}
