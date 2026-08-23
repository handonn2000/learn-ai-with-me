import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CanvasScene } from '@/components/CanvasScene';
import { CheckList } from '@/components/CheckList';
import { Html } from '@/components/Html';
import { prefersReducedMotion as rm } from '@/lib/motion';
import { Kicker } from '@/components/Kicker';
import { LessonNav } from '@/components/LessonNav';
import { MathPrimer, type MathTerm } from '@/components/MathPrimer';
import { Reveal } from '@/components/Reveal';
import { DeckToggle, LessonDeck, useDeckMode } from '@/components/LessonDeck';
import { SectionHead } from '@/components/SectionHead';
import { SessionQuiz } from '@/components/SessionQuiz';
import { QUAD, QUIZ, FIELDS, CANDO, TOPICS, CHECKS } from '@/content/courses/csc14003/intro-ai.js';
import { MATH_PRIMERS } from '@/content/courses/csc14003/math-primers.js';
import { drawQuad, drawTuring, drawTimeline } from './lesson01.scenes';


interface QuadCell { id: string; vn: string; en: string; tag: string; color: string }
interface QuizItem { q: string; a: string; why: string }

const NAV = [
          { href: '#toan', label: 'TOÁN NỀN' }, { href: '#ch1', label: '01 AI là gì' }, { href: '#ch2', label: '02 Bốn ô' }, { href: '#ch3', label: '03 Turing' },
          { href: '#ch4', label: '04 Suy nghĩ' }, { href: '#ch5', label: '05 Duy lý', hot: true }, { href: '#ch6', label: '06 Nền tảng' },
          { href: '#ch7', label: '07 Lịch sử' }, { href: '#ch8', label: '08 Ứng dụng' }, { href: '#ch9', label: '09 Tổng kết' }, { href: '#quiz', label: '10 Quiz', hot: true }, { href: '#hw', label: '11 Qua buổi 2' },
];
const SLIDES = [{ id: 'hero', label: 'Bìa' }, ...NAV.map((n) => ({ id: n.href.slice(1), label: n.label }))];

