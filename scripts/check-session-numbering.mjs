// Cổng số buổi của CSC14003.
//
// Viết sau ADR-0018 (tách Buổi 3 thành ba buổi, dời b4–b11 lên hai số). Đợt đó lộ ra rằng số
// buổi nằm rải ở nhiều chỗ chép tay — tiêu đề phần trong part-tests, testDesc trong index,
// và hàng chục câu văn nhắc tới buổi khác. `check_i18n.py` chỉ so VI↔EN nên khi CẢ HAI bản
// cùng sai (bản EN dịch trung thành một bản VI đã cũ) thì nó im lặng. Bốn lỗi kiểu đó lọt
// qua mọi cổng máy móc và phải nhờ giám khảo đọc mới thấy.
//
// File này canh phần CƠ HỌC của chuyện đó: mọi số buổi SUY RA ĐƯỢC từ data phải khớp data.
//
// GIỚI HẠN — đọc kỹ trước khi tin nó:
// bốn chỗ khó nhất của đợt ADR-0018 đều là VĂN XUÔI, không phải trường dữ liệu, nên script
// này KHÔNG bắt được cái nào:
//   · «buổi 5 gọi tên nó thành “tìm kiếm đối kháng”» — giữa một đoạn `ch6.s17` của bài 2
//   · «Buổi 3 bạn sẽ tự tay cài cả bảy cách»        — giữa `TOPICS[0].d` của intro-ai
//   · «Naïve Bayes ở Buổi 10»                        — trong `ex` của một câu kiểm tra
//   · tên buổi 3 trong `hw.s6`                       — chép tay, lệch với index.ts
// `check_i18n.py` cũng không bắt được, vì khi bản VI sai và bản EN dịch trung thành theo thì
// multiset chữ số hai bên vẫn bằng nhau. Đánh số buổi dịch chỗ thì vẫn phải soi bằng mắt —
// xem dòng "số thứ tự buổi" trong bảng của CLAUDE.md.
import assert from 'node:assert/strict';
import { createServer } from 'vite';

// `topics.ts` kéo theo `lib/locale.ts`, mà file đó đọc `location` / `localStorage` ngay ở
// module scope (hằng số LOCALE quyết trước khi React mount — ADR-0010). Dựng tạm hai global
// tối thiểu để nạp được ngoài trình duyệt; script này chỉ đọc data, không phụ thuộc locale.
globalThis.location ??= { pathname: '/learn-ai-with-me/', search: '', href: 'http://localhost/' };
globalThis.localStorage ??= { getItem: () => null, setItem: () => {} };
globalThis.navigator ??= { languages: ['vi'], language: 'vi' };
globalThis.history ??= { replaceState: () => {}, pushState: () => {} };
globalThis.document ??= { documentElement: { lang: '' } };

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
let checks = 0;
const check = (name, fn) => { fn(); checks++; console.log('✓ ' + name); };

