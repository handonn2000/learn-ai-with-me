import { Link } from 'react-router-dom';
import { CheckList } from '@/components/CheckList';
import { Html } from '@/components/Html';
import { Kicker } from '@/components/Kicker';
import { LessonNav } from '@/components/LessonNav';
import { MathPrimer, type MathTerm } from '@/components/MathPrimer';
import { Reveal } from '@/components/Reveal';
import { DeckToggle, LessonDeck, useDeckMode } from '@/components/LessonDeck';
import { SectionHead } from '@/components/SectionHead';
import { SessionQuiz } from '@/components/SessionQuiz';
import { HW, PEAS_ROWS } from '@/content/courses/csc14003/agents-data.js';
import { MATH_PRIMERS } from '@/content/courses/csc14003/math-primers.js';
import { AgentArchDiagram } from './AgentArchDiagram';
import { EnvExplorer } from './EnvExplorer';
import { VacuumLab } from './VacuumLab';


const P: React.CSSProperties = { color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.72, margin: '10px 0 0' };

const NAV = [
          { href: '#toan', label: 'TOÁN NỀN' }, { href: '#ch1', label: '01 Agent' }, { href: '#ch2', label: '02 Hàm agent' },
          { href: '#ch3', label: '03 Duy lý', hot: true }, { href: '#ch4', label: '04 Không toàn tri' }, { href: '#ch5', label: '05 PEAS' },
          { href: '#ch6', label: '06 Môi trường', hot: true }, { href: '#ch7', label: '07 Bảng tra' }, { href: '#ch8', label: '08 Năm nấc', hot: true },
          { href: '#ch9', label: '09 Tổng kết' }, { href: '#quiz', label: '10 Quiz', hot: true }, { href: '#hw', label: '11 Bài tập' },
];
const SLIDES = [{ id: 'hero', label: 'Bìa' }, ...NAV.map((n) => ({ id: n.href.slice(1), label: n.label }))];