export default function Lesson01Intro() {
  const [deck, setDeck] = useDeckMode();
  return (
    <>
      <LessonNav badge="BUỔI 1" title="Nhập môn AI" backTo="/courses/csc14003"
        items={NAV}
        right={<DeckToggle on={deck} onChange={setDeck} />} />

      <LessonDeck on={deck} slides={SLIDES}>
        {/* Hero */}
        <div className="lesson-hero" style={{ background: 'radial-gradient(700px 340px at 72% 10%, var(--bg-glow), transparent)' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px 10px', display: 'flex', gap: 44, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 470px', minWidth: 320 }}>
              <div className="mono" style={{ fontSize: 12, letterSpacing: '1.5px', color: 'var(--yellow)' }}>CSC14003 · BUỔI 1 · ZERO → HERO</div>
              <h1 className="hero-title" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 52, lineHeight: 1.12, margin: '16px 0 0' }}>
                Trí tuệ<br /><em style={{ color: 'var(--cyan)' }}>nhân tạo</em> là gì?
              </h1>
              <p style={{ color: 'var(--text-2)', fontSize: 15.5, lineHeight: 1.75, maxWidth: 600, margin: '20px 0 0', textWrap: 'pretty' }}>
                🤔 Nghe hàn lâm dễ sợ nhỉ? Tôi cũng tưởng thế. Hóa ra cả môn này chỉ là bốn phe cãi nhau xem “thông minh” nghĩa là gì — và cãi suốt 70 năm chưa xong. Buổi 1 mình đi từ số 0: hết buổi, bạn đưa tôi hệ thống nào cũng được, bạn xếp được nó vào đúng ô, đọc trôi 80 năm lịch sử ngành, và làm xong bài tập.
              </p>
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 27, whiteSpace: 'nowrap' }}>
                  <span style={{ color: 'var(--text-hi)' }}>f</span><span style={{ color: 'var(--faint)' }}> : </span>
                  <span style={{ color: 'var(--cyan)' }}>𝓟</span><span style={{ color: 'var(--faint)' }}> → </span><span style={{ color: 'var(--yellow)' }}>𝓐</span>
                </span>
                <span className="chip" style={{ color: 'var(--cyan)', borderColor: 'color-mix(in srgb, var(--cyan) 35%, transparent)' }}>𝓟 — chuỗi tri giác</span>
                <span className="chip" style={{ color: 'var(--yellow)', borderColor: 'color-mix(in srgb, var(--yellow) 35%, transparent)' }}>𝓐 — hành động</span>
              </div>
              <div style={{ marginTop: 22, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['10 mục học', 'Quiz phân loại 8 câu', 'Bài tập — PEAS', '≈ 2 giờ'].map((t) => (
                  <span key={t} className="chip chip--mono" style={{ color: 'var(--muted-2)', fontSize: 11 }}>{t}</span>
                ))}
              </div>
            </div>
            <div data-anim style={{ flex: '0 1 400px', minWidth: 300, animation: 'mnFloat 7s ease-in-out infinite' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr 1fr', gridTemplateRows: 'auto 1fr 1fr', gap: 8 }}>
                <div />
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted-2)', textAlign: 'center', letterSpacing: '.6px' }}>NHƯ NGƯỜI</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted-2)', textAlign: 'center', letterSpacing: '.6px' }}>DUY LÝ</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted-2)', display: 'flex', alignItems: 'center' }}>SUY NGHĨ</div>
                {heroCell('Suy nghĩ như người', 'think humanly', 'var(--cyan)')}
                {heroCell('Suy nghĩ duy lý', 'think rationally', 'var(--purple)')}
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted-2)', display: 'flex', alignItems: 'center' }}>HÀNH ĐỘNG</div>
                {heroCell('Hành động như người', 'act humanly', 'var(--yellow)')}
                {heroCell('Hành động duy lý', 'act rationally', 'var(--green)')}
              </div>
            </div>
          </div>
        </div>

        {/* Toán nền — mở màn, không đánh số */}
        <div id="toan" className="lesson-section lesson-section--first">
          <MathPrimer {...(MATH_PRIMERS.b1 as { minutes: number; lead: string; terms: MathTerm[] })} />
        </div>

        {/* 01 */}
        <div id="ch1" className="lesson-section">
          <SectionHead no="01" title="Không chỉ hiểu, mà còn xây" en="Intelligence vs. Artificial Intelligence"
            lead="Năm 1988, lúc Richard Feynman mất, trên tấm bảng trong phòng làm việc của ông còn một dòng chưa kịp xóa: <em>cái gì tôi không tạo ra được thì tôi chưa hiểu nó</em>.<br/><br/>Tâm lý học và thần kinh học đã mổ xẻ trí thông minh hàng trăm năm với mục tiêu <em>hiểu</em> nó. AI nhận lấy đúng vế còn lại của câu đó: hiểu chưa đủ, phải <strong class='hl'>xây thử ra một cái xem sao</strong>. Nghe na ná nhau, nhưng đúng một chữ ấy là lý do AI ngồi ở khoa máy tính chứ không ngồi ở khoa tâm lý." />
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14, marginTop: 24 }}>
            <div className="card">
              <Kicker color="var(--cyan)">INTELLIGENCE — TRÍ THÔNG MINH</Kicker>
              <Html as="p" t="Bao gồm năng lực <em>logic, hiểu, học, lập luận, sáng tạo, giải quyết vấn đề</em>, v.v." style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }} />
            </div>
            <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--cyan) 40%, transparent)' }}>
              <Kicker color="var(--yellow)">ARTIFICIAL INTELLIGENCE — AI</Kicker>
              <Html as="p" t="Không chỉ cố <em>hiểu</em>, mà còn cố <strong class='hl'>xây dựng các thực thể thông minh</strong>." style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }} />
            </div>
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))', gap: 14 }}>
            <div className="card">
              <Kicker>MỘT NGÀNH RẤT MỚI</Kicker>
              <Html as="p" t="AI trẻ hơn bạn tưởng nhiều. Người ta bắt tay làm nghiêm túc ngay sau Thế chiến II, còn cái tên <strong class='hl'>“Artificial Intelligence”</strong> thì mãi tới hội nghị ở Đại học Dartmouth năm <strong class='hl-yellow'>1956</strong> mới có — nghĩa là ngành này còn chưa tới 70 tuổi. Mấy người ngồi trong phòng hôm đó:" style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                {['John McCarthy (1927–2011)', 'Marvin Minsky (1927–2016)', 'Allen Newell (1927–1992)', 'Arthur Samuel (1901–1990)', 'Herbert Simon (1916–2001)'].map((t) => (
                  <span key={t} className="chip chip--mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{t}</span>
                ))}
              </div>
            </div>
            <div className="card">
              <Kicker>MÔ PHỎNG NGƯỜI Ở BỐN MẶT</Kicker>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, fontSize: 13.5, lineHeight: 1.65, color: 'var(--muted)' }}>
                <Html t="<strong class='hl-cyan'>Suy nghĩ</strong> — học, lập kế hoạch, tinh chỉnh tri thức." />
                <Html t="<strong class='hl-cyan'>Tri giác</strong> — thấy, nghe, cảm nhận." />
                <Html t="<strong class='hl-cyan'>Thao tác</strong> — cầm nắm và di chuyển vật thể." />
                <Html t="<strong class='hl-cyan'>Giao tiếp</strong> — bằng ngôn ngữ tự nhiên." />
              </div>
              <p style={{ color: 'var(--muted-2)', fontSize: 13, fontStyle: 'italic', lineHeight: 1.65, margin: '12px 0 0' }}>
                Nhớ bốn mặt này giùm tôi: về sau chúng lớn lên thành bốn nhóm bài toán riêng — học máy, thị giác/tiếng nói, robot, xử lý ngôn ngữ.
              </p>
            </div>
          </Reveal>
        </div>

        {/* 02 */}
        <div id="ch2" className="lesson-section">
          <SectionHead no="02" title="Bốn định nghĩa, hai trục" en="Thinking / Acting × Humanly / Rationally"
            lead="“AI là gì” không có một câu trả lời — nó có <strong class='hl'>bốn</strong>, và bốn câu ấy chỉ khác nhau ở hai chỗ. Một: bạn mở nắp máy ra xem nó <em>nghĩ</em>, hay đứng ngoài xem nó <em>làm</em>? Hai: lấy <em>con người</em> làm thước, hay lấy <em>tính duy lý</em> làm thước?<br/><br/>Hai câu hỏi, hai trục, bốn ô. Nắm được bảng này rồi bạn sẽ hiểu vì sao hai bài báo AI cãi nhau chan chát mà vẫn đúng cả hai — chúng đang đứng ở hai ô khác nhau." />
          <Reveal delay={0.1} className="canvas-panel" style={{ marginTop: 22 }}>
            <div className="canvas-panel__head">
              <span className="canvas-panel__title">Bốn ô trên hai trục</span>
              <span className="canvas-panel__sub">cột: chuẩn là người hay là tính duy lý · dòng: đo suy nghĩ hay đo hành vi</span>
            </div>
            <CanvasScene height={380} draw={(x, api) => drawQuad(x, api, rm)} />
          </Reveal>
          <Reveal delay={0.15} className="card" style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', padding: '16px 20px' }}>
            <Kicker>CÁCH ĐỌC HAI TRỤC</Kicker>
            {['dòng trên — thought processes and reasoning', 'dòng dưới — behavior', 'cột trái — chuẩn: con người', 'cột phải — chuẩn: tính duy lý'].map((t) => (
              <span key={t} className="chip" style={{ fontSize: 12.5 }}>{t}</span>
            ))}
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>→ bốn mục tới tôi dẫn bạn đi từng ô một, cuối cùng thả bạn vào ô tương tác để tự xếp.</span>
          </Reveal>
        </div>

        {/* 03 */}
        <div id="ch3" className="lesson-section">
          <SectionHead no="03" title="Hành động như người — phép thử Turing" en="Alan Turing, 1950" color="var(--yellow)"
            lead="Tháng 10 năm 1950, trên tạp chí <em>Mind</em>, Alan Turing mở bài bằng đúng câu hỏi ai cũng muốn hỏi: máy có nghĩ được không? Rồi vài dòng sau, ông gạt nó đi — câu đó vô nghĩa tới mức không đáng đem ra bàn.<br/><br/>Thứ ông đặt vào chỗ trống là một câu <em>đo được</em>: bạn ngồi gõ chữ hỏi vài câu; nếu không nói nổi bên kia là người hay máy, thì máy <strong class='hl'>vượt phép thử</strong>. Toàn bộ tiêu chí nằm ở hành vi — chẳng ai mở nắp máy ra soi xem bên trong nó nghĩ kiểu gì." />
          <Reveal delay={0.1} className="canvas-panel" style={{ marginTop: 22 }}>
            <div className="canvas-panel__head">
              <span className="canvas-panel__title">Bố cục phép thử</span>
              <span className="canvas-panel__sub">sơ đồ — chỉ trao đổi bằng chữ viết, người hỏi không thấy ai ở bên kia</span>
            </div>
            <CanvasScene height={300} draw={(x, api) => drawTuring(x, api, rm)} />
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
            <div className="card">
              <Kicker>HAI BIẾN THỂ</Kicker>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, fontSize: 13.5, lineHeight: 1.65, color: 'var(--muted)' }}>
                <Html t="<strong class='hl-yellow'>Reverse Turing Test</strong> — đảo vai: máy ra đề, người phải chứng minh mình là người. Bạn thi cái này gần như mỗi ngày mà không để ý, tên nó là <span class='code-inline'>CAPTCHA</span> 🤖" />
                <Html t="<strong class='hl-yellow'>Total Turing Test</strong> — bản khó: bắt máy thi thêm phần nhìn (thị giác máy tính) và phần cầm nắm đồ vật (robot), không cho trốn sau màn hình chữ nữa." />
              </div>
            </div>
            <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--red) 30%, transparent)' }}>
              <Kicker color="var(--red)">VÌ SAO ÍT AI THEO ĐUỔI PHÉP THỬ NÀY</Kicker>
              <Html as="p" t="Anh em nhà Wright không chế ra máy bay bằng cách gắn lông vũ lên cánh. Họ bỏ con chim sang một bên và đi tìm nguyên lý nâng — và <em>chính vì</em> bỏ con chim đi mà họ bay được. Ngành AI đi theo đúng lối ấy, nên phép thử nổi tiếng nhất trong lịch sử của chính nó thì gần như không phòng thí nghiệm nào thèm theo đuổi: <strong class='hl'>hiểu nguyên lý đáng giá hơn sao chép một mẫu vật</strong>." style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
              <Html as="p" t="Đó mới là lý do thực dụng. Lý do thứ hai sâu hơn, và tôi muốn bạn tự tìm ra. Hai câu — trả lời trong đầu trước rồi hẵng đọc tiếp.<br/><br/><strong class='hl'>Một: vượt được phép thử Turing thì có chắc là thông minh không?</strong> Chưa chắc. Muốn qua bài, máy phải bắt chước cả những chỗ rất người mà chẳng thông minh gì — gõ sai chính tả, nhẩm 17×24 mất mười giây.<br/><br/><strong class='hl'>Hai: trượt phép thử thì có nghĩa là không thông minh không?</strong> Cũng không. Đưa một dãy triệu số bảo tìm quy luật, máy tìm ra trong một nốt nhạc — và chính vì làm được nên nó rớt, lộ ngay không phải người.<br/><br/>Ghép hai câu trả lời lại là ra kết luận: cái thước này đo <strong class='hl'>hành vi người</strong>, không đo hành vi thông minh. Hai tập ấy chỉ chồng lên nhau một phần — nên nó vừa quá chặt vừa quá lỏng." style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }} />
              <p style={{ color: 'var(--muted-2)', fontSize: 13, lineHeight: 1.65, margin: '10px 0 0', fontStyle: 'italic' }}>
                Mà nhân nói chuyện máy “nhìn”: theo bạn đây là con cừu, hay cái giẻ lau? 🐑
              </p>
            </div>
          </Reveal>
        </div>

        {/* 04 */}
        <div id="ch4" className="lesson-section">
          <SectionHead no="04" title="Hai lối đo <em class='hl-cyan'>suy nghĩ</em>" en="Thinking humanly · Thinking rationally" color="var(--purple)"
            lead="Năm 1961, Newell và Simon làm một chuyện nghe rất lạ: họ bắt người thật ngồi giải đố và <strong class='hl'>nói to ra mọi thứ đang nghĩ trong đầu</strong>, rồi chép lại từng câu. Không phải để nghiên cứu tâm lý — để đem so với từng bước của chương trình họ vừa viết.<br/><br/>Đó là một trong hai cách đo <em>suy nghĩ</em>. Cách còn lại chẳng cần tới con người nào cả: so với luật logic. Cùng một chương trình, hai cây thước ấy chấm ra hai điểm khác nhau." />
          <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 14 }}>
            <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--cyan) 40%, transparent)' }}>
              <Kicker color="var(--cyan)">SUY NGHĨ NHƯ NGƯỜI · THINKING HUMANLY</Kicker>
              <div style={{ fontWeight: 600, fontSize: 15, marginTop: 8 }}>General Problem Solver — Newell và Simon, 1961</div>
              <Html as="p" t="Cái hay của GPS không nằm ở chỗ nó giải đúng bài. Mà ở chỗ hai tác giả bắt người thật ngồi giải cùng bài, ghi lại từng bước nghĩ, rồi <strong class='hl'>đem so với từng bước của chương trình</strong>. Ra đúng đáp án chưa được tính điểm — phải đi đúng cả đường trong đầu nữa cơ." style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }} />
              <div className="panel-inner" style={{ marginTop: 14 }}>
                <Kicker>KHOA HỌC TRI NHẬN — COGNITIVE SCIENCE</Kicker>
                <Html as="p" t="Mô hình máy tính của AI <span style='color:var(--faint)'>+</span> thí nghiệm của tâm lý học <span style='color:var(--faint)'>→</span> lý thuyết <strong class='hl-mid'>chính xác và kiểm chứng được</strong> về trí óc người. Giờ hai bên đã ra ở riêng: vẫn xài chung mấy lý thuyết cũ, nhưng chưa bên nào giải thích nổi thứ gì thật sự giống trí thông minh của người." style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '8px 0 0' }} />
              </div>
            </div>
            <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--purple) 40%, transparent)' }}>
              <Kicker color="var(--purple)">SUY NGHĨ DUY LÝ · THINKING RATIONALLY</Kicker>
              <div style={{ fontWeight: 600, fontSize: 15, marginTop: 8 }}>Luật của tư duy — Aristotle (384–322 TCN)</div>
              <Html as="p" t="“Nghĩ đúng” ở đây nghĩa là lập luận chặt tới mức không ai bác được. Aristotle để lại sẵn các khuôn tam đoạn luận: cứ nhét tiền đề đúng vào là <strong class='hl'>kết luận chắc chắn đúng</strong> — máy chạy đúng khuôn đó là đang nghĩ duy lý." style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }} />
              <div className="panel-inner" style={{ marginTop: 14, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 150, fontSize: 13, lineHeight: 1.8, color: 'var(--text-2)' }}>
                  Mọi người đều phải chết.<br />Socrates là người.<br /><span style={{ color: 'var(--green)' }}>Vậy Socrates phải chết.</span>
                </div>
                <div className="mono" style={{ flex: 1, minWidth: 150, fontSize: 12.5, lineHeight: 1.9, color: 'var(--muted)' }}>
                  ∀x. man(x) ⇒ mortal(x)<br />man(Socrates)<br /><span style={{ color: 'var(--green)' }}>⊢ mortal(Socrates)</span>
                </div>
              </div>
              <div style={{ marginTop: 14 }}><Kicker color="var(--red)">HAI CHỖ VẤP CỦA ĐƯỜNG LOGICIST</Kicker></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8, fontSize: 13, lineHeight: 1.65, color: 'var(--muted)' }}>
                <Html t="<strong class='hl-red-soft'>1 ·</strong> Không phải hành vi thông minh nào cũng chịu đi qua logic — bạn có giải tam đoạn luận nào đâu trước khi né cú xe tạt đầu." />
                <Html t="<strong class='hl-red-soft'>2 ·</strong> “Trên nguyên tắc là giải được” và “giải xong trước khi mặt trời tắt” là hai chuyện rất khác nhau." />
              </div>
              <p style={{ color: 'var(--muted-2)', fontSize: 12.5, fontStyle: 'italic', lineHeight: 1.6, margin: '10px 0 0' }}>
                Nhớ kỹ hai chỗ vấp này. Buổi 7 và 8 mình sẽ xây đúng loại hệ lập luận đó, và sẽ vấp lại đúng hai chỗ này.
              </p>
            </div>
          </Reveal>
        </div>

        {/* 05 */}
        <Ch5 />

        {/* 06 */}
        <div id="ch6" className="lesson-section">
          <SectionHead no="06" title="AI vay gì của ai" en="Foundations of AI"
            lead="AI không tự nhiên rơi từ trên trời xuống. Tám ngành khác đã hỏi sẵn những câu hay nhất và để lại đủ bộ đồ nghề; AI mượn hết về, rồi hỏi thêm đúng một câu: <em>thế làm ra cái máy như vậy được không?</em>" />
          <Reveal delay={0.1} className="card" style={{ marginTop: 22, padding: '8px 18px 14px', overflowX: 'auto' }}>
            <table className="dtable" style={{ minWidth: 640 }}>
              <tbody>
                <tr className="dtable__head"><td>LĨNH VỰC</td><td>TIẾNG VIỆT</td><td>ĐÓNG GÓP CHO AI</td></tr>
                {(FIELDS as [string, string, string][]).map((f) => (
                  <tr key={f[0]}>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--cyan)' }}>{f[0]}</td>
                    <td style={{ color: 'var(--text-hi)', whiteSpace: 'nowrap' }}>{f[1]}</td>
                    <td style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{f[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
            <div className="card">
              <Kicker>AI ⊃ MACHINE LEARNING ⊃ DEEP LEARNING</Kicker>
              <div style={{ border: '1px solid color-mix(in srgb, var(--cyan) 45%, transparent)', borderRadius: 14, padding: '14px 16px', marginTop: 14 }}>
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--cyan)' }}>ARTIFICIAL INTELLIGENCE</div>
                <div style={{ border: '1px solid color-mix(in srgb, var(--yellow) 45%, transparent)', borderRadius: 12, padding: '12px 14px', marginTop: 10 }}>
                  <div className="mono" style={{ fontSize: 11.5, color: 'var(--yellow)' }}>MACHINE LEARNING</div>
                  <div style={{ border: '1px solid color-mix(in srgb, var(--green) 45%, transparent)', borderRadius: 10, padding: '10px 12px', marginTop: 10 }}>
                    <div className="mono" style={{ fontSize: 11.5, color: 'var(--green)' }}>DEEP LEARNING</div>
                  </div>
                </div>
              </div>
              <p style={{ color: 'var(--muted-2)', fontSize: 12.5, lineHeight: 1.6, margin: '12px 0 0', fontStyle: 'italic' }}>
                Ba cái tên này bị dùng lẫn lộn khắp nơi, kể cả trên báo. Thật ra chúng lồng vào nhau như búp bê Nga: học sâu là một cách làm học máy, học máy là một cách làm AI. Mấy mô hình ngôn ngữ lớn bạn đang dùng hằng ngày nằm ở lớp trong cùng — và tám buổi giữa của khóa này, từ tìm kiếm tới logic, không đụng tới lớp đó lấy một lần.
              </p>
            </div>
            <div className="card">
              <Kicker>ĐƯỢC GÌ · MẤT GÌ</Kicker>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginTop: 12 }}>
                <div>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--green)' }}>ĐƯỢC</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 8, fontSize: 13, lineHeight: 1.55, color: 'var(--muted)' }}>
                    {['Máy tính mạnh hơn, hữu dụng hơn', 'Giao diện mới và tốt hơn', 'Giải được những bài toán mới', 'Xử lý thông tin tốt hơn', 'Giảm tình trạng ngập trong thông tin', 'Biến thông tin thành tri thức'].map((t) => <div key={t}>{t}</div>)}
                  </div>
                </div>
                <div>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--red)' }}>MẤT</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 8, fontSize: 13, lineHeight: 1.55, color: 'var(--muted)' }}>
                    {['Chi phí tăng', 'Phát triển phần mềm khó — chậm và đắt', 'Ít lập trình viên có kinh nghiệm'].map((t) => <div key={t}>{t}</div>)}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* 07 */}
        <div id="ch7" className="lesson-section">
          <SectionHead no="07" title="Tám thập kỷ, hai mùa đông" en="A brief history of AI" color="var(--yellow)"
            lead="Năm 1970, Marvin Minsky nói với tạp chí Life rằng chỉ ba tới tám năm nữa thôi, ta sẽ có cỗ máy thông minh ngang một người bình thường. Bốn năm sau, các cơ quan tài trợ ở Anh rồi Mỹ lần lượt cắt ngân sách. Phòng thí nghiệm đóng cửa, nghiên cứu sinh chuyển ngành.<br/><br/>Câu đáng hỏi ở đây không phải “vì sao Minsky đoán sai” — ai mà chẳng có lúc đoán sai. Câu đáng hỏi là: <strong class='hl'>chuyện đó có phải một tai nạn đơn lẻ không?</strong> Không. Nó là một vòng lặp, và bạn sắp thấy nó chạy đủ hai lượt trong tám thập kỷ.<br/><br/>Xem dòng thời gian một lượt, để ý riêng hai vùng đỏ. Rồi đọc tên bốn giai đoạn: đó là bốn câu trả lời khác nhau cho đúng câu hỏi ở mục 02." />
          <Reveal delay={0.1} className="canvas-panel" style={{ marginTop: 22 }}>
            <div className="canvas-panel__head">
              <span className="canvas-panel__title">Dòng thời gian 1940 → 2022</span>
              <span className="canvas-panel__sub">đầu đọc quét từ trái sang phải; vùng đỏ là các mùa đông AI</span>
            </div>
            <CanvasScene height={340} draw={(x, api) => drawTimeline(x, api, rm)} />
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
            {([
              ['var(--cyan)', '1940–70 · LOGIC DẪN ĐƯỜNG', 'Mạch Boole của não (1943), bài báo của Turing (1950), cờ đam của Samuel, Logic Theorist, Geometry Engine, hội nghị Dartmouth 1956, thuật toán lập luận đầy đủ của Robinson 1965.', ''],
              ['var(--red)', '1970–90 · TRI THỨC RỒI SỤP', 'Hệ dựa trên tri thức phát triển từ 1969–79, ngành hệ chuyên gia bùng nổ 1980–88, rồi sụp 1988–93 — đúng thời kỳ mang tên <strong class="hl-red-soft">AI Winter</strong>.', 'color-mix(in srgb, var(--red) 30%, transparent)'],
              ['var(--green)', '1990–2010 · THỐNG KÊ VÀ AGENT', 'Xác suất trở lại, tập trung vào bất định, độ sâu kỹ thuật tăng, agent và hệ thống biết học — “AI Spring”. TD-Gammon 1992, Deep Blue 1997, Roomba 2002.', ''],
              ['var(--yellow)', '2010– · DỮ LIỆU LỚN, RỒI QUY MÔ', 'SIRI 2011, AlexNet 2012, Atari 2015, AlphaGo 2016, Transformer 2017, AlphaFold 2018–20, sinh ảnh 2021–22, ChatGPT 2022.', ''],
            ] as [string, string, string, string][]).map(([color, k, body, bd]) => (
              <div key={k} className="card" style={{ padding: '18px 20px', borderColor: bd || undefined }}>
                <div className="mono" style={{ fontSize: 11, color }}>{k}</div>
                <Html as="p" t={body} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '9px 0 0' }} />
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ color: 'var(--muted-2)', fontSize: 12.5, lineHeight: 1.7, margin: '14px 0 0', fontStyle: 'italic' }}>
              Mùa đông nổi tiếng nhất là 1988–93, lúc ngành hệ chuyên gia sụp cái rầm. Vùng 1974–80 ít được nhắc hơn nhưng cùng một công thức: hứa to → làm không nổi → nhà tài trợ rút ví. Công thức này lặp đủ nhiều lần để đáng nhớ — bạn thấy nó quen quen với thời bây giờ không? 👀
            </p>
          </Reveal>
        </div>

        {/* 08 */}
        <Ch8 />

        {/* 09 */}
        <Ch9 />

        {/* 10 — Quiz */}
        <div id="quiz" className="lesson-section">
          <SectionHead no="10" title="Quiz — đo xem bạn <em class='hl-cyan'>thật sự</em> hiểu tới đâu" en="tám câu · bốn hướng tiếp cận, Turing, lịch sử, agent duy lý" color="var(--cyan)"
            lead="Đọc một mạch rồi thấy hiểu hết là cảm giác quen thuộc nhất trên đời — và cũng là cảm giác dễ lừa mình nhất. Tám câu dưới đây không phải để chấm bạn; chúng để lộ ra chỗ nào bạn mới chỉ <em>thấy quen mặt</em> chứ chưa hiểu. Sai câu nào thì đọc phần giải thích ngay dưới đó, đừng để dành. Làm xong hẵng qua bài tập." />
          <Reveal delay={0.1} style={{ marginTop: 22 }}>
            <SessionQuiz sessionId="b1" color="var(--cyan)" />
          </Reveal>
        </div>

        {/* 11 */}
        <Ch10 />
      </LessonDeck>
    </>
  );
}

