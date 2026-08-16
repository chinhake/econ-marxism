// 测验数据分组工具（quizzes.md §7.1）：按章分组，保持书顺序，章内按 id 升序
export function groupQuizzesByChapter(quizzes) {
  const map = new Map()
  ;(quizzes || []).forEach(q => {
    if (!map.has(q.chapter)) map.set(q.chapter, [])
    map.get(q.chapter).push(q)
  })
  return Array.from(map.entries()).map(([chapter, items]) => ({
    chapter,
    items: items.sort((a, b) => a.id - b.id),
  }))
}