try {
  const { csc14003: vi } = await server.ssrLoadModule('/src/content/courses/csc14003/index.ts');
  const { csc14003en: en } = await server.ssrLoadModule('/src/content/courses/csc14003/index.en.ts');
  const { PART_TESTS: TVI } = await server.ssrLoadModule('/src/content/courses/csc14003/part-tests.ts');
  const { PART_TESTS_EN: TEN } = await server.ssrLoadModule('/src/content/courses/csc14003/part-tests.en.ts');
  const { TOPIC_IDS } = await server.ssrLoadModule('/src/content/courses/csc14003/topics.ts');

  const ids = vi.sessions.map((s) => s.id);
  const weekOf = Object.fromEntries(vi.sessions.map((s) => [s.id, s.week]));

  check('tuần chạy liên tục 1..N và Course.weeks khớp buổi cuối', () => {
    const weeks = vi.sessions.map((s) => s.week);
    assert.deepEqual(weeks, weeks.map((_, i) => i + 1), 'tuần phải là 1..N không đứt quãng');
    assert.equal(vi.weeks, weeks[weeks.length - 1]);
    assert.equal(en.weeks, vi.weeks);
  });

  check('mỗi buổi có một topic id cùng tên trong TOPIC_IDS', () => {
    for (const id of ids) assert.ok(TOPIC_IDS.includes(id), `thiếu topic id '${id}'`);
  });

  check('câu kiểm tra tổng hợp chỉ tag buổi thuộc đúng phần của nó', () => {
    for (const [pi, part] of TVI.entries()) {
      const belongs = vi.sessions.filter((s) => s.part === pi).map((s) => s.id);
      for (const q of part.qs) {
        assert.ok(ids.includes(q.topicId), `phần ${pi}: topicId '${q.topicId}' không phải buổi nào`);
        assert.ok(belongs.includes(q.topicId),
          `phần ${pi} (${part.tabLabel}) có câu tag '${q.topicId}', nhưng buổi đó thuộc phần khác`);
      }
    }
  });

  check('tiêu đề phần trong part-tests khớp khoảng tuần thật của phần', () => {
    for (const [pi, part] of TVI.entries()) {
      const ws = vi.sessions.filter((s) => s.part === pi).map((s) => s.week);
      const want = `${Math.min(...ws)}–${Math.max(...ws)}`;
      for (const [lang, title] of [['vi', part.title], ['en', TEN[pi].title]]) {
        const m = title.match(/(\d+)[–-](\d+)/);
        assert.ok(m, `${lang} phần ${pi}: tiêu đề không mang khoảng buổi — «${title}»`);
        assert.equal(`${m[1]}–${m[2]}`, want,
          `${lang} phần ${pi}: tiêu đề ghi ${m[1]}–${m[2]} nhưng phần này là buổi ${want} — «${title}»`);
      }
    }
  });

  check('Part.range và testDesc trong index khớp cùng khoảng tuần đó', () => {
    for (const [pi, part] of vi.parts.entries()) {
      const ws = vi.sessions.filter((s) => s.part === pi).map((s) => s.week);
      const want = `${Math.min(...ws)}–${Math.max(...ws)}`;
      for (const [lang, p] of [['vi', part], ['en', en.parts[pi]]]) {
        for (const [field, text] of [['range', p.range], ['testDesc', p.testDesc]]) {
          const m = text.match(/(\d+)[–-](\d+)/);
          assert.ok(m, `${lang} phần ${pi}.${field}: không mang khoảng tuần — «${text}»`);
          assert.equal(`${m[1]}–${m[2]}`, want,
            `${lang} phần ${pi}.${field}: ghi ${m[1]}–${m[2]} nhưng phần này là tuần ${want}`);
        }
      }
    }
  });

  check('số câu mỗi phần khớp con số testDesc hứa', () => {
    for (const [pi, part] of TVI.entries()) {
      assert.equal(TEN[pi].qs.length, part.qs.length, `phần ${pi}: VI/EN lệch số câu`);
      const promised = Number(vi.parts[pi].testDesc.match(/^(\d+) câu/)?.[1]);
      assert.equal(part.qs.length, promised,
        `phần ${pi}: testDesc hứa ${promised} câu, bộ đề có ${part.qs.length}`);
    }
  });

  check('tiêu đề buổi mang đúng số buổi của nó ở cả hai bản', () => {
    for (const s of vi.sessions) {
      const n = s.title.match(/Buổi (\d+)/)?.[1];
      assert.equal(Number(n), weekOf[s.id], `«${s.title}» nhưng buổi này ở tuần ${weekOf[s.id]}`);
    }
    for (const s of en.sessions) {
      const n = s.title.match(/Session (\d+)/)?.[1];
      assert.equal(Number(n), weekOf[s.id], `«${s.title}» nhưng buổi này ở tuần ${weekOf[s.id]}`);
    }
  });

  check('buổi nào khai lessonPath thì đường dẫn phải mang đúng id', () => {
    for (const s of vi.sessions) {
      if (!s.lessonPath) continue;
      assert.equal(s.lessonPath, `/courses/csc14003/lessons/${s.id}`);
    }
  });

  console.log(`${checks} session-numbering checks passed.`);
} finally {
  await server.close();
}