function heroCell(vn: string, en: string, color: string) {
  return (
    <div style={{ background: 'var(--panel)', border: `1px solid color-mix(in srgb, ${color} 45%, transparent)`, borderRadius: 14, padding: '16px 14px' }}>
      <div style={{ fontSize: 14.5, fontWeight: 600, color }}>{vn}</div>
      <div className="mono" style={{ fontSize: 10, color: 'var(--faint)', marginTop: 6 }}>{en}</div>
    </div>
  );
}

/* ===== 05 · Hành động duy lý + quiz tương tác ===== */
function Ch5() {
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number[]>([]);
  const quiz = QUIZ as QuizItem[];
  const quad = QUAD as QuadCell[];
  const q = quiz[qi];

  const pick = (id: string) => {
    if (picked) return;
    const ok = q.a === id;
    const first = !answered.includes(qi);
    setPicked(id);
    if (ok && first) setScore((s) => s + 1);
    if (first) setAnswered((a) => [...a, qi]);
  };

  return (
    <div id="ch5" className="lesson-section">
      <SectionHead no="05" title="Hành động duy lý — ô mà môn này chọn" en="The rational agent approach" color="var(--green)"
        lead="Đây là ô mà cả khóa sẽ sống trong đó, nên tôi muốn bạn trả lời một câu trước đã.<br/><br/><strong class='hl'>Bạn nhìn trước nhìn sau rồi sang đường lúc vắng hoe, và bị một cánh cửa máy bay rơi trúng. Quyết định sang đường lúc đó có duy lý không?</strong><br/><br/>Có. Duy lý chấm <em>quyết định</em>, không chấm <em>kết quả</em> — và đó là toàn bộ chỗ khó của chữ này. Duy lý = <strong class='hl'>làm điều đúng</strong>, mà “điều đúng” có nghĩa rất hẹp và đo được: điều mà <em>kỳ vọng</em> đưa bạn tới gần mục tiêu nhất, với đúng mớ thông tin đang có trong tay. Còn <strong class='hl-green'>agent</strong> thì đơn giản tới mức hơi hụt hẫng: thứ gì tri giác rồi hành động, hết." />
      <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
        <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--green) 40%, transparent)' }}>
          <Kicker>AGENT LÀ GÌ</Kicker>
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 28, marginTop: 12 }}>
            <span style={{ color: 'var(--text-hi)' }}>f</span><span style={{ color: 'var(--faint)' }}> : </span>
            <span style={{ color: 'var(--cyan)' }}>𝓟</span><span style={{ color: 'var(--faint)' }}> → </span><span style={{ color: 'var(--yellow)' }}>𝓐</span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }}>
            Một cái hàm, nhận tri giác vào rồi nhả hành động ra. Nhìn thì tầm thường, nhưng cả Buổi 2 dành để mổ đúng nó: PEAS, sáu chiều môi trường, năm kiểu agent.
          </p>
        </div>
        <div className="card">
          <Kicker>RỘNG HƠN “LUẬT CỦA TƯ DUY”</Kicker>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12, fontSize: 13.5, lineHeight: 1.65, color: 'var(--muted)' }}>
            <Html t="<strong class='hl-green'>Gồm cả</strong> suy nghĩ và suy diễn — chúng chỉ là công cụ để hành động cho đúng thôi." />
            <Html t="<strong class='hl-green'>Gồm thêm</strong> những hành động chẳng kịp nghĩ gì cả — phản xạ chẳng hạn." />
            <Html t="<strong class='hl-green'>Và</strong> suy diễn đúng chưa phải là tất cả: có lúc chẳng chứng minh được hành động nào là đúng, mà vẫn phải làm gì đó chứ không đứng đực ra." />
          </div>
        </div>
        <div className="card">
          <Kicker>DỄ PHÁT TRIỂN KHOA HỌC HƠN</Kicker>
          <Html as="p" t="Lý do rất thực dụng: “duy lý” là một khái niệm toán học, rõ ràng và tổng quát, nên còn làm khoa học trên nó được. Chứ <em>hành vi người</em> hay <em>suy nghĩ người</em> thì tới giờ ta còn chưa mô tả nổi, lấy gì làm chuẩn. Nên cả khóa này tôi chọn ô đó làm trục 🎯" style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
        </div>
      </Reveal>
      <Reveal delay={0.15} className="card card--flat" style={{ marginTop: 16, borderRadius: 16 }}>
        <div style={{ padding: '13px 18px', borderBottom: '1px solid var(--border-2)', display: 'flex', gap: 12, alignItems: 'baseline', flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--yellow)', letterSpacing: '.8px' }}>TỰ PHÂN LOẠI — ĐẶT HỆ THỐNG VÀO ĐÚNG Ô</span>
          <span className="mono" style={{ fontSize: 11.5, color: 'var(--faint)' }}>CÂU {qi + 1}/{quiz.length}</span>
          <div style={{ flex: 1 }} />
          <span className="mono" style={{ fontSize: 11.5, color: 'var(--green)' }}>ĐÚNG {score}/{quiz.length}</span>
          <button className="btn" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => { setQi(0); setPicked(null); setScore(0); setAnswered([]); }}>↺ làm lại</button>
        </div>
        <div style={{ padding: 20 }}>
          <p style={{ color: 'var(--text)', fontSize: 15.5, lineHeight: 1.7, margin: 0, maxWidth: 760, textWrap: 'pretty' }}>{q.q}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12, marginTop: 18 }}>
            {quad.map((qd) => {
              const isPick = picked === qd.id;
              const isAns = !!picked && q.a === qd.id;
              return (
                <button key={qd.id} onClick={() => pick(qd.id)} style={{
                  display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-start', textAlign: 'left', padding: '14px 16px', borderRadius: 12, width: '100%',
                  border: `1.5px solid ${isAns ? 'var(--green)' : isPick ? 'var(--red)' : 'var(--border)'}`,
                  background: isAns ? 'color-mix(in srgb, var(--green) 10%, transparent)' : isPick ? 'color-mix(in srgb, var(--red) 8%, transparent)' : 'var(--panel-2)',
                  color: isAns ? 'var(--green-soft)' : isPick ? 'var(--red-soft)' : 'var(--text-2)',
                  cursor: picked ? 'default' : 'pointer', fontFamily: 'inherit',
                }}>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: '.6px', opacity: 0.8 }}>{qd.tag}</span>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{qd.vn}</span>
                  <span style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.7 }}>{qd.en}</span>
                </button>
              );
            })}
          </div>
          {picked ? (
            <div style={{
              marginTop: 16, borderRadius: 10, padding: '12px 14px', fontSize: 13.5, lineHeight: 1.65,
              border: `1px solid ${picked === q.a ? 'color-mix(in srgb, var(--green) 40%, transparent)' : 'color-mix(in srgb, var(--red) 40%, transparent)'}`,
              background: picked === q.a ? 'color-mix(in srgb, var(--green) 8%, transparent)' : 'color-mix(in srgb, var(--red) 7%, transparent)',
              color: picked === q.a ? 'var(--green-soft)' : 'var(--red-soft)',
            }}>
              {(picked === q.a ? '✓ Đúng. ' : '✗ Chưa đúng — đáp án: ' + (quad.find((v) => v.id === q.a)?.vn ?? '') + '. ') + q.why}
            </div>
          ) : null}
          {picked ? (
            <div style={{ marginTop: 14 }}>
              <button className="btn" style={{ borderColor: 'var(--cyan)', background: 'color-mix(in srgb, var(--cyan) 12%, transparent)', color: 'var(--cyan-soft)', borderRadius: 9, padding: '8px 16px', fontWeight: 700 }}
                onClick={() => { setQi((qi + 1) % quiz.length); setPicked(null); }}>
                {qi === quiz.length - 1 ? '↺ Về câu 1' : 'Câu tiếp →'}
              </button>
            </div>
          ) : null}
        </div>
      </Reveal>
      <Reveal delay={0.2} className="card" style={{ marginTop: 16 }}>
        <Kicker>CÂU HỎI MỞ — PHẢN XẠ, THÔNG MINH, HAY DUY LÝ?</Kicker>
        <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '10px 0 0' }}>
          Không có đáp án sẵn đâu, tôi cũng không dám chắc. Bốn tình huống dưới đây: cái nào là phản xạ, cái nào phải nghĩ, và cái nào chẳng nghĩ gì mà vẫn duy lý như thường?
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12, marginTop: 14 }}>
          {['Một người đàn ông rút ngón tay khỏi bếp nóng.', 'Em bé mới sinh nắm lấy ngón tay của mẹ.', 'Hai người băng qua đường ở vạch dành cho người đi bộ.', 'Một cô gái đeo khẩu trang để không lây cúm cho người khác.'].map((t) => (
            <div key={t} className="panel-inner" style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-2)' }}>{t}</div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

/* ===== 08 · Ứng dụng + chips "máy làm được?" ===== */
function Ch8() {
  const [on, setOn] = useState<number[]>([]);
  return (
    <div id="ch8" className="lesson-section">
      <SectionHead no="08" title="Làm được gì, chưa làm được gì" en="AI applications · What can AI do?" color="var(--green)"
        lead="Ngày 8 tháng 10 năm 2024, giải Nobel Vật lý được trao cho Hopfield và Hinton vì những khám phá nền cho mạng nơ-ron nhân tạo. Đúng một ngày sau, giải Nobel Hóa học gọi tên AlphaFold. Hai giải khoa học tự nhiên trong hai ngày liên tiếp, cho cùng một họ công cụ — thứ mà ba mươi năm trước còn bị coi là ngõ cụt.<br/><br/>Dưới đây là những chỗ AI đã làm được thật. Đọc xong, giữ lại chút hoài nghi cho phần cuối mục: danh sách <em>chưa</em> làm được vẫn dài hơn bạn nghĩ." />
      <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
        <div className="card">
          <div className="mono" style={{ fontSize: 11, color: 'var(--cyan)' }}>LẬP KẾ HOẠCH VÀ ĐIỀU ĐỘ TỰ ĐỘNG</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10, fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)' }}>
            {['Xếp lịch quan sát cho kính viễn vọng', 'Xe tự hành thăm dò', 'Phân tích dữ liệu'].map((t) => <div key={t}>{t}</div>)}
          </div>
        </div>
        <div className="card">
          <div className="mono" style={{ fontSize: 11, color: 'var(--purple)' }}>Y HỌC</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10, fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)' }}>
            <div>Phân loại trên ảnh y khoa</div>
            <div>Hệ chẩn đoán — ví dụ MYCIN</div>
          </div>
          <div className="panel-inner mono" style={{ marginTop: 12, fontSize: 11.5, lineHeight: 1.75, color: 'var(--muted-2)', padding: '12px 14px' }}>
            <div><span style={{ color: 'var(--cyan)' }}>MYCIN:</span> Đã có kết quả nuôi cấy dương tính chưa?</div>
            <div><span style={{ color: 'var(--yellow)' }}>BÁC SĨ:</span> Có.</div>
            <div><span style={{ color: 'var(--cyan)' }}>MYCIN:</span> Nhiễm khuẩn loại nào?</div>
            <div><span style={{ color: 'var(--yellow)' }}>BÁC SĨ:</span> Nhiễm khuẩn huyết tiên phát.</div>
            <div><span style={{ color: 'var(--green)' }}>→ Tôi đề nghị dùng gentamycin liều…</span></div>
          </div>
        </div>
        <div className="card">
          <div className="mono" style={{ fontSize: 11, color: 'var(--yellow)' }}>GAME VÀ GIẢI TRÍ</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10, fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)' }}>
            {['Deep Blue thắng Kasparov (1997)', 'AlphaGo thắng Lee Sedol (2016)', 'OpenAI Five — Dota 2', 'Poker: DeepStack và Libratus (2017)'].map((t) => <div key={t}>{t}</div>)}
          </div>
          <p style={{ color: 'var(--muted-2)', fontSize: 12.5, lineHeight: 1.6, margin: '10px 0 0', fontStyle: 'italic' }}>
            Game là phòng thí nghiệm sạch nhất mà AI có: luật rõ ràng, thắng thua khỏi cãi. Buổi 5 mình sẽ mở nắp mấy con này ra xem bên trong — minimax và cắt tỉa α-β.
          </p>
        </div>
      </Reveal>
      <Reveal delay={0.15} className="card" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 10.5, color: 'var(--yellow)', letterSpacing: '.8px' }}>CÂU ĐỐ — HIỆN NAY MÁY LÀM ĐƯỢC VIỆC NÀO?</span>
          <span style={{ color: 'var(--faint)', fontSize: 12.5, fontStyle: 'italic' }}>bấm chọn việc bạn nghĩ máy làm được — không có đáp án, đây là chỗ để tự cãi với chính mình</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
          {(CANDO as string[]).map((t, i) => {
            const active = on.includes(i);
            return (
              <button key={i} onClick={() => setOn((s) => (s.includes(i) ? s.filter((v) => v !== i) : [...s, i]))} style={{
                padding: '7px 12px', borderRadius: 9, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                border: `1px solid ${active ? 'color-mix(in srgb, var(--green) 50%, transparent)' : 'var(--border)'}`,
                background: active ? 'color-mix(in srgb, var(--green) 9%, transparent)' : 'var(--panel-2)',
                color: active ? 'var(--green-soft)' : 'var(--muted)',
              }}>{t}</button>
            );
          })}
        </div>
        <p style={{ color: 'var(--muted-2)', fontSize: 12.5, lineHeight: 1.65, margin: '12px 0 0', fontStyle: 'italic' }}>
          Danh sách này viết từ nhiều năm trước. Trò vui: thử đoán hồi 2015 người ta trả lời thế nào, rồi so với câu trả lời của bạn hôm nay. Chỗ nào lệch, chỗ đó là ngành vừa tiến được một bước thật.
        </p>
      </Reveal>
      <Reveal delay={0.2} className="card" style={{ marginTop: 16, borderColor: 'color-mix(in srgb, var(--red) 30%, transparent)' }}>
        <Kicker color="var(--red)">GIỚI HẠN VÀ ĐẠO ĐỨC</Kicker>
        <p style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0', maxWidth: 840 }}>
          Nãy giờ toàn tin vui. Giờ tới phần tôi không thích lắm nhưng vẫn phải nói: cùng đúng những năng lực đó, dùng sai thì thành rủi ro thật. Bốn chuyện nên nhớ khi bạn làm đồ án, và khi bạn đi cãi nhau về AI:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12, marginTop: 14 }}>
          {[
            '<strong class="hl-red-soft">Vũ khí tự hành sát thương</strong> — máy tự quyết định mục tiêu.',
            '<strong class="hl-red-soft">Theo dõi và thuyết phục</strong> — quy mô giám sát và tác động lên dư luận. Từ khi dựng được giọng nói và khuôn mặt giả gần như thật, chi phí của một lời bịa đặt có sức thuyết phục đã rơi xuống gần bằng không.',
            '<strong class="hl-red-soft">Thiên lệch trong quyết định</strong> — hệ học từ dữ liệu cũ nên tái sinh định kiến cũ. Mô hình càng nuốt nhiều dữ liệu vơ từ Internet thì càng khó biết nó đang học định kiến của ai.',
            '<strong class="hl-red-soft">Việc làm và an toàn</strong> — tự động hóa, và những chỗ mà một lỗi là chết người. Thêm một kiểu lỗi rất mới: hệ nói sai bằng giọng chắc nịch, nghe thuyết phục hơn cả lúc nó nói đúng.',
          ].map((t) => <Html key={t} as="div" t={t} className="panel-inner" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--muted)' }} />)}
        </div>
      </Reveal>
    </div>
  );
}

