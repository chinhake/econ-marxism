// 测验数据校验脚本（严格按 quizzes.md 第 8 节执行）
// 运行：npm run check:quizzes
import appData from '../src/data/appData.js'

const { concepts, quizzes } = appData
const errors = []
const warns = []
const chapterSet = new Set(concepts.map(c => c.chapter))
const conceptById = new Map(concepts.map(c => [c.id, c]))
let chapterCounts = {}

if (!Array.isArray(quizzes)) {
  errors.push('quizzes 不存在或不是数组')
} else {
  // 1. 存在且非空；题量按各章已确认方案，不设全局固定数
  if (quizzes.length === 0) errors.push('quizzes 为空')
  warns.push(`当前共 ${quizzes.length} 题（题量按各章已确认方案）`)

  // 2. id 唯一且为 1..n 连续整数
  const ids = quizzes.map(q => q.id)
  for (let i = 1; i <= quizzes.length; i++) {
    if (!ids.includes(i)) errors.push(`id ${i} 缺失`)
  }
  if (new Set(ids).size !== ids.length) errors.push('id 存在重复')

  // 3. 每章至少 1 题；chapter 均存在于 concepts
  chapterCounts = {}
  quizzes.forEach((q, i) => {
    const tag = `题${i + 1}(id=${q.id})`
    if (!chapterSet.has(q.chapter)) errors.push(`${tag}: chapter "${q.chapter}" 不存在于 concepts`)
    chapterCounts[q.chapter] = (chapterCounts[q.chapter] || 0) + 1
  })
  for (const [ch, n] of Object.entries(chapterCounts)) {
    if (n < 1) errors.push(`章节 "${ch}" 无题目`)
  }

  // 4-6. 逐题结构检查
  quizzes.forEach((q, i) => {
    const tag = `题${i + 1}(id=${q.id})`
    if (!Array.isArray(q.options) || q.options.length !== 4) errors.push(`${tag}: options 数量不是 4`)
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) errors.push(`${tag}: answer 非法（应为 0~3 整数）`)
    if (Array.isArray(q.options)) {
      if (new Set(q.options).size !== q.options.length) errors.push(`${tag}: options 存在重复`)
      const correct = q.options[q.answer]
      if (correct !== undefined && q.options.filter(o => o === correct).length > 1) errors.push(`${tag}: 正确项与其他选项重复`)
    }
    for (const field of ['question', 'explanation']) {
      const v = q[field]
      if (typeof v !== 'string' || !v.trim()) errors.push(`${tag}: ${field} 为空`)
      if (typeof v === 'string' && (v.includes('$') || v.includes('<') || v.includes('>'))) {
        errors.push(`${tag}: ${field} 含禁用字符 $ < >`)
      }
    }
    if (Array.isArray(q.options)) {
      q.options.forEach((o, j) => {
        if (typeof o !== 'string' || !o.trim()) errors.push(`${tag}: 选项${j + 1} 为空`)
        if (typeof o === 'string' && (o.includes('$') || o.includes('<') || o.includes('>'))) {
          errors.push(`${tag}: 选项${j + 1} 含禁用字符 $ < >`)
        }
      })
    }
    if (!conceptById.has(q.concept_id)) {
      errors.push(`${tag}: concept_id ${q.concept_id} 不存在于 concepts`)
    } else {
      const c = conceptById.get(q.concept_id)
      if (c.chapter !== q.chapter) errors.push(`${tag}: chapter 与概念 ${q.concept_id} 不一致`)
      if (c.section !== q.section) errors.push(`${tag}: section 与概念 ${q.concept_id} 不一致`)
    }
  })

  // 7. question 互不重复
  const qs = quizzes.map(q => q.question)
  if (new Set(qs).size !== qs.length) errors.push('存在重复的 question')
}

if (errors.length) {
  console.error('❌ 校验失败：')
  errors.forEach(e => console.error('  - ' + e))
  process.exit(1)
}

warns.forEach(w => console.warn('⚠️  ' + w))
const chapterNames = Object.keys(chapterCounts).length
console.log(`✅ 校验通过：${quizzes.length} 题 / ${chapterNames} 个章节`)
