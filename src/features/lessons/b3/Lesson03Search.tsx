import { Link } from 'react-router-dom';
import { CanvasScene } from '@/components/CanvasScene';
import { CheckList } from '@/components/CheckList';
import { Html } from '@/components/Html';
import { LessonNav } from '@/components/LessonNav';
import { MathPrimer, type MathTerm } from '@/components/MathPrimer';
import { Reveal } from '@/components/Reveal';
import { DeckToggle, LessonDeck, useDeckMode } from '@/components/LessonDeck';
import { SectionHead } from '@/components/SectionHead';
import { SessionQuiz } from '@/components/SessionQuiz';
import { INPUT_EX, OUTPUT_EX } from '@/content/courses/csc14003/lab-searching.js';
import { MATH_PRIMERS } from '@/content/courses/csc14003/math-primers.js';
import { drawGrow, drawHill } from './lesson03.scenes';
import { SearchLab } from './SearchLab';
import { Code, CodeLab, HELPER_PY, MAIN_PY } from './CodeLab';


interface Stat { k: string; v: string; cls?: string; bd?: string }
function AlgoCard({ color, abbr, name, en, chips, body, stats, children, border }: {
  color: string; abbr: string; name: string; en: string;
  chips: [string, 'cyan' | 'yellow' | 'plain'][];
  body: string; stats: Stat[]; children?: React.ReactNode; border?: string;
}) {
  const chipStyle = (kind: string): React.CSSProperties =>
    kind === 'cyan'
      ? { color: 'var(--cyan-soft)', borderColor: 'color-mix(in srgb, var(--cyan) 40%, transparent)' }
      : kind === 'yellow'
        ? { color: 'var(--yellow)', borderColor: 'color-mix(in srgb, var(--yellow) 40%, transparent)' }
        : { color: 'var(--muted)' };
  return (
    <Reveal className="card" style={{ marginTop: 16, padding: '24px 26px', borderColor: border }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span className="mono" style={{ fontWeight: 700, fontSize: 20, color }}>{abbr}</span>
        <span style={{ fontSize: 16, fontWeight: 600 }}>{name}</span>
        <span style={{ color: 'var(--faint)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>{en}</span>
        {chips.map(([label, kind]) => (
          <span key={label} className="chip chip--mono" style={{ fontSize: 11, ...chipStyle(kind) }}>{label}</span>
        ))}
      </div>
      <Html as="p" t={body} style={{ color: 'var(--text-2)', fontSize: 14.5, lineHeight: 1.75, margin: '14px 0 0', maxWidth: 860 }} />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
        {stats.map((s) => (
          <div key={s.k} className={`stat ${s.cls ?? ''}`} style={{ borderColor: s.bd }}>
            <div className="stat__k">{s.k}</div>
            <Html as="div" t={s.v} className="stat__v" />
          </div>
        ))}
      </div>
      {children}
      <div style={{ marginTop: 14, display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 13 }}>
        <a href="#lab">▶ Chạy từng bước trong Lab</a>
        <a href="#codelab">⌨ Pseudo-code + Python</a>
      </div>
    </Reveal>
  );
}

const NAV = [
          { href: '#toan', label: 'TOÁN NỀN' }, { href: '#ch1', label: '01 Agent' }, { href: '#ch2', label: '02 Bài toán' }, { href: '#ch3', label: '03 Khung' },
          { href: '#ch4', label: '04 Mù' }, { href: '#lab', label: 'LAB', hot: true }, { href: '#ch5', label: '05 Heuristic' },
          { href: '#ch6', label: '06 Leo đồi' }, { href: '#ch7', label: '07 Tổng kết' }, { href: '#codelab', label: '08 Code' }, { href: '#quiz', label: '09 Quiz', hot: true }, { href: '#hw', label: '10 Bài tập' },
];
const SLIDES = [{ id: 'hero', label: 'Bìa' }, ...NAV.map((n) => ({ id: n.href.slice(1), label: n.label }))];

export default function Lesson03Search() {
  const [deck, setDeck] = useDeckMode();
  return (
    <>
      <LessonNav badge="BUỔI 3" title="Tìm kiếm" backTo="/courses/csc14003"
        items={NAV}
        right={<DeckToggle on={deck} onChange={setDeck} />} />

      <LessonDeck on={deck} slides={SLIDES}>
        {/* Hero */}
        <div className="lesson-hero" style={{ background: 'radial-gradient(700px 340px at 72% 10%, var(--bg-glow), transparent)' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px 10px', display: 'flex', gap: 44, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 480px', minWidth: 320 }}>
              <div className="mono" style={{ fontSize: 12, letterSpacing: '1.5px', color: 'var(--yellow)' }}>CSC14003 · PART I — SEARCHING · ZERO → HERO</div>
              <h1 className="hero-title" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 52, lineHeight: 1.12, margin: '16px 0 0' }}>
                Giải bài toán<br />bằng <em style={{ color: 'var(--cyan)' }}>Tìm kiếm</em>
              </h1>
              <p style={{ color: 'var(--text-2)', fontSize: 15.5, lineHeight: 1.75, maxWidth: 600, margin: '20px 0 0', textWrap: 'pretty' }}>
                🧭 Bạn cần tới đích, mà thế giới thì có hàng triệu ngã rẽ. Làm sao? Buổi này mình đi từ số 0 — biến một đề bài lộn xộn thành đồ thị trạng thái gọn gàng — rồi leo lên tới mức tự tay cài cả 7 thuật toán tìm kiếm của Lab 1, chạy được, đo được time lẫn memory. Nghe hơi nhiều, nhưng tin tôi đi: bảy thuật toán này thật ra chỉ là MỘT vòng lặp thay ruột.
              </p>
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 27, whiteSpace: 'nowrap' }}>
                  <span style={{ color: 'var(--text-hi)' }}>f(n)</span><span style={{ color: 'var(--faint)' }}> = </span>
                  <span style={{ color: 'var(--cyan)' }}>g(n)</span><span style={{ color: 'var(--faint)' }}> + </span><span style={{ color: 'var(--yellow)' }}>h(n)</span>
                </span>
                <span className="chip" style={{ color: 'var(--cyan)', borderColor: 'color-mix(in srgb, var(--cyan) 35%, transparent)' }}>g — chi phí đã đi</span>
                <span className="chip" style={{ color: 'var(--yellow)', borderColor: 'color-mix(in srgb, var(--yellow) 35%, transparent)' }}>h — ước lượng còn lại</span>
              </div>
              <div style={{ marginTop: 22, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['9 mục học', 'Lab 1 — Searching', 'Quiz 03', '≈ 3,5 giờ'].map((t) => (
                  <span key={t} className="chip chip--mono" style={{ color: 'var(--muted-2)', fontSize: 11 }}>{t}</span>
                ))}
              </div>
            </div>
            <div data-anim style={{ flex: '0 1 400px', minWidth: 300, animation: 'mnFloat 7s ease-in-out infinite' }}>
              <svg viewBox="0 0 380 300" style={{ width: '100%', display: 'block' }}>
                {([[30, 150, 120, 62], [30, 150, 120, 238], [120, 62, 230, 42], [120, 62, 230, 258], [120, 238, 230, 258], [230, 42, 330, 150], [230, 258, 330, 150]] as const).map((l, i) => (
                  <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="#2A3242" strokeWidth="2" />
                ))}
                {([[30, 150, 120, 62], [120, 62, 230, 42], [230, 42, 330, 150]] as const).map((l, i) => (
                  <line key={'f' + i} data-anim x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="#58C4DD" strokeWidth="2.5" strokeDasharray="5 22" style={{ animation: 'mnFlow 1.5s linear infinite' }} />
                ))}
                <circle cx="30" cy="150" r="16" fill="#12151A" stroke="#F4D345" strokeWidth="2" />
                <circle cx="120" cy="62" r="15" fill="#12151A" stroke="#58C4DD" strokeWidth="2" />
                <circle cx="120" cy="238" r="15" fill="#12151A" stroke="#3A4254" strokeWidth="2" />
                <circle cx="230" cy="42" r="15" fill="#12151A" stroke="#58C4DD" strokeWidth="2" />
                <circle cx="230" cy="258" r="15" fill="#12151A" stroke="#3A4254" strokeWidth="2" />
                <circle cx="330" cy="150" r="16" fill="#12151A" stroke="#83C167" strokeWidth="2.5" />
                <circle cx="330" cy="150" r="23" fill="none" stroke="rgba(131,193,103,.5)" strokeWidth="1.2" strokeDasharray="4 4" />
                <text x="30" y="155" textAnchor="middle" fill="#F4D345" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>S</text>
                <text x="330" y="155" textAnchor="middle" fill="#83C167" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>G</text>
                <text x="120" y="67" textAnchor="middle" fill="#ECEFF4" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>a</text>
                <text x="120" y="243" textAnchor="middle" fill="#8B93A7" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>b</text>
                <text x="230" y="47" textAnchor="middle" fill="#ECEFF4" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>c</text>
                <text x="230" y="263" textAnchor="middle" fill="#8B93A7" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>d</text>
                <text x="52" y="128" fill="rgba(244,211,69,.75)" style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5 }}>h=6</text>
                <text x="140" y="48" fill="rgba(244,211,69,.75)" style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5 }}>h=4</text>
                <text x="250" y="30" fill="rgba(244,211,69,.75)" style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5 }}>h=2</text>
                <text x="305" y="122" fill="rgba(131,193,103,.8)" style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5 }}>h=0</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Toán nền — mở màn, không đánh số */}
        <div id="toan" className="lesson-section lesson-section--first">
          <MathPrimer {...(MATH_PRIMERS.b3 as { minutes: number; lead: string; terms: MathTerm[] })} />
        </div>

        {/* 01 */}
        <div id="ch1" className="lesson-section">
          <SectionHead no="01" title="Agent giải quyết vấn đề" en="Problem-solving agents"
            lead="Buổi 2 mình dừng ở agent phản xạ: thấy gì làm nấy, tra bảng là xong. Nhưng thử tình huống này xem — bạn đang ở Arad, phải có mặt ở Bucharest cho kịp chuyến bay. Nước đi đúng của <em>hôm nay</em> phụ thuộc vào cả chuỗi bước <em>ngày mai</em>, tra bảng kiểu gì cho nổi? Agent buộc phải <strong class='hl'>nghĩ trước</strong>: thử các chuỗi hành động trong đầu, chọn chuỗi nào dẫn tới đích. Nó có tên là problem-solving agent, và món võ của nó là <strong class='hl-cyan'>tìm kiếm</strong>." />
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 14, marginTop: 24 }}>
            {([
              ['var(--cyan)', 'BƯỚC 1 · GOAL FORMULATION', 'Chốt mục tiêu', "Chốt xem bạn muốn thế giới ở trạng thái nào: <span class='code-inline'>In(Bucharest)</span>. Có mục tiêu rồi thì vô số lựa chọn vô nghĩa tự động rụng hết — đó chính là công dụng của nó."],
              ['var(--cyan)', 'BƯỚC 2 · PROBLEM FORMULATION', 'Mô hình hóa', 'Chọn cách mô tả trạng thái và hành động sao cho đủ chi tiết để giải <em>được</em>, mà đủ trừu tượng để giải <em>nổi</em>. Thời tiết, bài hát đang bật, bạn đi cùng là ai — bỏ hết, không liên quan.'],
              ['var(--yellow)', 'BƯỚC 3 · SEARCH', 'Tìm kiếm', "Đây là phần máy làm: thử các chuỗi hành động trên <em>mô hình</em> cho tới khi vớ được chuỗi chạm đích. Chuỗi đó gọi là <strong class='hl-mid'>nghiệm (solution)</strong>."],
              ['var(--green)', 'BƯỚC 4 · EXECUTION', 'Thực thi', 'Cầm nghiệm đi thi hành, từng hành động một. Kiểu <em>vòng hở</em> (open-loop) — nhắm mắt đi cũng tới, vì đường đã tính sẵn hết rồi.'],
            ] as [string, string, string, string][]).map(([c, k, t, body]) => (
              <div key={k} className="card" style={{ padding: 20 }}>
                <div className="mono" style={{ fontSize: 11, color: c }}>{k}</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginTop: 8 }}>{t}</div>
                <Html as="p" t={body} style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.65, margin: '8px 0 0' }} />
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.15} className="card" style={{ marginTop: 16, padding: '16px 20px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="kicker">GIẢ ĐỊNH CỦA BUỔI NÀY</span>
            {['Quan sát đầy đủ', 'Rời rạc', 'Biết trước mô hình', 'Tất định'].map((t) => <span key={t} className="chip">{t}</span>)}
            <Html as="span" t="→ nhờ bốn giả định này mà nghiệm chỉ là một chuỗi hành động <em>cố định</em>. Thế giới lầy lội hơn thì để dành các buổi sau." style={{ fontSize: 13, color: 'var(--muted)' }} />
          </Reveal>
        </div>

        {/* 02 */}
        <div id="ch2" className="lesson-section">
          <SectionHead no="02" title="Một bài toán tìm kiếm gồm đúng 5 thứ" en="Problem formulation"
            lead="Tin vui: mọi đề bài — bản đồ, trò xếp hình, robot hút bụi, n quân hậu — đều nén được về đúng cùng một bộ 5 thứ. Viết ra được 5 thứ này là bạn giải xong một nửa bài rồi, phần còn lại chỉ là chọn thuật toán. Q1 của Quiz 03 kiểm tra đúng kỹ năng này, nên đừng đọc lướt." />
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginTop: 24 }}>
            {([
              ['1 · INITIAL STATE', 'Trạng thái xuất phát.', 'In(Arad)'],
              ['2 · ACTIONS(s)', 'Các hành động khả dụng tại s.', '{Go(Sibiu), Go(Timișoara), Go(Zerind)}'],
              ['3 · TRANSITION MODEL', 'RESULT(s, a): làm a tại s thì ra trạng thái nào.', 'Result(In(Arad), Go(Sibiu)) = In(Sibiu)'],
              ['4 · GOAL TEST', 'Kiểm tra một trạng thái có phải đích — tường minh, hoặc theo thuộc tính (chiếu hết!).', 's = In(Bucharest)?'],
              ['5 · PATH COST', 'Tổng chi phí bước c(s, a, s′) ≥ 0 dọc đường đi.', 'tổng km đã lăn bánh'],
            ] as [string, string, string][]).map(([k, body, ex]) => (
              <div key={k} className="card" style={{ padding: 18 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--cyan)' }}>{k}</div>
                <p style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.6, margin: '8px 0 0' }}>{body}</p>
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted-2)', marginTop: 8 }}>{ex}</div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.15}>
            <Html as="p" t="Gọi tên cho gọn: <strong class='hl'>nghiệm</strong> là một đường đi từ trạng thái đầu tới đích; <strong class='hl-green'>nghiệm tối ưu</strong> là cái rẻ nhất trong đám đó; còn <em>không gian trạng thái</em> là đồ thị gồm mọi trạng thái nối với nhau bằng hành động." style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7, margin: '16px 0 0', display: 'block' }} />
          </Reveal>
          <Reveal delay={0.2} style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
            <div className="card" style={{ padding: '18px 20px' }}>
              <span className="kicker">KÍCH THƯỚC KHÔNG GIAN — VÀI CON SỐ</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                {['8-puzzle: 9!/2 = 181.440 trạng thái', '15-puzzle: ~10¹³', '24-puzzle: ~10²⁵'].map((t) => <span key={t} className="chip">{t}</span>)}
                <span className="chip" style={{ color: 'var(--red)', borderColor: 'color-mix(in srgb, var(--red) 35%, transparent)' }}>sliding-block: NP-complete</span>
              </div>
              <Html as="p" t="Nhìn con số này rồi hãy tin tôi: 8 quân hậu mô hình kiểu ngây thơ ra 64·63···57 ≈ 1,8×10¹⁴ chuỗi. Mô hình khôn hơn một chút (đặt hậu vào cột trái nhất còn trống, không cho ăn nhau) — còn <strong class='hl-green'>2.057</strong>. Cùng một bài toán, khác nhau 11 chữ số. <em>Bạn mô hình hóa thế nào quyết định bài có giải nổi hay không.</em>" style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '12px 0 0' }} />
            </div>
            <div className="card" style={{ padding: '18px 20px' }}>
              <span className="kicker">KHÔNG GIAN TRẠNG THÁI ≠ CÂY TÌM KIẾM</span>
              <Html as="p" t="Chỗ này dễ nhầm nên nói kỹ: Romania có đúng 20 thành phố, nhưng cây tìm kiếm của nó có thể <strong class='hl-red'>vô hạn</strong> — vì chẳng có gì cấm bạn đi Arad → Sibiu → Arad → Sibiu → … tới già. Một trạng thái có thể nằm ở rất nhiều nút khác nhau trên cây. Cách xử lý mấy vòng lặp đó chính là ranh giới giữa tree-search và graph-search ở mục <a href='#ch3'>03</a>." style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
            </div>
          </Reveal>
        </div>

        {/* 03 */}
        <div id="ch3" className="lesson-section">
          <SectionHead no="03" title="Một khung, bảy thuật toán" en="Tree search · Graph search"
            lead="Đây là mục tôi thích nhất, vì nó biến bảy thuật toán nghe rất kêu thành một chuyện duy nhất. Tất cả chúng là <em>cùng một vòng lặp</em>, khác đúng một câu: <strong class='hl-yellow'>lấy nút nào ra khỏi frontier trước?</strong> Xếp hàng FIFO → BFS. Chồng đĩa LIFO → DFS. Rẻ nhất theo g → UCS. Trông gần đích nhất theo h → GBFS. Cân cả hai theo f → A*. Nhớ được câu hỏi này là bạn nhớ cả buổi." />
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 14, marginTop: 24 }}>
            <div className="canvas-panel">
              <div style={{ padding: '12px 18px', borderBottom: '1px solid #1E2430', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#97A0B5' }}>TREE-SEARCH — có thể lặp vô hạn</div>
              <Html as="div" t={`<pre class='codeblock' style='background:transparent'>frontier ← {nút gốc}
  loop:
    if frontier rỗng: return <span style='color:#FC6255'>failure</span>
    node ← POP(frontier)  <span style='color:#7A8399;font-style:italic'>▷ chiến lược = cách chọn nút này</span>
    if GOAL-TEST(node): return <span style='color:#83C167'>SOLUTION(node)</span>
    thêm các con của node vào frontier</pre>`} />
            </div>
            <div className="canvas-panel" style={{ borderColor: 'rgba(244,211,69,.3)' }}>
              <div style={{ padding: '12px 18px', borderBottom: '1px solid #1E2430', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#F4D345' }}>GRAPH-SEARCH — nhớ những gì đã mở</div>
              <Html as="div" t={`<pre class='codeblock' style='background:transparent'>frontier ← {nút gốc}; <span style='color:#F4D345'>explored ← ∅</span>
  loop:
    if frontier rỗng: return <span style='color:#FC6255'>failure</span>
    node ← POP(frontier)
    if GOAL-TEST(node): return <span style='color:#83C167'>SOLUTION(node)</span>
    <span style='color:#F4D345'>thêm node.STATE vào explored</span>
    thêm các con vào frontier <span style='color:#F4D345'>nếu state
    chưa nằm trong explored ∪ frontier</span> <span style='color:#7A8399;font-style:italic'>▷ chặn lặp</span></pre>`} />
            </div>
          </Reveal>
          <Reveal delay={0.15} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14, marginTop: 16 }}>
            <div className="card" style={{ padding: '18px 20px' }}>
              <span className="kicker">NÚT ≠ TRẠNG THÁI</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                {['STATE', 'PARENT', 'ACTION', 'PATH-COST g(n)'].map((t) => (
                  <span key={t} className="chip chip--mono" style={{ color: 'var(--cyan-soft)', borderColor: 'color-mix(in srgb, var(--cyan) 40%, transparent)' }}>{t}</span>
                ))}
              </div>
              <Html as="p" t="Hai thứ này nghe giống nhau nhưng khác hẳn: nhiều <em>nút</em> có thể cùng chứa một <em>trạng thái</em> (tới Sibiu bằng ba đường là ba nút). Cái con trỏ <strong class='hl-mid'>PARENT</strong> trông vô hại kia mới là thứ giúp bạn <em>lần ngược</em> ra đường đi — chính là hàm <span class='code-inline'>reconstruct()</span> bạn sắp viết trong Lab." style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
            </div>
            <div className="card" style={{ padding: '18px 20px' }}>
              <span className="kicker">VẾT DẦU LOANG</span>
              <Html as="p" t="Hình dung graph-search như vết dầu loang trên mặt nước 🌊 — nó chia không gian làm 3: <span style='color:var(--muted-2)'>explored (đã loang qua)</span> · <span class='hl-cyan'>frontier (mép sóng đang lan)</span> · phần chưa chạm tới. Điểm mấu chốt: mọi đường từ gốc muốn ra ngoài <em>bắt buộc</em> phải xuyên qua mép sóng. Nên bạn chọn lấy nút nào ở mép ra trước là bạn quyết định tất cả." style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
              <p style={{ color: 'var(--muted-2)', fontSize: 13, fontStyle: 'italic', lineHeight: 1.65, margin: '10px 0 0' }}>“Thuật toán nào quên lịch sử của mình sẽ phải lặp lại nó.”</p>
            </div>
          </Reveal>
          <Reveal delay={0.2} className="card" style={{ marginTop: 16, padding: '18px 20px' }}>
            <span className="kicker">KHUNG ĐÁNH GIÁ — DÙNG SUỐT 4 BUỔI TỚI</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 12, marginTop: 14 }}>
              {([
                ['Đầy đủ — complete?', 'Có nghiệm thì có chắc chắn tìm ra?'],
                ['Tối ưu — optimal?', 'Nghiệm trả về có rẻ nhất không?'],
                ['Thời gian', 'Sinh ra bao nhiêu nút?'],
                ['Bộ nhớ', 'Giữ bao nhiêu nút trong RAM cùng lúc?'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-hi)' }}>{k}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
              {['b — hệ số phân nhánh tối đa', 'd — độ sâu của nghiệm nông nhất', 'm — độ sâu tối đa của không gian'].map((t) => (
                <span key={t} className="chip chip--mono">{t}</span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* 04 — Tìm kiếm mù */}
        <div id="ch4" className="lesson-section">
          <SectionHead no="04" title="Tìm kiếm mù" en="Uninformed search — BFS · UCS · DFS · DLS · IDS"
            lead="“Mù” không phải lời chê đâu — nó chỉ có nghĩa là ngoài đề bài ra, thuật toán không biết thêm gì cả. Nó không đoán được nút nào hứa hẹn hơn nút nào, chỉ biết đúng một chuyện: “đây có phải đích chưa?”. Năm thuật toán dưới đây mù như nhau, khác nhau duy nhất ở <em>thứ tự mở nút</em>." />
          <AlgoCard color="var(--cyan)" abbr="BFS" name="Tìm theo chiều rộng" en="Breadth-first search"
            chips={[['frontier: FIFO queue', 'cyan'], ['dừng khi đích SINH RA', 'plain']]}
            body="Luôn mở nút <strong class='hl'>nông nhất</strong>. Nút mới đến xếp cuối hàng, nút chờ lâu nhất được gọi trước — đúng kiểu xếp hàng mua trà sữa. Cây vì thế lớn đều từng tầng một. Mẹo nhỏ: kiểm tra đích ngay lúc <em>sinh</em> nút con thay vì đợi lấy ra, bạn tiết kiệm được nguyên một tầng b nút."
            stats={[
              { k: 'ĐẦY ĐỦ', v: '✓ khi b hữu hạn', cls: 'stat--good' },
              { k: 'TỐI ƯU', v: '✓ khi mọi bước cùng giá', cls: 'stat--good' },
              { k: 'THỜI GIAN', v: 'O(b<sup>d</sup>)' },
              { k: 'BỘ NHỚ', v: 'O(b<sup>d</sup>) — RAM chết trước', cls: 'stat--bad stat--bad-b' },
            ]}>
            <div style={{ marginTop: 16, overflowX: 'auto' }}>
              <table className="dtable mono" style={{ fontSize: 12.5 }}>
                <tbody>
                  <tr style={{ color: 'var(--faint)' }}><td style={{ padding: '6px 10px' }}>độ sâu d</td><td style={{ padding: '6px 10px' }}>số nút</td><td style={{ padding: '6px 10px' }}>thời gian</td><td style={{ padding: '6px 10px' }}>bộ nhớ</td></tr>
                  {([['6', '10⁶', '1,1 giây', '1 GB', 'var(--text-2)'], ['10', '10¹⁰', '3 giờ', '10 TB', 'var(--text-2)'], ['12', '10¹²', '13 ngày', '1 PB', 'var(--red-soft)'], ['16', '10¹⁶', '350 năm', '10 EB', 'var(--red)']] as string[][]).map((row) => (
                    <tr key={row[0]} style={{ color: row[4] }}>
                      {row.slice(0, 4).map((c, j) => <td key={j} style={{ padding: '6px 10px', borderBottom: 'none' }}>{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 6, fontStyle: 'italic' }}>b = 10, tốc độ 1 triệu nút/giây, 1 kB/nút. Nhìn cột thời gian còn thấy gắng đợi được; nhìn cột bộ nhớ thì thôi 💀 — RAM luôn chết trước đồng hồ.</div>
            </div>
          </AlgoCard>
          <Reveal className="canvas-panel" style={{ marginTop: 16 }}>
            <div className="canvas-panel__head">
              <span className="canvas-panel__title">Vụ nổ hàm mũ — vì sao O(bᵈ) đáng sợ</span>
              <span className="canvas-panel__sub">mỗi tầng nhân thêm b lần; tầng cuối chiếm gần hết</span>
            </div>
            <CanvasScene height={250} draw={drawGrow} />
          </Reveal>
          <AlgoCard color="var(--green)" abbr="UCS" name="Chi phí đồng nhất" en="Uniform-cost search = Dijkstra"
            chips={[['frontier: priority queue theo g(n)', 'cyan'], ['dừng khi đích LẤY RA', 'yellow']]}
            body="BFS tối ưu <em>số cạnh</em> — mà ít cạnh đâu có nghĩa là rẻ, đi 2 chặng máy bay vẫn đắt hơn 5 chặng xe buýt. UCS sửa đúng chỗ đó: nó mở nút có <strong class='hl-cyan'>g(n) — chi phí thật từ gốc</strong> — nhỏ nhất. Có hai chi tiết mà tôi thấy sinh viên mất điểm nhiều nhất: <strong class='hl'>(1)</strong> UCS chỉ dừng khi đích được <em>lấy ra</em> khỏi hàng đợi, chứ không phải lúc sinh ra — vì lúc sinh ra, biết đâu còn đường rẻ hơn đang xếp hàng; <strong class='hl'>(2)</strong> gặp lại một nút bằng đường rẻ hơn thì phải <em>cập nhật</em> cha và khóa của nó (decrease-key). Đừng tin lời tôi, mở Manim Lab chạy UCS trên đồ thị Lab mà xem, cả hai đều xảy ra thật."
            stats={[
              { k: 'ĐẦY ĐỦ', v: '✓ khi chi phí bước ≥ ε', cls: 'stat--good' },
              { k: 'TỐI ƯU', v: '✓ với mọi hàm chi phí', cls: 'stat--good' },
              { k: 'THỜI GIAN', v: 'O(b<sup>1+⌊C*/ε⌋</sup>)' },
              { k: 'BỘ NHỚ', v: 'như thời gian' },
            ]}>
            <p style={{ color: 'var(--muted-2)', fontSize: 13, fontStyle: 'italic', margin: '12px 0 0' }}>Có lúc còn tệ hơn cả bᵈ: nó mải mê bò qua đủ thứ bước rẻ tiền trước khi chịu thử một đường thật sự có ích.</p>
          </AlgoCard>
          <AlgoCard color="var(--red)" abbr="DFS" name="Tìm theo chiều sâu" en="Depth-first search"
            chips={[['frontier: LIFO stack', 'cyan'], ['dừng khi đích SINH RA', 'plain']]}
            body="DFS là đứa liều: mở nút <strong class='hl'>sâu nhất</strong>, lao một mạch xuống đáy một nhánh, cụt đường mới chịu quay lui. Đừng mong tối ưu — nghiệm đầu tiên nó vớ được thường không phải nghiệm nông nhất. Nhưng nó có một thứ mà BFS thèm: <strong class='hl-green'>bộ nhớ</strong>. Nó chỉ giữ nhánh đang đi cùng mấy anh em chưa mở, O(bm) thôi; bản backtracking còn gọn nữa, O(m)."
            stats={[
              { k: 'ĐẦY ĐỦ', v: '✓ graph-search hữu hạn · ✗ tree-search', cls: 'stat--warn' },
              { k: 'TỐI ƯU', v: '✗', cls: 'stat--bad' },
              { k: 'THỜI GIAN', v: 'O(b<sup>m</sup>), m có thể ≫ d' },
              { k: 'BỘ NHỚ', v: 'O(bm) — lý do tồn tại', cls: 'stat--good stat--good-b' },
            ]}>
            <div className="panel-inner" style={{ padding: '16px 18px', borderRadius: 12, marginTop: 16 }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--red)' }}>HAI CÁCH CHỐNG LẶP — ĐỀ RA CÁI NÀO, TRACE CÁI ĐÓ</div>
              <Html as="p" t="Chỗ này tôi phải tách bạch ra, vì Quiz 03 câu 2 và câu 4 hỏi trúng nó, và hai cách cho <strong class='hl'>thứ tự expand khác nhau</strong>:" style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '8px 0 0' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 12, marginTop: 12 }}>
                <div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--cyan)' }}>NHỚ CẢ BẢN ĐỒ — EXPLORED SET</div>
                  <Html as="p" t="Ghé nút nào là cấm ghé lại, vĩnh viễn. Đây là bản trong code Python ở <a href='#codelab'>mục 08</a> — cái <span class='code-inline'>visited</span> chỉ có thêm, không bao giờ bớt. Đổi lại phải nhớ mọi trạng thái đã gặp." style={{ color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.65, margin: '6px 0 0' }} />
                </div>
                <div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--yellow)' }}>CHỈ NHỚ ĐƯỜNG ĐANG ĐI — PATH CHECK</div>
                  <Html as="p" t="Chỉ cấm gặp lại nút <em>nằm trên đường từ gốc xuống tới đây</em>; quay lui thì nhả nút ra khỏi trí nhớ — đúng dòng <span class='code-inline'>del visited[child]</span> trong code DLS. Bộ nhớ chỉ O(m)." style={{ color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.65, margin: '6px 0 0' }} />
                </div>
              </div>
              <Html as="p" t="Bản path check vẫn chặn được chuyện lượn vòng vô hạn trong không gian hữu hạn, nhưng nó cho phép bạn tới cùng một nút hai lần qua hai nhánh khác nhau — tức là <strong class='hl-mid'>vẫn sinh đường dư thừa</strong>, thứ mà explored set dẹp sạch. Còn nếu bản thân không gian trạng thái là vô hạn thì đừng trông mong gì: cả hai bản đều chết như nhau." style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '12px 0 0' }} />
            </div>
          </AlgoCard>
          <AlgoCard color="var(--purple)" abbr="DLS → IDS" name="Giới hạn độ sâu → Sâu dần từng nấc" en="Depth-limited · Iterative deepening"
            chips={[['DFS + trần ℓ = 0, 1, 2, …', 'cyan']]}
            body="<strong class='hl'>DLS</strong> chữa bệnh đi lạc mãi của DFS bằng cách đóng một cái trần: cấm đi sâu quá ℓ. Chạm trần thì trả về <em>cutoff</em> — nhớ phân biệt với <em>failure</em> là hết đường thật, hai chuyện khác nhau. Chọn ℓ bằng tri thức bài toán: Romania có 20 thành phố, hai thành phố bất kỳ cách nhau ≤ 9 bước, vậy ℓ = 9 là dư. Khổ nỗi ta thường <em>không biết trước</em> ℓ. Thế là <strong class='hl'>IDS</strong> làm cái việc nghe rất ngớ ngẩn: chạy DLS với ℓ = 0, rồi 1, rồi 2… tới khi đụng đích.<br/><br/>Phí phạm quá phải không? Tầng trên bị sinh đi sinh lại bao nhiêu lần. Nhưng đây là chỗ hàm mũ đứng về phía ta: tầng cuối cùng chiếm gần hết số nút, mấy tầng trên cộng lại chẳng đáng bao nhiêu. Cụ thể b = 10, d = 5 → IDS sinh 123.450 nút, BFS sinh 111.110, đội đúng <strong class='hl-green'>~11%</strong>. Trả 11% đó, bạn được bộ nhớ O(bd) của DFS cộng tính đầy đủ và tối ưu của BFS. Hời."
            stats={[
              { k: 'ĐẦY ĐỦ', v: '✓ khi b hữu hạn', cls: 'stat--good' },
              { k: 'TỐI ƯU', v: '✓ khi mọi bước cùng giá', cls: 'stat--good' },
              { k: 'THỜI GIAN', v: 'O(b<sup>d</sup>)' },
              { k: 'BỘ NHỚ', v: 'O(bd)', cls: 'stat--good stat--good-b' },
            ]}>
            <div className="panel-inner" style={{ padding: '16px 18px', borderRadius: 12, marginTop: 16 }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--purple)' }}>BỐN Ô TRÊN LÀ CỦA IDS — CÒN DLS ĐỨNG MỘT MÌNH THÌ SAO?</div>
              <Html as="p" t="Đừng gán nhầm thành tích. DLS một mình <strong class='hl-red'>hỏng cả hai đầu</strong>, mà hỏng theo hai kiểu ngược nhau, tùy bạn đặt trần ở đâu so với độ sâu nghiệm d:" style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '8px 0 0' }} />
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
                <div className="stat stat--bad"><div className="stat__k">ĐẦY ĐỦ</div><Html as="div" t="✗ khi ℓ &lt; d" className="stat__v" /></div>
                <div className="stat stat--bad"><div className="stat__k">TỐI ƯU</div><Html as="div" t="✗ khi ℓ &gt; d" className="stat__v" /></div>
                <div className="stat"><div className="stat__k">THỜI GIAN</div><Html as="div" t="O(b<sup>ℓ</sup>)" className="stat__v" /></div>
                <div className="stat"><div className="stat__k">BỘ NHỚ</div><Html as="div" t="O(bℓ)" className="stat__v" /></div>
              </div>
              <Html as="p" t="Trần thấp hơn nghiệm (ℓ &lt; d) thì nghiệm nằm ngay dưới đáy trần mà nó không với tới — <em>trượt</em>. Trần cao hơn nghiệm (ℓ &gt; d) thì nó vẫn lao xuống sâu theo kiểu DFS, nên rất dễ vớ một nghiệm sâu trước khi kịp thấy nghiệm nông — <em>mất tối ưu</em>. Còn hai ô thời gian và bộ nhớ thì vẫn y hệt DFS, chỉ thay m bằng ℓ; nói ngược lại cũng đúng: <strong class='hl-mid'>DFS chính là DLS với ℓ = ∞</strong>." style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '12px 0 0' }} />
            </div>
            <p style={{ color: 'var(--muted-2)', fontSize: 13, fontStyle: 'italic', margin: '12px 0 0' }}>Không biết chọn gì thì chọn IDS — nó là lựa chọn mặc định khi không gian lớn và bạn mù tịt về độ sâu nghiệm. Mở Lab chọn IDS rồi nhìn cái nhãn ℓ nhích dần lên ở góc canvas, sẽ thấy ngay nó làm gì.</p>
          </AlgoCard>
          <Reveal className="card" style={{ marginTop: 16, background: 'color-mix(in srgb, var(--cyan) 4%, transparent)', borderColor: 'color-mix(in srgb, var(--cyan) 25%, transparent)', padding: '16px 20px' }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--cyan)', letterSpacing: '.8px' }}>BONUS · BIDIRECTIONAL SEARCH</span>
            <Html as="p" t="Ý tưởng đơn giản mà hiệu quả kinh khủng: đào từ hai đầu, gặp nhau ở giữa. b<sup>d/2</sup> + b<sup>d/2</sup> ≪ b<sup>d</sup> — với b = 10, d = 6 thì là 2.000 nút thay vì 1.000.000. Cái giá: bạn phải biết cách đi <em>lùi</em> từ đích, và phải biết đích nằm ở đâu cho tường minh. Với đích kiểu “chiếu hết” thì chịu, biết chiếu hết ở thế cờ nào mà đào ngược." style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.7, margin: '8px 0 0' }} />
          </Reveal>
        </div>

        {/* LAB */}
        <div id="lab" className="lesson-section">
          <Reveal>
            <div className="sec-head">
              <span className="mono" style={{ color: 'var(--on-accent)', fontSize: 12, fontWeight: 700, background: 'var(--yellow)', borderRadius: 7, padding: '3px 9px' }}>LAB</span>
              <h2 className="sec-head__title">Manim Lab — xem 7 thuật toán chạy từng bước</h2>
            </div>
            <div className="sec-rule" style={{ '--rule-color': 'var(--yellow)' } as React.CSSProperties} />
            <Html as="p" t="Đọc mười lần không bằng xem chạy một lần. Chọn thuật toán, bấm <strong class='hl'>Chạy</strong>, hoặc bước từng nhịp bằng <strong class='hl'>Tiến / Lùi</strong> để soi cho kỹ. Màu vẫn theo quy ước dùng chung cả trang: <span class='hl-cyan'>xanh dương — frontier</span> · <span class='hl-yellow'>vàng — đang mở</span> · <span style='color:var(--muted-2)'>xám — explored</span> · <span class='hl-green'>xanh lá — đường đi</span> · <span class='hl-purple'>tím — vừa tìm ra đường rẻ hơn</span>." className="sec-lead" />
          </Reveal>
          <Reveal delay={0.1} style={{ marginTop: 22 }}>
            <SearchLab />
          </Reveal>
          <Reveal delay={0.15}>
            <Html as="p" t="Ba thí nghiệm tôi muốn bạn tự làm ngay bây giờ: (1) preset Romania, chạy GBFS rồi A* — tham lam ra 450 km, A* ra 418 km, tự hỏi 32 km đó đi đâu mất; (2) chạy HC trên cùng preset và xem nó kẹt cứng ở Timișoara; (3) đổi sang đồ thị Lab, so BFS (chi phí 9) với UCS (chi phí 8) để tận mắt thấy “nông nhất ≠ rẻ nhất”." style={{ color: 'var(--muted-2)', fontSize: 13, fontStyle: 'italic', margin: '14px 0 0', display: 'block' }} />
          </Reveal>
        </div>

        {/* 05 */}
        <div id="ch5" className="lesson-section">
          <SectionHead no="05" title="Tìm kiếm có thông tin" en="Informed search — GBFS · A*" color="var(--yellow)"
            lead="Nãy giờ thuật toán của mình mò trong bóng tối. Giờ tôi cho nó một cái la bàn 🎯 — đúng một con số cho <em>mỗi nút</em>: <strong class='hl-yellow'>h(n), chi phí ước lượng từ n về tới đích</strong>. Con số này không có trong đề bài, nó đến từ hiểu biết <em>bên ngoài</em> về bài toán. Trên bản đồ thì nó là khoảng cách đường chim bay (SLD). Chỉ có đúng một quy ước phải nhớ: h(đích) = 0." />
          <Reveal delay={0.05} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
            {['h(Arad) = 366', 'h(Sibiu) = 253', 'h(Făgăraș) = 176', 'h(Pitești) = 100'].map((t) => <span key={t} className="chip chip--mono">{t}</span>)}
            <span className="chip chip--mono" style={{ color: 'var(--green)', borderColor: 'color-mix(in srgb, var(--green) 40%, transparent)' }}>h(București) = 0</span>
          </Reveal>
          <AlgoCard color="var(--orange)" abbr="GBFS" name="Tham lam theo heuristic" en="Greedy best-first search"
            chips={[['frontier: priority queue theo h(n)', 'cyan'], ['dừng khi đích SINH RA', 'plain']]}
            body="Có la bàn rồi thì cứ nhắm hướng đích mà chạy thôi, đúng không? GBFS nghĩ y như vậy: luôn mở nút <strong class='hl'>trông gần đích nhất</strong>. Và nó nhanh thật — Arad → Sibiu → Făgăraș → București, mở đúng 3 nút. Có điều đường đó dài 450 km, còn đường tối ưu vòng qua Râmnicu–Pitești chỉ <strong class='hl-green'>418 km</strong>. Sai ở đâu? GBFS chỉ nhìn tương lai (h) mà quên sạch quá khứ (g), nên nó cắm đầu vào lối <em>trông</em> thì gần mà <em>đi</em> thì xa. Tệ hơn nữa, bản tree-search có thể lắc qua lắc lại vô hạn giữa hai thành phố (Iași ↔ Neamț) mà không biết ngượng."
            stats={[
              { k: 'ĐẦY ĐỦ', v: '✗ tree · ✓ graph hữu hạn', cls: 'stat--warn' },
              { k: 'TỐI ƯU', v: '✗', cls: 'stat--bad' },
              { k: 'THỜI GIAN', v: 'O(b<sup>m</sup>)' },
              { k: 'BỘ NHỚ', v: 'O(b<sup>m</sup>) — h tốt cắt mạnh' },
            ]} />
          <AlgoCard color="var(--yellow)" abbr="A*" name="Cân bằng quá khứ và tương lai" en="A-star search" border="color-mix(in srgb, var(--yellow) 30%, transparent)"
            chips={[['frontier: priority queue theo f(n)', 'cyan'], ['dừng khi đích LẤY RA', 'yellow']]}
            body="UCS nhớ quá khứ, GBFS đoán tương lai, mỗi đứa thiếu một nửa. A* làm cái việc hiển nhiên là cộng hai nửa lại:<br/><br/><span style='font-family:var(--font-serif);font-style:italic;font-size:1.35em'><span class='hl-text'>f(n)</span> = <span class='hl-cyan'>g(n)</span> + <span class='hl-yellow'>h(n)</span></span> — chi phí ước lượng của nghiệm rẻ nhất đi QUA n.<br/><br/>Cài đặt thì gần như copy UCS: cùng hàng đợi ưu tiên, cùng decrease-key, cùng luật “chỉ dừng khi đích được lấy ra”. Bạn chỉ đổi khóa sắp xếp từ g sang f, thế thôi. Nhưng A* giỏi hay dở thì phụ thuộc hoàn toàn vào h, và h phải thỏa điều kiện:"
            stats={[
              { k: 'ĐẦY ĐỦ', v: '✓', cls: 'stat--good' },
              { k: 'TỐI ƯU', v: '✓ admissible / consistent', cls: 'stat--good' },
              { k: 'THỜI GIAN', v: 'mũ theo sai số của h' },
              { k: 'BỘ NHỚ', v: 'O(b<sup>d</sup>) — điểm chết', cls: 'stat--bad stat--bad-b' },
            ]}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 14, marginTop: 16 }}>
              <div className="panel-inner" style={{ padding: '16px 18px', borderRadius: 12 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--green)' }}>ADMISSIBLE — không ước lượng lố</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 17, marginTop: 8, color: 'var(--text-hi)' }}>h(n) ≤ h*(n) — chi phí thật</div>
                <Html as="p" t="Heuristic biết điều: không bao giờ nói quá. Nó được phép lạc quan, cấm bi quan. SLD admissible vì đường chim bay thì không đường nào ngắn hơn được. Chỉ cần MỘT node nói phóng lên là mất sạch bảo đảm. → A* <strong class='hl-mid'>tree-search tối ưu</strong>." style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '8px 0 0' }} />
              </div>
              <div className="panel-inner" style={{ padding: '16px 18px', borderRadius: 12 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--green)' }}>CONSISTENT — bất đẳng thức tam giác</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 17, marginTop: 8, color: 'var(--text-hi)' }}>h(n) ≤ c(n, a, n′) + h(n′)</div>
                <Html as="p" t="Điều kiện chặt hơn một bậc: không có “lối tắt” nào rẻ hơn việc đi một bước rồi ước lượng tiếp. Hệ quả rất đẹp — f không bao giờ giảm dọc một đường đi, nên nút vừa được lấy ra lần đầu là đã tối ưu, khỏi cần xét lại. → A* <strong class='hl-mid'>graph-search tối ưu</strong>. Và consistent ⇒ admissible, chứ không ngược lại." style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '8px 0 0' }} />
              </div>
            </div>
            <div className="canvas-panel" style={{ marginTop: 16 }}>
              <div className="canvas-panel__head">
                <span className="canvas-panel__title">A* mở những nút nào — đường viền f</span>
                <span className="canvas-panel__sub">h càng sắc, vùng loang càng bó về phía đích</span>
              </div>
              <svg viewBox="0 0 700 220" style={{ width: '100%', display: 'block', padding: '10px 0 4px' }}>
                {[30, 55, 80, 105, 130].map((r, i) => (
                  <circle key={r} cx="170" cy="118" r={r} fill="none" stroke="#58C4DD" strokeWidth="1.3" opacity={0.62 - i * 0.09} />
                ))}
                {([[445, 35, 26], [461, 62, 37], [479, 90, 46], [498, 120, 55], [516, 150, 63]] as const).map(([cx, rx, ry], i) => (
                  <ellipse key={cx} cx={cx} cy="118" rx={rx} ry={ry} fill="none" stroke="#F4D345" strokeWidth="1.3" opacity={0.62 - i * 0.09} />
                ))}
                {([[170, 300, '#58C4DD'], [430, 600, '#F4D345']] as const).map(([sx, gx, c]) => (
                  <g key={sx}>
                    <line x1={sx} y1="118" x2={gx} y2="118" stroke="#3A4254" strokeWidth="1.5" strokeDasharray="4 5" />
                    <circle cx={sx} cy="118" r="11" fill="#12151A" stroke={c} strokeWidth="2" />
                    <circle cx={gx} cy="118" r="11" fill="#12151A" stroke="#83C167" strokeWidth="2" />
                    <text x={sx} y="122" textAnchor="middle" fill={c} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>S</text>
                    <text x={gx} y="122" textAnchor="middle" fill="#83C167" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>G</text>
                  </g>
                ))}
                <text x="170" y="30" textAnchor="middle" fill="#58C4DD" style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>UCS — h(n) = 0</text>
                <text x="170" y="206" textAnchor="middle" fill="#5C6579" style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5 }}>viền tròn quanh S, loang đều mọi hướng</text>
                <text x="500" y="30" textAnchor="middle" fill="#F4D345" style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>A* — h sắc</text>
                <text x="500" y="206" textAnchor="middle" fill="#5C6579" style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5 }}>viền kéo dài về G, bó quanh đường tối ưu</text>
                <line x1="350" y1="46" x2="350" y2="190" stroke="#1E2430" strokeWidth="1" />
              </svg>
            </div>
            <Html as="p" t="Vì f không giảm dọc đường đi, A* mở nút theo thứ tự f tăng dần — nó lấp lần lượt từng <strong class='hl-yellow'>đường viền f</strong> một, y như nước dâng lên từng vạch. Gọi C* là chi phí của nghiệm tối ưu, bạn suy ra được ngay hai điều mà tôi thấy rất đáng nhớ: A* <strong class='hl'>mở mọi nút có f(n) &lt; C*</strong>, và <strong class='hl'>không bao giờ mở nút có f(n) &gt; C*</strong> — đám đó bị cắt sạch mà nghiệm vẫn tối ưu. Riêng mấy nút nằm đúng trên viền f(n) = C* thì hên xui, tùy cách phá đồng hạng. Đây chính là công cụ để làm <a href='#hw'>câu 3 của bài tập</a>: muốn biết một đường có thể được trả về hay không, bạn đi tính f chứ đừng đoán.<br/><br/>Quay lại bản đồ Romania cho dễ hình dung. Vẽ các viền <strong class='hl-mid'>380 · 400 · 420</strong> quanh Arad thì viền 420 vừa vặn trùm tới được București — tất nhiên rồi, vì nghiệm tối ưu là <strong class='hl-green'>418</strong>. Mọi thành phố nằm ngoài cái viền ấy, A* không thèm đụng tới một cái nào.<br/><br/>Và đó cũng là chỗ h biến thành tốc độ. h = 0 thì f = g, viền là những vòng tròn đồng tâm quanh S — A* thoái hóa đúng thành UCS, loang đều ra mọi phía kể cả hướng ngược với đích. h càng sát chi phí thật, viền càng bị kéo dài về phía G và bó sát đường tối ưu, số nút lọt vào trong viền càng ít. Mở Lab chạy UCS rồi A* trên preset Romania, đếm số nút xám của hai bên — chênh lệch đó chính là cái hình trên." style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '14px 0 0' }} />
            <Html as="p" t="Một danh hiệu nữa cho A*: nó <strong style='color:var(--text-2)'>optimally efficient</strong> — với cùng một h consistent, không thuật toán tối ưu nào mở được ít nút hơn nó. Nghe hoàn hảo, nhưng gót chân Achilles vẫn là RAM. Khi máy không chứa nổi thì tìm tới IDA*, RBFS, SMA* — ngoài phạm vi buổi này, để dành." style={{ color: 'var(--muted-2)', fontSize: 13, fontStyle: 'italic', margin: '12px 0 0' }} />
          </AlgoCard>
          <Reveal style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(330px,100%),1fr))', gap: 14 }}>
            <div className="card">
              <span className="kicker">HEURISTIC TRỘI HƠN — VÀ ĐO ĐỘ SẮC BẰNG b*</span>
              <Html as="p" t="Quy tắc chọn heuristic: nếu h₂(n) ≥ h₁(n) tại mọi n (cả hai vẫn admissible) thì h₂ <em>trội</em> h₁, và A*(h₂) không bao giờ phải mở nhiều nút hơn. Nói cách khác: ước lượng càng sát chi phí thật càng tốt, miễn đừng vượt. Thử với 8-puzzle — h₁ = số ô nằm sai chỗ, h₂ = tổng khoảng cách Manhattan." style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
              <Html as="p" t="Nhưng “mở ít nút hơn” thì ít hơn <em>bao nhiêu</em>? Đếm nút trần trụi không so được giữa hai bài khác độ sâu — 227 nút ở d = 12 với 39.135 nút ở d = 24, cái nào giỏi hơn? Nên người ta quy hết về một con số duy nhất: <strong class='hl-yellow'>hệ số phân nhánh hiệu dụng b*</strong>. A* mở N nút rồi tìm ra nghiệm ở độ sâu d; giờ hỏi ngược: một cây <em>đều</em> sâu d mà chứa đúng N + 1 nút thì mỗi nút phải đẻ mấy con?" style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
              <Html as="p" t="<span style='font-family:var(--font-serif);font-style:italic;font-size:1.25em'>N + 1 = 1 + b* + (b*)² + … + (b*)<sup>d</sup></span>" style={{ color: 'var(--text-hi)', margin: '12px 0 0', textAlign: 'center' }} />
              <Html as="p" t="Ví dụ A* tìm ra nghiệm ở độ sâu 5 mà chỉ tốn 52 nút → <strong class='hl'>b* = 1,92</strong>: nó len tới đích gọn như thể mỗi nút chỉ có chưa tới 2 nhánh, dù cây thật thì rậm hơn nhiều. b* đổi theo từng đề, nhưng với bài đủ khó thì khá ổn định, nên dùng nó chấm điểm heuristic được. Thước đo gói lại đúng một câu: <strong class='hl-green'>b* càng gần 1 càng ngon</strong> — b* = 1 nghĩa là đi một mạch tới nghiệm, không mở thừa nút nào. Heuristic nào ép được b* xuống sát 1 là heuristic cho bạn giải nổi bài lớn với cái giá chịu được." style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
              <div style={{ overflowX: 'auto', marginTop: 14 }}>
                <table className="dtable mono" style={{ fontSize: 12 }}>
                  <tbody>
                    <tr style={{ color: 'var(--faint)' }}><td /><td colSpan={2} style={{ textAlign: 'center' }}>SỐ NÚT SINH RA</td><td colSpan={2} style={{ textAlign: 'center' }}>b*</td></tr>
                    <tr style={{ color: 'var(--faint)' }}><td /><td>d = 12</td><td>d = 24</td><td>d = 12</td><td>d = 24</td></tr>
                    <tr style={{ color: 'var(--red-soft)' }}><td>IDS</td><td>3.644.035</td><td>–</td><td>2,78</td><td>–</td></tr>
                    <tr style={{ color: 'var(--text-2)' }}><td>A*(h₁)</td><td>227</td><td>39.135</td><td>1,42</td><td>1,48</td></tr>
                    <tr style={{ color: 'var(--green-soft)' }}><td>A*(h₂)</td><td>73</td><td>1.641</td><td>1,24</td><td>1,26</td></tr>
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 8, fontStyle: 'italic' }}>Trung bình trên 100 thể hiện 8-puzzle cho mỗi độ sâu d. Ô “–”: từ d = 14 trở lên bảng gốc bỏ trống dòng IDS, không có số đo — và tôi không bịa cho bạn một con số. Cứ nhìn 3,6 triệu ở d = 12 rồi tự nhân tiếp là đủ sợ.</div>
            </div>
            <div className="card">
              <span className="kicker">CHẾ HEURISTIC Ở ĐÂU RA?</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, fontSize: 13.5, lineHeight: 1.65, color: 'var(--muted)' }}>
                <Html t="<strong class='hl-yellow'>1 · Nới lỏng bài toán.</strong> Đây là mẹo tôi thích nhất: bỏ bớt luật đi. 8-puzzle cho ô bay tự do tới đích → ra h₁; cho ô trượt đè lên nhau → ra h₂. Vì bài dễ hơn thì nghiệm không thể đắt hơn bài gốc, mấy h kiểu này <em>tự động</em> admissible và consistent. Khỏi chứng minh." />
                <Html t="<strong class='hl-yellow'>2 · Lấy max.</strong> Có nhiều h admissible mà không biết chọn cái nào? Lấy hết: h = max(h₁, …, hₖ). Max của các heuristic biết điều thì vẫn biết điều." />
                <Html t="<strong class='hl-yellow'>3 · Pattern database.</strong> Giải trước vài bài con (ví dụ chỉ 4 ô góc), ghi chi phí chính xác vào bảng, lúc chạy thì tra. Đổi bộ nhớ lấy độ sắc của h." />
                <Html t="<strong class='hl-yellow'>4 · Học từ kinh nghiệm.</strong> Giải nhiều lần, ghi lại, rồi hồi quy h từ các đặc trưng của trạng thái. Vâng — dùng học máy để chế heuristic cho tìm kiếm. Hẹn bạn ở Buổi 10." />
              </div>
            </div>
          </Reveal>
        </div>

        {/* 06 */}
        <div id="ch6" className="lesson-section">
          <SectionHead no="06" title="Leo đồi — kẻ ngoại đạo trong Lab" en="Hill-climbing, first-choice" color="var(--red)"
            lead="⛰️ Lab 1 bắt cài thêm một đứa chẳng giống ai trong đám trên: leo đồi. Không hàng đợi, không quay lui, không nhớ gì hết — nó giữ đúng <strong class='hl'>một</strong> nút hiện tại rồi bước sang láng giềng nào có h nhỏ hơn. Bản <strong class='hl'>first-choice</strong> còn lười hơn: thấy láng giềng tốt hơn đầu tiên là leo luôn, khỏi so tiếp. Bộ nhớ O(1), nhanh như chớp — và mù tịt trước cực trị địa phương." />
          <Reveal delay={0.1} className="canvas-panel" style={{ marginTop: 22 }}>
            <div className="canvas-panel__head">
              <span className="canvas-panel__title">Vì sao leo đồi kẹt — phong cảnh trạng thái</span>
              <span className="canvas-panel__sub">quả bóng chỉ biết leo lên, không bao giờ chịu xuống</span>
            </div>
            <CanvasScene height={290} draw={drawHill} />
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="kicker">BA KIỂU CHẾT</span>
            {['cực trị địa phương', 'cao nguyên phẳng (plateau)', 'sống núi (ridge)'].map((t) => (
              <span key={t} className="chip" style={{ fontSize: 12.5, color: 'var(--red-soft)', borderColor: 'color-mix(in srgb, var(--red) 35%, transparent)' }}>{t}</span>
            ))}
            <Html as="span" t="— muốn thấy nó chết tận mắt thì chạy <strong class='hl-mid'>HC trên preset Romania</strong> trong <a href='#lab'>Lab</a>: nó hí hửng leo Arad → Timișoara vì h giảm từ 366 xuống 329, rồi đứng đó, hết đường lên. Output: -1." style={{ fontSize: 13, color: 'var(--muted)' }} />
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ color: 'var(--muted-2)', fontSize: 13.5, lineHeight: 1.7, margin: '14px 0 0', fontStyle: 'italic' }}>
              Đừng vội chê nó — Buổi 4 (Local Search) dành nguyên buổi để chữa đúng căn bệnh này: random restart, simulated annealing, local beam, thuật toán di truyền. Leo đồi là điểm xuất phát của cả một họ thuật toán rất mạnh.
            </p>
          </Reveal>
        </div>

        {/* 07 */}
        <div id="ch7" className="lesson-section">
          <SectionHead no="07" title="Bảy thuật toán trên một trang giấy" en="" />
          <Reveal delay={0.1} className="card" style={{ marginTop: 22, padding: '8px 18px 14px', overflowX: 'auto' }}>
            <table className="dtable" style={{ minWidth: 820 }}>
              <tbody>
                <tr className="dtable__head"><td>THUẬT TOÁN</td><td>FRONTIER</td><td>ĐẦY ĐỦ</td><td>TỐI ƯU</td><td>THỜI GIAN</td><td>BỘ NHỚ</td><td>DÙNG KHI</td></tr>
                {([
                  ['BFS', 'var(--cyan)', 'FIFO', ['✓¹', 'g'], ['✓²', 'g'], 'O(b<sup>d</sup>)', ['O(b<sup>d</sup>)', 'r'], 'nghiệm nông, bước cùng giá, RAM dư'],
                  ['DFS', 'var(--red)', 'LIFO', ['✓³', 'y'], ['✗', 'r'], 'O(b<sup>m</sup>)', ['O(bm)', 'g'], 'RAM chật, không gian sâu hữu hạn'],
                  ['UCS', 'var(--green)', 'PQ theo g', ['✓¹', 'g'], ['✓', 'g'], 'O(b<sup>1+⌊C*/ε⌋</sup>)', ['như thời gian', 'n'], 'chi phí bước khác nhau, cần tối ưu'],
                  ['IDS', 'var(--purple)', 'DLS lặp, ℓ↑', ['✓¹', 'g'], ['✓²', 'g'], 'O(b<sup>d</sup>)', ['O(bd)', 'g'], 'mặc định khi d chưa biết, KG lớn'],
                  ['GBFS', 'var(--orange)', 'PQ theo h', ['✗ / ✓³', 'y'], ['✗', 'r'], 'O(b<sup>m</sup>)', ['O(b<sup>m</sup>)', 'n'], 'cần nhanh, chấp nhận lệch tối ưu'],
                  ['A*', 'var(--yellow)', 'PQ theo f = g+h', ['✓', 'g'], ['✓⁴', 'g'], 'mũ theo sai số h', ['O(b<sup>d</sup>)', 'r'], 'cần tối ưu và có h tốt'],
                  ['HC', 'var(--pink)', 'không có', ['✗', 'r'], ['✗', 'r'], 'tùy địa hình', ['O(1)', 'g'], 'KG khổng lồ, cần nghiệm “đủ tốt”'],
                ] as [string, string, string, [string, string], [string, string], string, [string, string], string][]).map(([name, c, fr, comp, opt, time, mem, use]) => {
                  const cc = (k: string) => (k === 'g' ? 'var(--green)' : k === 'r' ? 'var(--red)' : k === 'y' ? 'var(--yellow)' : 'var(--text-2)');
                  return (
                    <tr key={name}>
                      <td className="mono" style={{ fontWeight: 700, color: c }}>{name}</td>
                      <td style={{ color: 'var(--muted)' }}>{fr}</td>
                      <td style={{ color: cc(comp[1]) }}>{comp[0]}</td>
                      <td style={{ color: cc(opt[1]) }}>{opt[0]}</td>
                      <Html as="td" t={time} style={{ color: 'var(--text-2)' }} />
                      <Html as="td" t={mem[0]} style={{ color: cc(mem[1]) }} />
                      <td style={{ color: 'var(--muted)' }}>{use}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 10, fontStyle: 'italic' }}>
              ¹ b hữu hạn (UCS: thêm chi phí bước ≥ ε &gt; 0) · ² khi mọi bước cùng chi phí · ³ graph-search trên không gian hữu hạn · ⁴ h admissible (tree) / consistent (graph)
            </div>
          </Reveal>
        </div>

        {/* 08 — Code Lab */}
        <div id="codelab" className="lesson-section">
          <SectionHead no="08" title="Code Lab — cài cả 7 thuật toán" en="Lab 1 — Searching · CSC14003" color="var(--green)"
            lead="⌨️ Tới phần vui nhất: gõ code. Đề bài yêu cầu viết Python và <em>tự cài phần lõi tìm kiếm</em> — thư viện phụ trợ thì thoải mái, nhưng đừng gọi thư viện giải hộ. Đọc <span class='code-inline'>input.txt</span>, ghi <span class='code-inline'>output.txt</span>, đo runtime và peak memory cho từng thuật toán. Bài <strong class='hl'>cá nhân</strong>, khoảng 3 tuần. Thang điểm: 7 thuật toán × 10% · ≥ 5 test case 10% · báo cáo 20%. Dưới đây tôi để sẵn khung code, bạn điền phần lõi." />
          <Reveal delay={0.05} className="card" style={{ marginTop: 20, background: 'color-mix(in srgb, var(--yellow) 5%, transparent)', borderColor: 'color-mix(in srgb, var(--yellow) 35%, transparent)', padding: '16px 20px' }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--yellow)', letterSpacing: '.8px' }}>BA QUY ƯỚC MÀ SAI LÀ LỆCH OUTPUT — ĐỌC KỸ GIÙM TÔI</span>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10, fontSize: 13.5, color: 'var(--text-hi)' }}>
              <Html as="span" t="BFS · DFS · GBFS dừng khi đích được <strong class='hl-cyan'>SINH RA</strong>" className="chip" style={{ padding: '6px 10px', background: 'var(--panel)' }} />
              <Html as="span" t="UCS · A* dừng khi đích được <strong class='hl-yellow'>LẤY RA</strong>" className="chip" style={{ padding: '6px 10px', background: 'var(--panel)' }} />
              <Html as="span" t="HC kẹt → không có đường → in <strong class='hl-red'>-1</strong>" className="chip" style={{ padding: '6px 10px', background: 'var(--panel)' }} />
            </div>
          </Reveal>
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(330px,100%),1fr))', gap: 14, marginTop: 16 }}>
            <div className="canvas-panel">
              <div style={{ padding: '12px 18px', borderBottom: '1px solid #1E2430', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#97A0B5' }}>INPUT.TXT — đồ thị có thể CÓ HƯỚNG hoặc vô hướng</div>
              <div style={{ padding: '14px 18px 0', fontSize: 13, color: '#97A0B5', lineHeight: 1.7 }}>dòng 1: số nút · dòng 2: start goal · tiếp theo: ma trận kề (trọng số, 0 = không có cạnh) · dòng cuối: heuristic từng nút</div>
              <pre className="codeblock" style={{ background: 'transparent', color: '#B8C0D2' }}>{INPUT_EX}</pre>
            </div>
            <div className="canvas-panel">
              <div style={{ padding: '12px 18px', borderBottom: '1px solid #1E2430', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#97A0B5' }}>OUTPUT.TXT — path hoặc -1, kèm time và memory</div>
              <div style={{ padding: '14px 18px 0', fontSize: 13, color: '#97A0B5', lineHeight: 1.7 }}>đồ thị này chính là preset “Lab 1 · 6 đỉnh” trong Manim Lab ở trên — code bạn chạy ra gì, đối chiếu từng bước được luôn</div>
              <pre className="codeblock" style={{ background: 'transparent', color: '#B8C0D2' }}>{OUTPUT_EX}</pre>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="canvas-panel" style={{ marginTop: 16 }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid #1E2430', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#97A0B5' }}>DÙNG CHUNG CHO CẢ 7 — LẦN NGƯỢC CON TRỎ CHA</div>
            <Code src={HELPER_PY} />
          </Reveal>
          <Reveal delay={0.1} style={{ marginTop: 16 }}>
            <CodeLab />
          </Reveal>
          <Reveal delay={0.1} className="canvas-panel" style={{ marginTop: 16 }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid #1E2430', display: 'flex', gap: 12, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#97A0B5' }}>MAIN.PY — ĐỌC INPUT, CHẠY 7 THUẬT TOÁN, ĐO TIME + MEMORY</span>
              <span style={{ fontSize: 12, color: '#5C6579', fontStyle: 'italic' }}>time.perf_counter() + tracemalloc — đúng hai thứ đề đòi: “high-resolution timer” và “peak memory”</span>
            </div>
            <Code src={MAIN_PY} style={{ maxHeight: 460, fontSize: 12 }} />
          </Reveal>
          <Reveal delay={0.1} className="card" style={{ marginTop: 16, padding: '18px 20px' }}>
            <span className="kicker">GỢI Ý 5 TEST CASE “KHÁC TÍNH CHẤT” — CHỖ NÀY DỄ ĂN ĐIỂM</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)' }}>
              <Html t="<strong class='hl-mid'>1 ·</strong> Đồ thị mẫu 6 đỉnh ở trên — có đáp án đối chiếu sẵn trong Manim Lab, dùng để bắt bug đầu tiên." />
              <Html t="<strong class='hl-mid'>2 ·</strong> Vô nghiệm: cô lập cái đích ra. Cả 7 phải in -1 và thoát êm, đứa nào treo là đứa đó có bug vòng lặp." />
              <Html t="<strong class='hl-mid'>3 ·</strong> Đồ thị CÓ HƯỚNG (ma trận bất đối xứng) — test này lộ ngay bug duyệt kề, kinh điển nhất là quét nhầm cột thành hàng." />
              <Html t="<strong class='hl-mid'>4 ·</strong> Cố tình cho một heuristic KHÔNG admissible → A* sẽ trả đường lệch tối ưu. Không phải bug đâu, đúng lý thuyết đấy — và giải thích được chuyện này trong báo cáo thì rất ăn điểm." />
              <Html t="<strong class='hl-mid'>5 ·</strong> Đồ thị lớn sinh ngẫu nhiên (n ≥ 500). Đồ thị 6 đỉnh thì thuật toán nào cũng xong trong 0,0001 giây; phải to lên thì khác biệt time/memory mới chịu hiện ra." />
            </div>
          </Reveal>
        </div>

        {/* 09 — Quiz */}
        <div id="quiz" className="lesson-section">
          <SectionHead no="09" title="Quiz — đo xem bạn <em class='hl-cyan'>thật sự</em> hiểu tới đâu" en="tám câu · phát biểu bài toán, frontier, heuristic, A*" color="var(--cyan)"
            lead="Đọc một mạch rồi thấy hiểu hết là cảm giác quen thuộc nhất trên đời — và cũng là cảm giác dễ lừa mình nhất. Tám câu dưới đây không phải để chấm bạn; chúng để lộ ra chỗ nào bạn mới chỉ <em>thấy quen mặt</em> chứ chưa hiểu. Sai câu nào thì đọc phần giải thích ngay dưới đó, đừng để dành. Làm xong hẵng qua bài tập." />
          <Reveal delay={0.1} style={{ marginTop: 22 }}>
            <SessionQuiz sessionId="b3" color="var(--cyan)" />
          </Reveal>
        </div>

        {/* 10 — Bài tập & tự kiểm */}
        <div id="hw" className="lesson-section lesson-section--last">
          <SectionHead no="10" title="Bài tập về nhà — Buổi 3" en="bốn câu · formulation, trace tay, admissible &amp; consistent, mê cung" color="var(--purple)" />
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(430px,100%),1fr))', gap: 14, marginTop: 22 }}>
            {([
              ['QUESTION 1 — HAI NGƯỜI BẠN TRÊN BẢN ĐỒ ROMANIA', "Mỗi lượt cả hai <em>cùng</em> di chuyển sang thành phố kề; thời gian một lượt = d(i, j) của người đi lâu hơn — người tới trước phải đứng đợi. Mục tiêu: gặp nhau nhanh nhất. <strong class='hl'>(a)</strong> Viết formulation đầy đủ (state, actions, transition, goal test, cost). <strong class='hl'>(b)</strong> D(i, j) là đường chim bay giữa hai người — heuristic nào admissible: D(i, j) · 2·D(i, j) · D(i, j)/2? <strong class='hl'>(c)</strong> Có bản đồ liên thông hoàn toàn mà vô nghiệm không? <strong class='hl'>(d)</strong> Có bản đồ mà mọi nghiệm bắt một người thăm lại thành phố cũ?", "<a href='#ch2'>Ôn: mục 02 — 5 thành phần</a> · <a href='#ch5'>mục 05 — admissible</a>"],
              ['QUESTION 2 — TRACE TAY 6 THUẬT TOÁN', "Đồ thị S → G, h ghi dưới tên đỉnh, chi phí trên cạnh. Với BFS (có mẫu) · UCS · DFS (nhớ nút trên đường đi) · IDS · GBFS · A*: liệt kê <em>thứ tự expand</em>, <em>đường đi tìm được</em>, <em>frontier cuối cùng</em>. Đồng hạng → mở theo alphabet; “expand” = lấy RA khỏi frontier. <strong class='hl'>(g)</strong> h có admissible? <strong class='hl'>(h)</strong> có consistent?", "<a href='#lab'>Luyện đúng kỹ năng này trong Manim Lab</a>"],
              ['QUESTION 3 — ĐƯỜNG NÀO CÓ THỂ ĐƯỢC TRẢ VỀ?', "A là start, G là goal; h₁ consistent còn h₂ thì không. <strong class='hl'>(1)</strong> Với DFS · BFS · UCS · A*(h₁) · A*(h₂), đánh dấu những đường <em>có thể</em> được trả về dưới một cách phá đồng hạng nào đó: A-B-D-G, A-C-D-G, A-B-C-D-F-G. <strong class='hl'>(2)</strong> Bảng h₃ đã cố định trừ h₃(B): tìm tập giá trị để h₃ admissible; để h₃ consistent; để A* expand đúng thứ tự A, C, B, D.", "<a href='#ch5'>Ôn: mục 05 — admissible vs consistent</a>"],
              ['QUESTION 4 — MÊ CUNG s → g', "Tường đậm không đi xuyên. Liệt kê các ô explored theo định dạng &lt;b₁, b₂, …&gt; với: <strong class='hl'>(a)</strong> BFS; <strong class='hl'>(b)</strong> DFS chống lặp, thứ tự toán tử up, left, right, down; <strong class='hl'>(c)</strong> GBFS với khoảng cách Manhattan (|Δx| + |Δy|); <strong class='hl'>(d)</strong> A* cùng heuristic đó.", "<a href='#ch4'>Ôn: mục 04 — thứ tự mở nút</a>"],
            ] as [string, string, string][]).map(([k, body, links]) => (
              <div key={k} className="card">
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--purple)' }}>{k}</div>
                <Html as="p" t={body} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }} />
                <Html as="div" t={links} style={{ marginTop: 12, fontSize: 12.5 }} />
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 24 }}>
            <CheckList storageKey="b3v3-checks" items={[
              'Đưa đề nào cũng viết được 5 thành phần của nó — thử ngay với Q1, hai người bạn trên bản đồ.',
              'Phân biệt được node ↔ state, frontier ↔ explored, tree-search ↔ graph-search.',
              'Giải thích cho người khác nghe được: vì sao BFS/DFS/GBFS dừng khi đích SINH RA, còn UCS/A* phải nhịn đợi LẤY RA.',
              'Trace tay BFS, UCS, A* trên đồ thị 6 đỉnh của Lab rồi đối chiếu với Manim Lab.',
              'Chứng minh được một heuristic là admissible / consistent (Q2g–h, Q3).',
              'Cài đủ 7 thuật toán, chạy trơn input.txt → output.txt, đo được time và memory.',
              'Tự tạo ≥ 5 test case khác tính chất: vô nghiệm, đồ thị có hướng, HC kẹt, đồ thị lớn…',
            ]} />
          </Reveal>
          <Reveal delay={0.2} style={{ marginTop: 24, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--border-2)', paddingTop: 20 }}>
            <Html as="span" t="Tiếp theo: <strong class='hl'>Buổi 4 — Local Search</strong>, nơi mình chữa bệnh kẹt của leo đồi bằng simulated annealing, local beam và thuật toán di truyền. Cũng là lúc bạn thấy đôi khi “đủ tốt” đáng giá hơn “tối ưu” 🙂" style={{ fontSize: 13, color: 'var(--muted)' }} />
            <div style={{ flex: 1 }} />
            <Link to="/courses/csc14003" style={{ fontSize: 13 }}>← Về Lộ trình</Link>
          </Reveal>
        </div>
      </LessonDeck>
    </>
  );
}