/* ===== 09 · Tổng kết + tự kiểm ===== */
function Ch9() {
  interface Topic { t: string; n: string; c: string; d: string }
  const colorMap: Record<string, string> = { '#58C4DD': 'var(--cyan)', '#C792EA': 'var(--purple)', '#83C167': 'var(--green)', '#7A8399': 'var(--muted-2)' };
  return (
    <div id="ch9" className="lesson-section">
      <SectionHead no="09" title="Tổng kết — và môn này sẽ đi đâu" en="What are we going to learn?"
        lead="🧭 Một câu tóm cả buổi, nếu bạn chỉ nhớ được một câu: AI cố xây ra thực thể thông minh, có bốn cách định nghĩa “thông minh”, và mình chọn ô <strong class='hl-green'>hành động duy lý</strong> để bám theo suốt 11 buổi. Còn đây là bản đồ chặng đường phía trước." />
      <Reveal delay={0.1} style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(TOPICS as Topic[]).map((t) => {
          const c = colorMap[t.c] || t.c;
          return (
            <div key={t.t} className="card" style={{ borderLeft: `3px solid ${c}`, padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--text-hi)' }}>{t.t}</span>
                <span className="mono" style={{ fontSize: 10.5, color: c, border: `1px solid color-mix(in srgb, ${c} 33%, transparent)`, borderRadius: 7, padding: '3px 8px' }}>{t.n}</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.7, margin: '8px 0 0', maxWidth: 900 }}>{t.d}</p>
            </div>
          );
        })}
      </Reveal>
      <Reveal delay={0.2} style={{ marginTop: 24 }}>
        <CheckList storageKey="b1-checks" items={CHECKS as string[]} />
      </Reveal>
    </div>
  );
}