export default function Lesson02Agents() {
  const [deck, setDeck] = useDeckMode();
  return (
    <>
      <LessonNav badge="BUỔI 2" title="Tác tử thông minh" backTo="/courses/csc14003"
        items={NAV}
        right={<DeckToggle on={deck} onChange={setDeck} />} />

      <LessonDeck on={deck} slides={SLIDES}>
        {/* Hero */}
        <div className="lesson-hero" style={{ background: 'radial-gradient(700px 340px at 72% 10%, var(--bg-glow), transparent)' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px 10px', display: 'flex', gap: 44, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 470px', minWidth: 320 }}>
              <div className="mono" style={{ fontSize: 12, letterSpacing: '1.5px', color: 'var(--yellow)' }}>CSC14003 · BUỔI 2 · TÁC TỬ THÔNG MINH</div>
              <h1 className="hero-title" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 52, lineHeight: 1.12, margin: '16px 0 0' }}>
                Mổ con <em style={{ color: 'var(--cyan)' }}>tác tử</em><br />ra xem
              </h1>
              <Html as="p" t="Buổi trước tôi kết bài bằng một lời hứa: cả khóa này sẽ nhìn mọi thứ qua con mắt <strong class='hl'>agent</strong>. Rồi tôi bỏ đó, chưa nói agent thật ra là cái gì. Buổi này trả nợ. Hết buổi bạn sẽ viết được hàm hành vi của một agent thành ký hiệu, mô tả được bài toán bằng <strong class='hl-cyan'>PEAS</strong>, đọc được bảy chiều của môi trường, và biết một con agent có thể phức tạp tới nấc nào — từ con ếch ba luật cho tới thứ tự sửa được chính mình."
                style={{ color: 'var(--text-2)', fontSize: 15.5, lineHeight: 1.75, margin: '20px 0 0', maxWidth: 620 }} />
            </div>
            <div style={{ flex: '1 1 340px', minWidth: 300 }}>
              <svg viewBox="0 0 380 240" style={{ width: '100%', display: 'block' }} role="img" aria-label="Agent nhận tri giác từ môi trường và trả lại hành động">
                <defs>
                  <marker id="hero-ah" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto">
                    <path d="M0,0 L7,3.5 L0,7 z" fill="var(--cyan)" />
                  </marker>
                  <marker id="hero-ah2" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto">
                    <path d="M0,0 L7,3.5 L0,7 z" fill="var(--yellow)" />
                  </marker>
                </defs>
                <rect x={10} y={70} width={140} height={100} rx={14} fill="var(--panel)" stroke="var(--border-2)" />
                <text x={80} y={112} textAnchor="middle" fontFamily="var(--font-serif)" fontSize={17} fill="var(--text-hi)">Agent</text>
                <text x={80} y={133} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10} fill="var(--faint)">f : 𝓟* → 𝓐</text>
                <rect x={230} y={70} width={140} height={100} rx={14} fill="var(--panel-2)" stroke="var(--border-2)" />
                <text x={300} y={125} textAnchor="middle" fontFamily="var(--font-serif)" fontSize={16} fill="var(--muted)">Môi trường</text>
                <path d="M228,96 C190,70 170,70 152,94" fill="none" stroke="var(--cyan)" strokeWidth={1.5} markerEnd="url(#hero-ah)" />
                <text x={190} y={62} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10.5} fill="var(--cyan)">tri giác · percepts</text>
                <path d="M152,146 C170,172 190,172 228,146" fill="none" stroke="var(--yellow)" strokeWidth={1.5} markerEnd="url(#hero-ah2)" />
                <text x={190} y={192} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10.5} fill="var(--yellow)">hành động · actions</text>
                <text x={80} y={56} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9.5} fill="var(--faint-2)">cảm biến</text>
                <text x={80} y={192} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9.5} fill="var(--faint-2)">bộ chấp hành</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Toán nền */}
        <div id="toan" className="lesson-section lesson-section--first">
          <MathPrimer {...(MATH_PRIMERS.b2 as { minutes: number; lead: string; terms: MathTerm[] })} />
        </div>

        {/* 01 */}
        <div id="ch1" className="lesson-section">
          <SectionHead no="01" title="Agent là gì — và vì sao định nghĩa nó <em class='hl-cyan'>rộng đến thế</em>" en="Agents and environments" color="var(--cyan)"
            lead="Hãy nghĩ tới một trợ lý lập trình đang chạy trên máy bạn. Nó <em>đọc</em> file trong dự án, đọc thông báo lỗi từ trình biên dịch — rồi nó <em>sửa</em> file, <em>chạy</em> lệnh trong terminal. Đọc là cảm biến, sửa và chạy là bộ chấp hành. Bỏ hết tên riêng đi thì còn lại đúng một khuôn.<br/><br/>Khuôn đó là định nghĩa của cả buổi: <strong class='hl'>agent là thứ tri giác được môi trường qua cảm biến, và tác động lên môi trường qua bộ chấp hành</strong>. Gọn tới mức nghe như chưa nói gì, và bạn có quyền hỏi “thế thì cái gì chẳng phải agent?”. Câu hỏi đúng đấy — câu trả lời chính là lý do người ta chọn định nghĩa rộng đến vậy." />
          <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 14 }}>
            {[
              ['AGENT NGƯỜI', 'var(--cyan)', 'mắt, tai, và mấy giác quan còn lại', 'tay, chân, dây thanh quản'],
              ['AGENT ROBOT', 'var(--green)', 'camera, cảm biến hồng ngoại đo khoảng cách', 'cần gạt, mô-tơ'],
              ['AGENT PHẦN MỀM', 'var(--yellow)', 'phím bạn gõ, nội dung file, gói tin mạng', 'màn hình, ổ đĩa, bộ định tuyến'],
            ].map(([k, c, sen, act]) => (
              <div key={k} className="card">
                <Kicker color={c}>{k}</Kicker>
                <div style={{ marginTop: 12, display: 'grid', gap: 9 }}>
                  <div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--faint)' }}>SENSORS · CẢM BIẾN</div>
                    <div style={{ fontSize: 13.5, color: 'var(--text-2)', marginTop: 2 }}>{sen}</div>
                  </div>
                  <div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--faint)' }}>ACTUATORS · BỘ CHẤP HÀNH</div>
                    <div style={{ fontSize: 13.5, color: 'var(--text-2)', marginTop: 2 }}>{act}</div>
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.15} className="card" style={{ marginTop: 14 }}>
            <Kicker>VÌ SAO PHẢI RỘNG NHƯ VẬY</Kicker>
            <Html as="p" t="Vì đây là <strong class='hl'>công cụ để mổ xẻ hệ thống</strong>, không phải nhãn dán để phân loại đồ vật. Mọi ngành kỹ thuật đều đang chế ra những thứ tương tác với thế giới; chỗ riêng của AI là những thứ có kha khá năng lực tính toán và phải ra quyết định không hề tầm thường. Định nghĩa rộng cho phép bạn dùng chung một bộ đồ nghề để soi con robot hút bụi, chương trình cờ vua, lẫn cái hệ gợi ý video — và đó chính là thứ giúp bạn khỏi phải học lại từ đầu ở mỗi buổi sau." style={P} />
          </Reveal>
        </div>

        {/* 02 */}
        <div id="ch2" className="lesson-section">
          <SectionHead no="02" title="Từ “hành vi” mơ hồ tới một <em class='hl-yellow'>hàm</em>" en="Percept sequence · agent function · agent program" color="var(--yellow)"
            lead="🧹 Nói “agent cư xử thông minh” thì dễ, nhưng muốn kiểm tra thì phải viết ra được nó cư xử <em>thế nào</em>. Cách viết ấy đây: gom mọi thứ agent từng cảm nhận từ lúc bật máy tới giờ thành một chuỗi, rồi hỏi chuỗi đó dẫn tới hành động nào." />
          <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 14 }}>
            <div className="card">
              <Kicker color="var(--yellow)">BA CHỮ CẦN PHÂN BIỆT</Kicker>
              <div style={{ display: 'grid', gap: 11, marginTop: 12 }}>
                <Html t="<strong class='hl-yellow'>Percept · tri giác</strong> — thứ cảm biến đưa vào tại <em>một khoảnh khắc</em>. Một tấm ảnh, một dòng cảm biến, một lần thôi." style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--text-2)' }} />
                <Html t="<strong class='hl-yellow'>Percept sequence · chuỗi tri giác</strong> — toàn bộ lịch sử, từ tri giác đầu tiên tới cái vừa nhận. Không sót cái nào." style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--text-2)' }} />
                <Html t="<strong class='hl-yellow'>Agent function · hàm agent</strong> — luật gán mỗi chuỗi tri giác cho đúng một hành động. Đây là <em>mô tả toán học</em> của hành vi, không phải code." style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--text-2)' }} />
              </div>
              <div className="panel-inner" style={{ marginTop: 13 }}>
                <Html as="p" t="Còn <strong class='hl'>agent program · chương trình agent</strong> mới là phần chạy được. Nó khác hàm agent ở một chỗ rất thực tế: hàm nhận cả chuỗi lịch sử, còn chương trình mỗi lần chỉ được đưa cho <strong class='hl'>đúng tri giác hiện tại</strong> — muốn nhớ quá khứ thì phải tự lo lấy chỗ mà cất. Chi tiết nhỏ này sẽ quay lại cắn bạn ở mục <a href='#ch8'>08</a>." style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: 0 }} />
              </div>
            </div>
            <div className="card">
              <Kicker color="var(--cyan)">THẾ GIỚI HÚT BỤI HAI Ô</Kicker>
              <Html as="p" t="Thế giới nhỏ nhất mà vẫn đủ dạy: <strong class='hl'>hai ô</strong> tên A và B, mỗi ô sạch hoặc bẩn, con robot đứng ở một trong hai. Tri giác là cặp <span class='code-inline'>[vị trí, tình trạng]</span>. Hành động có bốn: sang trái, sang phải, hút, đứng yên." style={P} />
              <div style={{ marginTop: 12, overflowX: 'auto' }}>
                <table className="dtable" style={{ minWidth: 380 }}>
                  <tbody>
                    <tr className="dtable__head"><td>CHUỖI TRI GIÁC</td><td>HÀNH ĐỘNG</td></tr>
                    {[
                      ['[A, Clean]', 'Right'], ['[A, Dirty]', 'Suck'], ['[B, Clean]', 'Left'], ['[B, Dirty]', 'Suck'],
                      ['[A, Clean], [A, Clean]', 'Right'], ['[A, Clean], [A, Dirty]', 'Suck'],
                    ].map(([a, b]) => (
                      <tr key={a}><td className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>{a}</td>
                        <td className="mono" style={{ fontSize: 11.5, color: 'var(--yellow)' }}>{b}</td></tr>
                    ))}
                    <tr><td className="mono" style={{ fontSize: 11.5, color: 'var(--faint-2)' }}>⋮</td><td className="mono" style={{ fontSize: 11.5, color: 'var(--faint-2)' }}>⋮</td></tr>
                  </tbody>
                </table>
              </div>
              <Html as="p" t="Cái dấu ⋮ ở cuối bảng mới là chỗ đáng sợ. Tri giác chỉ có <strong class='hl'>4 loại</strong> — hai ô nhân hai tình trạng, đúng tích Descartes ở thẻ toán nền. Nhưng chuỗi dài 10 bước thì số chuỗi phải liệt kê là 4 + 4² + … + 4¹⁰ = <strong class='hl-red'>1.398.100 dòng</strong>. Một thế giới có đúng hai ô, và bảng đã hơn một triệu dòng cho mười bước đầu. Lát tới lab ở mục <a href='#ch3'>03</a>, bấm sang thế giới <strong class='hl'>bốn ô</strong> rồi nghĩ lại con số này: tri giác thành 8 loại, cùng mười bước đó bảng phình lên <strong class='hl-red'>1.227.133.512 dòng</strong> — thêm hai ô thôi mà dài gấp gần 900 lần." style={P} />
            </div>
          </Reveal>
          <Reveal delay={0.2} className="card" style={{ marginTop: 14, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px 0' }}>
              <Kicker color="var(--green)">MAY LÀ KHÔNG AI VIẾT CÁI BẢNG ĐÓ — BỐN DÒNG NÀY LÀM ĐÚNG VIỆC ĐÓ</Kicker>
            </div>
            <pre className="codeblock" style={{ marginTop: 12 }}>{`function REFLEX-VACUUM-AGENT([location, status]) returns an action
      if status = Dirty then return Suck
      else if location = A then return Right
      else if location = B then return Left`}</pre>
          </Reveal>
        </div>

        {/* 03 */}
        <div id="ch3" className="lesson-section">
          <SectionHead no="03" title="“Làm điều đúng” — nhưng <em class='hl-green'>ai chấm</em>?" en="Rationality · performance measure" color="var(--green)"
            lead="Giả sử bạn thuê người dọn nhà và trả công theo <em>số ký rác hốt được</em>. Tuần đầu sạch bong. Tuần thứ ba, bạn bắt đầu thấy rác xuất hiện ở những chỗ trước giờ chưa từng có rác.<br/><br/>Không ai gian cả — người đó chỉ đang tối đa đúng cái bạn đo. Agent duy lý là agent làm điều đúng, nhưng “đúng” theo ai? Thứ tôi muốn bạn mang về từ mục này là: <strong class='hl'>cái thước không nằm trong agent, nó nằm ở người thiết kế</strong> — nên đặt sai thước thì agent càng giỏi càng tai hại." />
          <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 14 }}>
            <div className="card">
              <Kicker color="var(--green)">THƯỚC ĐO HIỆU NĂNG · PERFORMANCE MEASURE</Kicker>
              <Html as="p" t="Nó chấm <strong class='hl'>chuỗi trạng thái của MÔI TRƯỜNG</strong>, không chấm trạng thái của agent. Chỗ này đáng gạch chân: agent có thể tự thấy mình đang làm rất tốt, tự tin ngời ngời — điểm vẫn là điểm của sàn nhà, không phải điểm của sự tự tin." style={P} />
              <div className="panel-inner" style={{ marginTop: 12 }}>
                <Kicker>LUẬT ĐẶT THƯỚC</Kicker>
                <Html as="p" t="Đặt thước theo <strong class='hl'>thứ bạn thật sự muốn có trong môi trường</strong>, chứ đừng theo cách bạn nghĩ agent nên cư xử. Ví dụ kinh điển: chấm “hốt được bao nhiêu rác trong ca tám tiếng” nghe rất hợp lý — cho tới khi bạn nhận ra agent tối đa điểm đó bằng cách hốt rác lên rồi đổ xuống hốt lại. Cái bạn muốn là <em>sàn sạch</em>, vậy thì chấm sàn sạch." style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '7px 0 0' }} />
              </div>
            </div>
            <div className="card">
              <Kicker color="var(--green)">ĐỊNH NGHĨA ĐẦY ĐỦ — BỐN THỨ NÓ TỰA VÀO</Kicker>
              <Html as="p" t="<em>Với mỗi chuỗi tri giác có thể có, một agent duy lý chọn hành động được kỳ vọng làm tối đa thước đo hiệu năng của nó, dựa trên bằng chứng mà chuỗi tri giác cung cấp và tri thức có sẵn mà agent mang trong mình.</em>" style={{ ...P, color: 'var(--text-hi)' }} />
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                {[
                  ['THƯỚC ĐO', 'định nghĩa thế nào là thành công'],
                  ['TRI THỨC CÓ SẴN', 'agent biết gì về môi trường từ trước'],
                  ['CHUỖI TRI GIÁC', 'nó đã thấy được những gì tới giờ'],
                  ['HÀNH ĐỘNG', 'nó làm được những gì'],
                ].map(([k, v]) => (
                  <div key={k} className="stat"><div className="stat__k">{k}</div><div className="stat__v" style={{ fontSize: 12.5, fontWeight: 400, color: 'var(--text-2)' }}>{v}</div></div>
                ))}
              </div>
              <Html as="p" t="Đổi bất kỳ cái nào trong bốn thứ này, câu trả lời “có duy lý không” đổi theo. Lab ngay dưới cho bạn đổi cái thứ nhất và tự thấy." style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '12px 0 0' }} />
            </div>
          </Reveal>

          <Reveal delay={0.15} style={{ marginTop: 16 }}>
            <VacuumLab />
          </Reveal>

          <Reveal delay={0.15} className="card" style={{ marginTop: 14, borderColor: 'color-mix(in srgb, var(--yellow) 30%, transparent)' }}>
            <Kicker color="var(--yellow)">BA THÍ NGHIỆM TÔI MUỐN BẠN TỰ LÀM NGAY BÂY GIỜ</Kicker>
            <Html as="p" t="<strong class='hl'>Một:</strong> chọn sàn “đã sạch bong”, rồi bấm qua lại giữa hai chương trình mà nhìn bảng điểm cuối. Thước A chấm cả hai <strong class='hl-green'>40 — 40</strong>, hòa. Thêm đúng một dòng “đi lại tốn xăng” vào thước đo thì thành <strong class='hl-red'>20 — 39</strong>. Không dòng code nào của hai chương trình thay đổi cả; chỉ cái thước đổi, và con phản xạ thuần từ chỗ hoàn hảo tụt xuống thảm hại." style={P} />
            <Html as="p" t="<strong class='hl'>Hai:</strong> vẫn sàn sạch bong, chạy “phản xạ + trí nhớ” từ bước 0 và soi dòng SỔ TAY. Bước 1 nó vẫn phải đi sang B — vì nó <em>chưa nhìn thấy</em> B bao giờ, mà chưa thấy thì chưa có quyền kết luận. Nhìn thấy rồi mới dám nghỉ. Đó là bài học về thu thập thông tin ở mục <a href='#ch4'>04</a>, và là lý do phải có trí nhớ ở mục <a href='#ch8'>08</a> — bạn vừa gặp nó trước khi tôi kịp giảng." style={P} />
            <Html as="p" t="<strong class='hl'>Ba:</strong> bấm nút <strong class='hl-cyan'>4 ô</strong>, vẫn để sàn sạch bong. Thước A vẫn hòa <strong class='hl-green'>80 — 80</strong>, thước B giãn ra thành <strong class='hl-red'>60 — 77</strong>. Mà chuyện hay nhất nằm ở băng hành động: con phản xạ thuần lết tới ô D rồi <strong class='hl'>ping-pong giữa C và D tới hết đời</strong> — A và B nó không bao giờ quay lại nữa. Luật “ở ô cuối thì lùi, còn lại thì tiến” nghe hợp lý ở hai ô, sang bốn ô là thành cái bẫy. Bản có trí nhớ thì tốn ba bước đi thăm dò rồi nghỉ hẳn: <em>đi tốn xăng, nhưng đi để biết mà nghỉ vẫn rẻ hơn đi mù</em>." style={P} />
          </Reveal>
        </div>

        {/* 04 */}
        <div id="ch4" className="lesson-section">
          <SectionHead no="04" title="Duy lý <em class='hl-purple'>không phải</em> là hoàn hảo" en="Omniscience · information gathering · learning · autonomy" color="var(--purple)"
            lead="Đây là chỗ tôi thấy người học hiểu sai nhiều nhất, và hiểu sai từ buổi 1. Duy lý không có nghĩa là luôn ra kết quả tốt nhất — vì kết quả còn phụ thuộc những thứ agent không có cách nào biết trước." />
          <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 14 }}>
            {[
              ['TOÀN TRI · OMNISCIENCE', 'var(--red)', 'Biết trước kết quả thật của mọi hành động, không còn khả năng nào khác xảy ra. Nghe thì sướng, nhưng ngoài đời <strong class="hl">không tồn tại</strong>. Bạn sang đường lúc đường vắng hoe rồi bị cánh cửa máy bay rơi trúng — quyết định đó vẫn duy lý, chỉ là xui. Duy lý chấm <em>quyết định</em>, không chấm <em>kết quả</em>.'],
              ['THU THẬP THÔNG TIN', 'var(--cyan)', 'Làm một việc chỉ để <strong class="hl">sửa những gì mình sẽ thấy về sau</strong> — ngó trái ngó phải trước khi sang đường, mở nắp ra soi, đi thăm dò. Nghe như phí một nước đi, nhưng nó là một phần của tính duy lý: nhắm mắt băng qua đường thì không xui, mà là ẩu.'],
              ['HỌC · LEARNING', 'var(--green)', 'Agent duy lý phải học được càng nhiều càng tốt từ những gì nó tri giác. Cấu hình ban đầu do người thiết kế nạp vào chỉ là điểm xuất phát, gặp trải nghiệm thì phải được sửa và bồi thêm. Có những trường hợp cực đoan mà môi trường đã biết trước hoàn toàn — khi đó khỏi cần học, nhưng đó là ngoại lệ hiếm.'],
              ['TỰ CHỦ · AUTONOMY', 'var(--yellow)', 'Agent nào chỉ sống bằng tri thức người thiết kế nhét sẵn, không thèm đếm xỉa tới tri giác của chính mình, thì agent đó <strong class="hl">thiếu tính tự chủ</strong>. Cái đồng hồ treo tường là ví dụ: không đầu vào, chạy đúng thuật toán đã lên dây, không học, không kinh nghiệm. Nó chỉ đúng giờ chừng nào không ai bê nó sang múi giờ khác.'],
            ].map(([k, c, body]) => (
              <div key={k} className="card">
                <Kicker color={c}>{k}</Kicker>
                <Html as="p" t={body} style={P} />
              </div>
            ))}
          </Reveal>
        </div>

        {/* 05 */}
        <div id="ch5" className="lesson-section">
          <SectionHead no="05" title="PEAS — bốn câu hỏi <em class='hl-cyan'>trước khi</em> gõ dòng code đầu tiên" en="Specifying the task environment" color="var(--cyan)"
            lead="🧭 Môi trường tác vụ chính là <em>bài toán</em>, còn agent duy lý là <em>lời giải</em>. Mà chưa phát biểu xong bài toán thì lời giải nào cũng chỉ là đoán. PEAS là bốn câu hỏi bắt bạn phát biểu cho xong — và nó phải là bước đầu tiên, làm càng đầy đủ càng tốt." />
          <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))', gap: 14 }}>
            {[
              ['P', 'Performance measure', 'Thước đo hiệu năng', 'Lấy gì chấm điểm agent này?', 'var(--green)'],
              ['E', 'Environment', 'Môi trường', 'Nó sống giữa những gì?', 'var(--cyan)'],
              ['A', 'Actuators', 'Bộ chấp hành', 'Nó tác động ra bằng đường nào?', 'var(--yellow)'],
              ['S', 'Sensors', 'Cảm biến', 'Nó nhận thông tin vào bằng đường nào?', 'var(--purple)'],
            ].map(([l, en, vn, q, c]) => (
              <div key={l} className="card" style={{ borderColor: `color-mix(in srgb, ${c} 30%, transparent)` }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span className="mono" style={{ fontSize: 26, fontWeight: 700, color: c }}>{l}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{vn}</span>
                </div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--faint)', marginTop: 2 }}>{en}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 10, lineHeight: 1.6 }}>{q}</div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.15} className="card" style={{ marginTop: 14, padding: '20px 22px' }}>
            <Kicker color="var(--cyan)">SÁU AGENT, SÁU BẢN MÔ TẢ PEAS</Kicker>
            <Html as="p" t="Hàng đầu là chiếc taxi tự lái, ví dụ đáng mổ kỹ nhất. Đọc lướt cả bảng một lượt rồi để ý: cột <strong class='hl'>P</strong> ngắn nhất mà lại khó viết nhất, vì nó là chỗ bạn phải quyết định thế nào là thành công — và như mục <a href='#ch3'>03</a> vừa cho thấy, viết hớ ở cột này là hỏng cả hệ thống." style={{ ...P, marginBottom: 4 }} />
            <div style={{ marginTop: 12, overflowX: 'auto' }}>
              <table className="dtable" style={{ minWidth: 900 }}>
                <tbody>
                  <tr className="dtable__head">
                    <td style={{ width: 170 }}>AGENT</td><td>P · THƯỚC ĐO</td><td>E · MÔI TRƯỜNG</td><td>A · BỘ CHẤP HÀNH</td><td>S · CẢM BIẾN</td>
                  </tr>
                  {(PEAS_ROWS as { agent: string; en: string; hero?: boolean; p: string; e: string; a: string; s: string }[]).map((r) => (
                    <tr key={r.agent}>
                      <td>
                        <div style={{ fontSize: 13, fontWeight: r.hero ? 700 : 400, color: r.hero ? 'var(--cyan)' : 'var(--text-2)' }}>{r.agent}</div>
                        <div className="mono" style={{ fontSize: 10, color: 'var(--faint-2)' }}>{r.en}</div>
                      </td>
                      <td style={{ color: 'var(--muted)', fontSize: 12.5 }}>{r.p}</td>
                      <td style={{ color: 'var(--muted)', fontSize: 12.5 }}>{r.e}</td>
                      <td style={{ color: 'var(--muted)', fontSize: 12.5 }}>{r.a}</td>
                      <td style={{ color: 'var(--muted)', fontSize: 12.5 }}>{r.s}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Reveal delay={0.2} style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 14 }}>
            <div className="card">
              <Kicker color="var(--purple)">SOFTBOT — KHI MÔI TRƯỜNG KHÔNG PHẢI THẾ GIỚI THẬT</Kicker>
              <Html as="p" t="Trình mô phỏng bay, game, Internet — toàn môi trường nhân tạo, nhưng phức tạp chẳng kém gì thật. Agent sống trong đó gọi là <strong class='hl'>softbot</strong>, mọi bộ phận đều là phần mềm: cảm biến là gói tin và nội dung file, bộ chấp hành là màn hình và ổ đĩa. Đừng nhầm “nhân tạo” với “dễ”." style={P} />
            </div>
            <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--yellow) 30%, transparent)' }}>
              <Kicker color="var(--yellow)">THỬ NGAY, ĐỪNG ĐỌC TIẾP VỘI</Kicker>
              <Html as="p" t="Viết PEAS cho hai việc này, và cố ý đặt chúng cạnh nhau: <strong class='hl'>(1) đánh một trận tennis trong giải đấu</strong> — <strong class='hl'>(2) tập tennis bằng cách đập bóng vào tường</strong>. Cùng một môn thể thao, cùng cây vợt, nhưng cột P của hai bên khác nhau hoàn toàn. Giữ lại tờ giấy đó, mục <a href='#ch6'>06</a> sẽ bắt bạn dùng lại chính hai việc này." style={P} />
            </div>
          </Reveal>
        </div>

        {/* 06 */}
        <div id="ch6" className="lesson-section">
          <SectionHead no="06" title="Bảy chiều để <em class='hl-yellow'>đo</em> một môi trường" en="Properties of task environments" color="var(--yellow)"
            lead="🎛️ Trước khi đọc tiếp, trả lời giúp tôi một câu: <strong class='hl'>poker và backgammon khác nhau ở mấy chiều?</strong><br/><br/>Đúng một chiều. Cả hai đều có yếu tố may rủi, đều rời rạc, đều nhiều người chơi — nhưng backgammon bày hết quân ra bàn còn poker thì úp bài. Nếu lúc nãy bạn định trả lời “hai chiều, vì poker còn ngẫu nhiên nữa”, thì bạn vừa dính đúng cái bẫy mà bảng dưới đây sinh ra để gỡ: <em>nhìn thấy hết</em> và <em>đoán trước được</em> là hai chuyện độc lập.<br/><br/>Bảy cặp chiều dưới đây là bộ số đo cho biết bạn đang đối mặt với cái gì — và quan trọng hơn, chúng quyết định kiến trúc agent tối thiểu bạn buộc phải dùng. Càng nhiều chiều rơi về vế phải, bài toán càng khó." />
          <Reveal delay={0.1} style={{ marginTop: 22 }}>
            <EnvExplorer />
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 14 }}>
            <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
            <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--cyan) 30%, transparent)' }}>
              <Kicker color="var(--cyan)">CHIỀU QUAN SÁT ĐÁNG ĐƯỢC NÓI KỸ HƠN MỘT CÁI NHÃN</Kicker>
              <Html as="p" t="<strong class='hl'>Quan sát đầy đủ</strong> nghĩa là cảm biến đưa cho agent <em>toàn bộ</em> trạng thái của môi trường. Phần thưởng đi kèm rất cụ thể: agent khỏi cần giữ trạng thái trong, vì chẳng có gì để mà nhớ — nhìn phát nào biết hết phát đó." style={P} />
              <Html as="p" t="Rơi xuống <strong class='hl'>một phần</strong> thì do một trong hai lý do, và chúng khác nhau hẳn. <strong class='hl-cyan'>Lý do một — cảm biến nhiễu hoặc thiếu chính xác:</strong> thông tin có tới, nhưng tới sai. <strong class='hl-cyan'>Lý do hai — một mảng trạng thái đơn giản là không có mặt trong dữ liệu cảm biến:</strong> con robot ở mục <a href='#ch3'>03</a> chỉ có cảm biến bẩn <em>tại chỗ nó đứng</em>, nên nó không thể biết ô bên kia thế nào — đó chính là lý do bản có trí nhớ vẫn phải lết sang B một chuyến rồi mới dám nghỉ. Bạn đã thấy tận mắt trước khi tôi kịp đặt tên cho nó." style={P} />
              <Html as="p" t="Và có mức cùng cực: <strong class='hl-red'>không quan sát được · unobservable</strong> — agent không có cảm biến nào hết. Nghe như đùa, nhưng vẫn còn cửa: nó phải hành động dựa trọn vào tri thức có sẵn, kiểu nhắm mắt đi theo một lộ trình đã tính trước." style={P} />
            </div>
            <div className="card">
              <Kicker color="var(--yellow)">CHIỀU THỨ BẢY — VÀ VÌ SAO NÓ KHÔNG CÓ TRONG BẢNG TRÊN</Kicker>
              <Html as="p" t="<strong class='hl-yellow'>Biết vs không biết · known vs unknown</strong>. Môi trường <em>biết</em> là môi trường mà kết quả của mọi hành động đã được cho sẵn (hoặc xác suất kết quả, nếu nó ngẫu nhiên). Không biết thì agent phải tự học lấy cách nó vận hành mới ra quyết định tử tế được." style={P} />
              <Html as="p" t="Tôi tách nó ra khỏi bảng khám phá vì nó <strong class='hl'>không cùng loại</strong> với sáu chiều kia: sáu chiều kia mô tả bản thân môi trường, còn chiều này mô tả <em>trạng thái hiểu biết của agent</em> về môi trường. Hai thứ độc lập nhau — bạn hoàn toàn có thể quan sát đầy đủ một trò chơi mà vẫn không biết luật, như lần đầu ngồi vào bàn cờ vây." style={P} />
            </div>
            </div>
            <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
              <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--green) 30%, transparent)' }}>
                <Kicker color="var(--green)">MÔI TRƯỜNG DỄ NHẤT</Kicker>
                <Html as="p" t="Quan sát đầy đủ · tất định · từng hồi · tĩnh · rời rạc · một agent. Gặp được bộ này thì bạn đang ở thiên đường." style={{ ...P, fontSize: 13 }} />
              </div>
              <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--red) 30%, transparent)' }}>
                <Kicker color="var(--red)">VÀ HẦU HẾT TÌNH HUỐNG ĐỜI THỰC</Kicker>
                <Html as="p" t="Quan sát một phần · ngẫu nhiên · tuần tự · động · liên tục · nhiều agent. Đủ bộ vế phải. Bấm lại “Lái taxi” ở bảng trên mà xem — nó chính là hàng này." style={{ ...P, fontSize: 13 }} />
              </div>
              <div className="card">
                <Kicker>HAI CHỖ HAY BỊ LẪN — VÀ MỘT CHỖ ĐÁNH DẤU SẴN CHO BUỔI 5</Kicker>
                <Html as="p" t="<strong class='hl'>Từng hồi ≠ tĩnh.</strong> Từng hồi nói về việc quyết định bây giờ có ảnh hưởng quyết định sau không; tĩnh nói về việc môi trường có tự đổi trong lúc bạn ngồi nghĩ không. Robot gắp linh kiện là từng hồi mà vẫn động." style={{ ...P, fontSize: 13 }} />
                <Html as="p" t="<strong class='hl'>Ngẫu nhiên ≠ nhiều agent.</strong> Chẩn đoán y khoa đầy bất ngờ nhưng chỉ một agent — con vi khuẩn không tính toán để hạ bạn. Cứ hỏi: hành vi của thực thể kia có nhằm tối đa một thước đo phụ thuộc vào hành vi của tôi không? Có thì mới là agent." style={{ ...P, fontSize: 13 }} />
                <Html as="p" t="Và khi đã có nhiều agent thì còn chia tiếp làm hai loại, tùy vào thước đo của họ ăn nhau thế nào. <strong class='hl-red'>Cạnh tranh</strong>: tôi được điểm nghĩa là bạn mất điểm — cờ vua, bạn thắng thì tôi thua, không có đường nào khác. <strong class='hl-green'>Hợp tác</strong>: cùng lái xe trên đường, ai cũng muốn về nhà và <em>không ai muốn đâm nhau cả</em>, nên thước đo của tôi và của bạn phần lớn cùng chiều. Nhớ chữ cạnh tranh — buổi 5 gọi tên nó thành “tìm kiếm đối kháng”, và toàn bộ minimax mọc ra từ đúng chỗ này." style={{ ...P, fontSize: 13 }} />
              </div>
            </div>
          </Reveal>
        </div>

        {/* 07 */}
        <div id="ch7" className="lesson-section">
          <SectionHead no="07" title="Sao không nhét sẵn <em class='hl-red'>mọi đáp án</em> vào một cái bảng?" en="agent = architecture + program · the table-driven agent" color="var(--red)"
            lead="📇 Hàm agent đã là một bảng tra rồi mà: chuỗi tri giác nào ra hành động nấy. Vậy cứ liệt kê hết ra, tra bảng, xong. <strong class='hl'>Nó sai ở đâu?</strong><br/><br/>Thử loại trừ trước khi đọc tiếp. Chạy chậm? Không, tra bảng là thao tác nhanh nhất đời. Không nhớ được quá khứ? Cũng không, nó nhớ nguyên cả chuỗi. Không xử được môi trường ngẫu nhiên? Vẫn không phải.<br/><br/>Nó sai ở một chỗ tầm thường tới mức dễ bị bỏ qua — và đó lại chính là cửa vào chỗ hiểm nhất của cả ngành." />
          <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 14 }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px 0' }}>
                <Kicker color="var(--red)">AGENT TRA BẢNG · TABLE-DRIVEN-AGENT</Kicker>
              </div>
              <pre className="codeblock" style={{ marginTop: 12 }}>{`function TABLE-DRIVEN-AGENT(percept) returns an action
      persistent: percepts, một chuỗi, ban đầu rỗng
                  table, bảng hành động, đánh chỉ mục theo
                         chuỗi tri giác, ban đầu đã điền đủ

      nối percept vào cuối percepts
      action ← LOOKUP(percepts, table)
      return action`}</pre>
              <div style={{ padding: '14px 20px 18px' }}>
                <Html as="p" t="Nó giữ nguyên cả chuỗi tri giác trong bộ nhớ, mỗi lần có tri giác mới thì nối vào rồi tra. Gọn gàng, và <strong class='hl'>làm đúng y những gì ta muốn</strong>." style={{ ...P, marginTop: 0 }} />
              </div>
            </div>
            <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--red) 30%, transparent)' }}>
              <Kicker color="var(--red)">CON SỐ GIẾT CHẾT Ý TƯỞNG ĐÓ</Kicker>
              <Html as="p" t="Gọi <span class='code-inline'>P</span> là số tri giác có thể có và <span class='code-inline'>T</span> là tuổi thọ agent tính bằng số tri giác nó sẽ nhận. Kích thước bảng là tổng của <span class='code-inline'>P^t</span> với t chạy từ 1 tới T. Với cờ vua, lấy P ≈ 10 và T = 150 nước, bảng cần <strong class='hl-red'>ít nhất 10¹⁵⁰ dòng</strong>." style={P} />
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <div className="stat stat--bad stat--bad-b"><div className="stat__k">BẢNG TRA CỜ VUA</div><div className="stat__v">10¹⁵⁰ dòng</div></div>
                <div className="stat"><div className="stat__k">NGUYÊN TỬ TRONG VŨ TRỤ QUAN SÁT ĐƯỢC</div><div className="stat__v" style={{ color: 'var(--muted)' }}>≈ 10⁸⁰</div></div>
              </div>
              <Html as="p" t="Không phải “hơi to”. Là to hơn vũ trụ bảy mươi bậc — bạn có gom hết vật chất trong vũ trụ lại làm ổ cứng cũng không đủ chỗ ghi một phần tỉ tỉ tỉ của cái bảng đó 😅" style={P} />
            </div>
          </Reveal>
          <Reveal delay={0.15} className="card" style={{ marginTop: 14, borderColor: 'color-mix(in srgb, var(--green) 32%, transparent)' }}>
            <Kicker color="var(--green)">VẬY THÌ THÁCH THỨC CỐT LÕI CỦA AI LÀ GÌ</Kicker>
            <Html as="p" t="Viết được chương trình <strong class='hl'>sinh ra hành vi duy lý từ một lượng code nhỏ, thay vì từ một lượng dòng bảng khổng lồ</strong>. Đó là một câu, nhưng nó là cả cái ngành." style={{ ...P, fontSize: 14.5 }} />
            <Html as="p" t="Có một phép so sánh làm chuyện này rõ ngay: tính căn bậc hai. Bạn có thể lập bảng tra căn bậc hai cho mọi số — hoặc viết <strong class='hl-green'>năm dòng theo phương pháp Newton</strong>. Năm dòng đó thắng cái bảng ở mọi mặt: nhỏ hơn, chạy được với số chưa từng có trong bảng, và ai đọc cũng hiểu được vì sao nó đúng. Mọi buổi còn lại của khóa này — tìm kiếm, logic, học máy — đều là những cách khác nhau để đi tìm “năm dòng Newton” cho các bài toán khó hơn." style={P} />
            <div className="panel-inner" style={{ marginTop: 13 }}>
              <Html as="p" t="Nhân tiện nhắc lại công thức của mục này: <strong class='hl'>agent = kiến trúc + chương trình</strong>. Kiến trúc là cái máy có cảm biến và bộ chấp hành thật — máy tính thường, hay chiếc xe gắn đầy camera. Chương trình phải hợp với kiến trúc: chương trình bảo “đi bộ” thì kiến trúc phải có chân." style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: 0 }} />
            </div>
          </Reveal>
        </div>

        {/* 08 */}
        <div id="ch8" className="lesson-section">
          <SectionHead no="08" title="Năm nấc thang, từ <em class='hl-purple'>con ếch</em> tới thứ tự sửa được mình" en="The structure of agents" color="var(--purple)"
            lead="🪜 Con ếch ngồi bên bờ ao sống được bằng đúng ba luật: vật nhỏ đang động thì đớp, vật lớn đang động thì né, còn lại thì thôi. Ba luật, không trí nhớ, không mục tiêu — vậy mà đủ nuôi sống cả một loài suốt hàng triệu năm.<br/><br/>Nó là nấc thấp nhất trong năm nấc dưới đây. Năm kiến trúc này thường được vẽ rời nhau thành năm sơ đồ, nhìn vậy dễ tưởng chúng là năm lựa chọn ngang hàng — không phải. Chúng là <strong class='hl'>một sơ đồ lớn dần</strong>, mỗi nấc thêm đúng một thứ để chữa đúng một chỗ chết của nấc dưới. Bấm 1 → 5 và nhìn hộp vàng." />
          <Reveal delay={0.1} style={{ marginTop: 22 }}>
            <AgentArchDiagram />
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 14 }}>
            <div className="card">
              <Kicker color="var(--cyan)">CON ẾCH — MỘT AGENT PHẢN XẠ CÓ THẬT NGOÀI TỰ NHIÊN</Kicker>
              <Html as="p" t="Tri giác vào chỉ có hai thứ: <strong class='hl'>kích thước</strong> và <strong class='hl'>chuyển động</strong>. Toàn bộ bộ luật của nó gọn thế này:" style={P} />
              <div className="panel-inner mono" style={{ marginTop: 12, fontSize: 12, lineHeight: 1.9, color: 'var(--text-2)' }}>
                <div>(1) vật NHỎ đang động → <span style={{ color: 'var(--green)' }}>ĐỚP</span></div>
                <div>(2) vật LỚN đang động → <span style={{ color: 'var(--red)' }}>NÉ</span>, và chặn phản xạ đớp</div>
                <div>(3) còn lại (không động) → <span style={{ color: 'var(--faint)' }}>KHÔNG LÀM GÌ</span></div>
              </div>
              <Html as="p" t="Luật (3) trông thừa nhưng bắt buộc phải có: bộ luật thiếu nhánh mặc định là bộ luật có lỗ, gặp tình huống ngoài dự kiến thì agent đứng hình. Còn cái giá của kiến trúc này thì cũng lộ ra ngay ở luật (1) — thả một viên bi lăn qua, con ếch vẫn đớp." style={P} />
            </div>
            <div className="card">
              <Kicker color="var(--green)">TRÍ NHỚ TRÔNG NHƯ THẾ NÀO KHI VIẾT RA</Kicker>
              <Html as="p" t="Vẫn là bảng luật, chỉ khác ở chỗ vế NẾU giờ được nhắc tới <em>quá khứ</em>. So hai dòng giữa mà xem — cùng một tri giác “thấy vật phía trước”, hai hành động khác nhau, chỉ vì phần trước đó khác:" style={P} />
              <div style={{ marginTop: 12, overflowX: 'auto' }}>
                <table className="dtable" style={{ minWidth: 420 }}>
                  <tbody>
                    <tr className="dtable__head"><td>NẾU</td><td style={{ width: 110 }}>THÌ</td></tr>
                    {[
                      ['Không thấy vật phía trước', 'Đi thẳng'],
                      ['Thấy vật phía trước', 'Rẽ ngẫu nhiên'],
                      ['Đã thấy vật, đã rẽ phải, giờ phía trước quang', 'Đi thẳng'],
                      ['Đã thấy vật, đã rẽ phải, phía trước lại có vật', 'Dừng'],
                    ].map(([a, b], i) => (
                      <tr key={a}>
                        <td style={{ fontSize: 12.5, color: i >= 2 ? 'var(--text-hi)' : 'var(--muted)' }}>{a}</td>
                        <td className="mono" style={{ fontSize: 11.5, color: 'var(--yellow)' }}>{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Html as="p" t="Hai dòng dưới chính là thứ agent phản xạ thuần <strong class='hl'>không thể nào viết được</strong> — nó chỉ nhận đúng tri giác hiện tại, không có chỗ nào cất câu “đã rẽ phải rồi”. Nhớ mục <a href='#ch2'>02</a> chứ? Hàm agent nhận cả chuỗi, chương trình agent chỉ nhận một tri giác. Trạng thái trong là cách chương trình vá lại khoảng cách đó." style={P} />
            </div>
          </Reveal>
          <Reveal delay={0.2} className="card" style={{ marginTop: 14, borderColor: 'color-mix(in srgb, var(--cyan) 30%, transparent)' }}>
            <Kicker color="var(--cyan)">THẾ CÒN “AI AGENT” MÀ AI CŨNG NÓI THÌ NẰM Ở NẤC MẤY?</Kicker>
            <Html as="p" t="Câu hỏi đáng hỏi, vì cái tên trùng nhau mà nội hàm thì không. Thử soi một trợ lý lập trình qua đúng năm nấc trên. Nó <strong class='hl'>có trạng thái trong</strong> — nhớ những gì đã đọc, đã sửa — nên vượt nấc 1. Nó <strong class='hl'>có mục tiêu</strong>: bạn giao việc, nó thử hành động rồi xem đã tới chưa. Đó là nấc 3, và phần lớn thứ đang được gọi là “AI agent” dừng lại ở đây." style={P} />
            <Html as="p" t="Nấc 4 thì lỏng lẻo. Nó hiếm khi có một <em>thang điểm</em> tường minh để cân nhanh với an toàn, hay cân cái chắc ăn với cái đáng giá mà hên xui — thứ đó thường nằm trong đầu bạn chứ không nằm trong chương trình. Còn nấc 5 thì gần như không có: mô hình <strong class='hl-red'>không tự sửa mình sau mỗi lần bị chê</strong>. Việc học xảy ra ở một chu kỳ khác hẳn, do người khác chạy, cách nhau hàng tháng. Cái vòng phê bình → học → sinh vấn đề mà bạn vừa xem ở nấc 5 vẫn còn để trống." style={P} />
            <Html as="p" t="Nói vậy không phải để dìm. Nói vậy để bạn có một cái thước: lần tới đọc quảng cáo về “agent tự chủ”, bạn hỏi được đúng câu — <em>nó đang ở nấc mấy, và ba cái hộp của nấc 5 ai đang cầm?</em>" style={P} />
          </Reveal>
          <Reveal delay={0.2} className="card" style={{ marginTop: 14, borderColor: 'color-mix(in srgb, var(--purple) 30%, transparent)' }}>
            <Kicker color="var(--purple)">MÓC NỐI — MỖI NẤC LÀ MỘT BUỔI SAU</Kicker>
            <Html as="p" t="Đừng đọc năm nấc này như một danh sách để thuộc lòng. Chúng là mục lục của cả khóa: <strong class='hl'>nấc 3</strong> đẻ ra buổi 3–6, nơi bạn đi tìm đường tới mục tiêu bằng tìm kiếm và ràng buộc. <strong class='hl'>Nấc 4</strong> là cái thang điểm mà buổi 5 dùng để so hai nước cờ và buổi 9 dùng để cân xác suất. <strong class='hl'>Nấc 5</strong> chính là buổi 10 và 11 — bộ học ở đó có tên riêng là ID3, là mạng nơ-ron. Còn <strong class='hl'>nấc 2</strong>, cái mô hình thế giới, là thứ buổi 7 và 8 sẽ viết ra bằng logic." style={P} />
          </Reveal>
        </div>

        {/* 09 */}
        <div id="ch9" className="lesson-section">
          <SectionHead no="09" title="Tổng kết một trang" en="và tự kiểm trước khi qua buổi 3" color="var(--green)"
            lead="Nếu chỉ giữ lại được một trang từ buổi này thì giữ trang này." />
          <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 14 }}>
            {[
              ['AGENT', 'var(--cyan)', 'Tri giác qua cảm biến, tác động qua bộ chấp hành. Hành vi của nó là hàm <span class="code-inline">f : 𝓟* → 𝓐</span> — cả chuỗi lịch sử cho ra một hành động. Chương trình agent là bản chạy được của hàm đó, và mỗi lần chỉ được đưa cho tri giác hiện tại.'],
              ['DUY LÝ', 'var(--green)', 'Chọn hành động <em>kỳ vọng</em> tối đa thước đo hiệu năng, dựa trên chuỗi tri giác tới giờ và tri thức có sẵn. Thước đo chấm môi trường chứ không chấm agent. Duy lý không phải toàn tri, không phải hoàn hảo, và có bao gồm việc đi thăm dò lẫn việc học.'],
              ['PEAS', 'var(--yellow)', 'Bốn câu phải trả lời trước khi thiết kế: thước đo · môi trường · bộ chấp hành · cảm biến. Bảy chiều môi trường quyết định kiến trúc tối thiểu bạn buộc phải dùng — mất quan sát đầy đủ là mất luôn quyền dùng agent phản xạ thuần.'],
              ['NĂM KIẾN TRÚC', 'var(--purple)', 'Phản xạ → thêm trạng thái trong và mô hình thế giới → thêm mục tiêu → thêm hàm thỏa dụng → thêm vòng học (phê bình · bộ học · sinh vấn đề). Mỗi nấc chữa đúng một chỗ chết của nấc dưới, và bảng tra khổng lồ là lý do không nấc nào được phép liệt kê sẵn mọi câu trả lời.'],
            ].map(([k, c, body]) => (
              <div key={k} className="card" style={{ borderColor: `color-mix(in srgb, ${c} 26%, transparent)` }}>
                <Kicker color={c}>{k}</Kicker>
                <Html as="p" t={body} style={P} />
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 22 }}>
            <Kicker color="var(--green)">TỰ KIỂM — TICK KHI BẠN GIẢI THÍCH ĐƯỢC RA MIỆNG, KHÔNG PHẢI KHI THẤY QUEN MẶT</Kicker>
            <div style={{ marginTop: 12 }}>
              <CheckList storageKey="b2-checks" items={[
                'Phân biệt được tri giác, chuỗi tri giác, hàm agent và chương trình agent — nói được chương trình khác hàm ở đúng chỗ nào.',
                'Giải thích được vì sao thước đo hiệu năng chấm chuỗi trạng thái của môi trường, chứ không chấm agent.',
                'Nêu được một thước đo đặt hớ và hậu quả cụ thể của nó (không dùng lại ví dụ hốt rác của tôi).',
                'Nói được vì sao duy lý không đồng nghĩa với toàn tri, và vì sao đi thăm dò lại là một phần của duy lý.',
                'Viết được PEAS cho một tác vụ tự chọn, bốn mục đều có nội dung thật.',
                'Đọc một môi trường lạ và xếp được nó vào bảy chiều, có giải thích cho từng chiều.',
                'Giải thích được vì sao agent tra bảng bất khả thi, bằng một con số chứ không bằng cảm giác.',
                'Kể được năm kiến trúc theo đúng thứ tự, mỗi nấc nói rõ nó thêm gì và chữa chỗ chết nào.',
              ]} />
            </div>
          </Reveal>
        </div>

        {/* 10 */}

        {/* 10 — Quiz */}
        <div id="quiz" className="lesson-section">
          <SectionHead no="10" title="Quiz — đo xem bạn <em class='hl-cyan'>thật sự</em> hiểu tới đâu" en="tám câu · hàm agent, thước đo, PEAS, bảy chiều, năm kiến trúc" color="var(--cyan)"
            lead="Đọc một mạch rồi thấy hiểu hết là cảm giác quen thuộc nhất trên đời — và cũng là cảm giác dễ lừa mình nhất. Tám câu dưới đây không phải để chấm bạn; chúng để lộ ra chỗ nào bạn mới chỉ <em>thấy quen mặt</em> chứ chưa hiểu. Sai câu nào thì đọc phần giải thích ngay dưới đó, đừng để dành. Làm xong hẵng qua bài tập." />
          <Reveal delay={0.1} style={{ marginTop: 22 }}>
            <SessionQuiz sessionId="b2" color="var(--cyan)" />
          </Reveal>
        </div>
        <div id="hw" className="lesson-section lesson-section--last">
          <SectionHead no="11" title="Bài tập về nhà — Buổi 2" en="bốn câu · PEAS và tính chất môi trường" color="var(--purple)"
            lead="✏️ Bốn câu, hai trò chơi ngoài sân. Buổi 1 tôi có nhá qua mấy câu này rồi bảo để dành — giờ thì bạn có đủ đồ nghề để làm thật. Làm bằng giấy bút, đừng làm trong đầu: chỗ bí sẽ lộ ra ngay khi phải viết cột P xuống." />
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(400px,100%),1fr))', gap: 14, marginTop: 22 }}>
            {(HW as [string, string, string][]).map(([k, body, links]) => (
              <div key={k} className="card">
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--purple)' }}>{k}</div>
                <Html as="p" t={body} style={P} />
                <Html as="div" t={links} style={{ marginTop: 12, fontSize: 12.5 }} />
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.15} className="card" style={{ marginTop: 14, borderColor: 'color-mix(in srgb, var(--yellow) 30%, transparent)' }}>
            <Kicker color="var(--yellow)">CÂU THỨ NĂM, KHÔNG CÓ TRONG ĐỀ NHƯNG ĐÁNG LÀM NHẤT</Kicker>
            <Html as="p" t="Quay lại hai việc tennis ở mục <a href='#ch5'>05</a> — đánh giải và đập bóng vào tường — rồi xếp cả hai vào bảy chiều. Bạn sẽ thấy chúng lệch nhau ở <strong class='hl'>số agent</strong> và ở chiều <strong class='hl'>từng hồi / tuần tự</strong>. Rồi tự hỏi tiếp: cái tường có phải một agent không? Trả lời được câu đó là bạn đã thật sự hiểu tiêu chí phân biệt agent với đồ vật, chứ không chỉ thuộc nó." style={P} />
          </Reveal>
          <Reveal delay={0.2} style={{ marginTop: 24, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--border-2)', paddingTop: 20 }}>
            <Html as="span" t="Tiếp theo: <strong class='hl'>Buổi 3 — Giải bài toán bằng Tìm kiếm</strong>. Ở đó bạn dựng đúng con agent nấc 3 của mục 08: có mục tiêu, và phải tự tìm đường tới đó." style={{ fontSize: 13, color: 'var(--muted)' }} />
            <div style={{ flex: 1 }} />
            <Link to="/courses/csc14003" style={{ fontSize: 13 }}>← Về Lộ trình</Link>
          </Reveal>
        </div>
      </LessonDeck>
    </>
  );
}
