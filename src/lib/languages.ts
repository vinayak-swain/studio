/**
 * Utility for detecting languages based on file extensions and calculating stats.
 */

export interface LanguageInfo {
  name: string;
  color: string;
  extension: string;
}

export const LANGUAGE_MAP: Record<string, LanguageInfo> = {
  '.ts': { name: 'TypeScript', color: 'bg-blue-500', extension: '.ts' },
  '.tsx': { name: 'TypeScript', color: 'bg-blue-500', extension: '.tsx' },
  '.js': { name: 'JavaScript', color: 'bg-yellow-500', extension: '.js' },
  '.jsx': { name: 'JavaScript', color: 'bg-yellow-500', extension: '.jsx' },
  '.py': { name: 'Python', color: 'bg-green-500', extension: '.py' },
  '.html': { name: 'HTML', color: 'bg-orange-500', extension: '.html' },
  '.css': { name: 'CSS', color: 'bg-indigo-500', extension: '.css' },
  '.md': { name: 'Markdown', color: 'bg-gray-400', extension: '.md' },
  '.json': { name: 'JSON', color: 'bg-yellow-600', extension: '.json' },
  '.java': { name: 'Java', color: 'bg-red-600', extension: '.java' },
  '.cpp': { name: 'C++', color: 'bg-pink-600', extension: '.cpp' },
  '.go': { name: 'Go', color: 'bg-cyan-500', extension: '.go' },
  '.rs': { name: 'Rust', color: 'bg-orange-700', extension: '.rs' },
};

export function getLanguageByPath(path: string): LanguageInfo | null {
  const ext = path.substring(path.lastIndexOf('.')).toLowerCase();
  return LANGUAGE_MAP[ext] || null;
}

export function calculateLanguageStats(files: { path: string; content: string }[]) {
  if (!files || files.length === 0) return [];

  const stats: Record<string, { size: number; color: string }> = {};
  let totalSize = 0;

  files.forEach((file) => {
    const lang = getLanguageByPath(file.path);
    if (lang) {
      const size = file.content.length;
      if (!stats[lang.name]) {
        stats[lang.name] = { size: 0, color: lang.color };
      }
      stats[lang.name].size += size;
      totalSize += size;
    }
  });

  if (totalSize === 0) return [];

  return Object.entries(stats)
    .map(([name, data]) => ({
      name,
      color: data.color,
      percentage: ((data.size / totalSize) * 100).toFixed(1),
    }))
    .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
}
