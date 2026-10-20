// Plain text of an HTML string: no tags/scripts/styles, entities decoded, whitespace collapsed.
const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘',
  rdquo: '”', ldquo: '“', hellip: '…', middot: '·', rarr: '→', larr: '←', uuml: 'ü', ouml: 'ö', auml: 'ä', Uuml: 'Ü',
  Ouml: 'Ö', Auml: 'Ä', szlig: 'ß', eacute: 'é', copy: '©', times: '×', minus: '−', bull: '•', sect: '§', euro: '€' };
export function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => NAMED[n] ?? m)
    .replace(/\s+/g, ' ')
    .trim();
}
export function mainOf(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  return m ? m[1] : '';
}