/* ===== 10 · Bài tập về nhà ===== */
function Ch10() {
  const recall: [string, string][] = [
    ['Bốn ô, không nhìn bảng', 'Kể tên bốn hướng tiếp cận AI và nói rõ mỗi hướng lấy gì làm chuẩn chấm. Kẹt ô nào thì quay lại <a href="#ch2">mục 02</a> — nhưng thử nhớ trước đã, nhớ hụt rồi tra mới dính lâu.'],
    ['Phép thử Turing sai ở đâu', 'Không phải “vì khó quá”. Nói cho được vì sao vượt phép thử không đồng nghĩa với thông minh, <em>và</em> vì sao trượt nó cũng không đồng nghĩa với không thông minh (<a href="#ch3">mục 03</a>).'],
    ['Mùa đông AI đến từ đâu', 'Mô tả cơ chế, không phải mốc thời gian: chuyện gì trong cách ngành này hứa hẹn đã dẫn tới chỗ cạn tiền (<a href="#ch7">mục 07</a>)?'],
  ];
  return (
    <div id="hw" className="lesson-section lesson-section--last">
      <SectionHead no="11" title="Trước khi qua <em class='hl-purple'>Buổi 2</em>" en="ba câu tự vấn · không cần giấy bút" color="var(--purple)"
        lead={`Buổi này không có đề bài tập riêng — bộ đề của khóa bắt đầu từ nội dung buổi 2, và bốn câu PEAS mà bạn có thể đã nghe nhắc tới thì tôi để đúng chỗ của chúng: <a href='${import.meta.env.BASE_URL}courses/csc14003/lessons/b2#hw'>mục 10 của Buổi 2</a>, nơi bạn có đủ đồ nghề để làm thật. Còn ba câu dưới đây thì trả lời được ngay bây giờ, bằng đúng những gì vừa đọc.`} />
      <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 14, marginTop: 22 }}>
        {recall.map(([k, body]) => (
          <div key={k} className="card">
            <div className="mono" style={{ fontSize: 11.5, color: 'var(--purple)' }}>{k.toUpperCase()}</div>
            <Html as="p" t={body} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }} />
          </div>
        ))}
      </Reveal>
      <Reveal delay={0.15} style={{ marginTop: 24, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--border-2)', paddingTop: 20 }}>
        <Html as="span" t="Tiếp theo: <strong class='hl'>Buổi 2 — Tác tử thông minh</strong>, nơi mình mổ hàm f: 𝓟 → 𝓐 ra xem bên trong — PEAS, bảy chiều môi trường, năm kiểu agent. Đúng bộ đồ nghề mà bốn câu bài tập kia đang đòi 😉" style={{ fontSize: 13, color: 'var(--muted)' }} />
        <div style={{ flex: 1 }} />
        <Link to="/courses/csc14003" style={{ fontSize: 13 }}>← Về Lộ trình</Link>
      </Reveal>
    </div>
  );
}
