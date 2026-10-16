import { useState, type ReactNode } from 'react'
import { AnswerTile, Button, Cartouche, Chip, ConfidenceControl, FeedbackBar, HintLadder, MemoryBar, NumberInput, PagesRow, SessionHeader, SketchCard, StationStrip, StepDots, ViewToggle, useView, type Confidence, type HintLevel } from '@/ui'
import { PenIcon } from '@/ui/icons'

const colors = [
  ['Mực', 'ink', '#14162B', 'chữ, viền, bóng nút'],
  ['Nền', 'bg', '#EEF0F7', 'nền trang'],
  ['Tím', 'violet', '#4A33C9', 'hành động chính, tiến độ'],
  ['Vàng', 'sun', '#FFC94A', 'hôm nay, đoán trước, ý cần nhớ'],
  ['Đúng', 'correct', '#1D63D6', 'nền nhạt #E3EDFF'],
  ['Sai', 'wrong', '#C2560A', 'nền nhạt #FFE9DA'],
  ['g(n)', 'g', '#0E7C7B', 'quãng đã đi, ở mọi bài'],
  ['h(n)', 'h', '#B0306F', 'quãng đoán còn lại'],
] as const

function Card({ title, children, wide = false }: { title: string; children: ReactNode; wide?: boolean }) {
  return (
    <section aria-label={title} className={`rounded-card bg-surface p-6 ${wide ? 'col-span-full' : ''}`}>
      <h2 className="m-0 mb-4 text-2xl font-extrabold tracking-tight">{title}</h2>
      {children}
    </section>
  )
}

const Cap = ({ children }: { children: ReactNode }) => <span className="text-[13px] text-muted">{children}</span>

/** Trang /#/dev/ui: dựng lại docs/design/screens/00 bằng thành phần thật. */
export default function DevUi() {
  const [conf, setConf] = useState<Confidence>('sure')
  const [view, setView] = useView('map')
  const [hint, setHint] = useState<HintLevel>(0)
  return (
    <div className="mx-auto flex max-w-[1236px] flex-col gap-6 px-7 pt-12 pb-18">
      <div>
        <h1 className="m-0 text-5xl leading-none font-extrabold tracking-[-0.035em]">Hệ thống thiết kế</h1>
        <p className="mt-3 max-w-[44em] text-lg text-muted">Mỗi màu chỉ mang một nghĩa. Mỗi màn chỉ có một nút chính. Đúng và sai luôn đi kèm icon và chữ, không chỉ dựa vào màu.</p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(520px,100%),1fr))] items-start gap-5">
        <Card title="Màu">
          <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-3 p-0 text-sm">
            {colors.map(([name, , hex, use]) => (
              <li key={name} className="flex items-center gap-3">
                <span className="size-11 shrink-0 rounded-xl" style={{ background: hex }} />
                <span>
                  <b>{name}</b> · {hex}
                  <br />
                  <span className="text-muted">{use}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Chữ">
          <div className="flex flex-col gap-3.5">
            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-baseline gap-3"><Cap>Tiêu đề · 48/34/24</Cap><span className="font-display text-[34px] leading-[1.05] font-extrabold tracking-[-0.03em]">Buổi học hôm nay</span></div>
            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-baseline gap-3"><Cap>Thân · 17/15</Cap><span className="text-[17px]">Onest đọc rõ tiếng Việt ở cỡ nhỏ, dấu không dính dòng trên.</span></div>
            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-baseline gap-3"><Cap>Số liệu</Cap><span className="font-mono"><span className="text-g">g=6</span> + <span className="text-h">h=4</span> = 10</span></div>
            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-baseline gap-3"><Cap>Sketch</Cap><span className="font-hand text-lg">UCS trên một trang</span></div>
          </div>
        </Card>

        <Card title="Nút">
          <div className="flex flex-wrap items-center gap-4">
            <Button>Nút chính</Button>
            <Button className="translate-y-[5px] shadow-none">Đang nhấn</Button>
            <Button variant="secondary">Nút phụ</Button>
            <Button variant="link">Liên kết</Button>
            <Button disabled>Chưa bấm được</Button>
          </div>
          <p className="mt-3.5 mb-0 text-sm text-muted">Nút chính luôn nằm góc phải dưới. Bấm thì lún xuống 5px, bóng biến mất.</p>
        </Card>

        <Card title="Nhãn">
          <div className="flex flex-wrap gap-2.5">
            <Chip tone="sun">Đoán trước</Chip>
            <Chip tone="sun">Đang theo</Chip>
            <Chip tone="ink" icon={<PenIcon width={14} height={14} />}>Làm trên giấy</Chip>
            <Chip tone="violet">5 ga đã xong</Chip>
            <Chip tone="wrong">Sắp quên</Chip>
            <Chip>Tìm kiếm</Chip>
            <Cartouche>ĐÍCH</Cartouche>
          </div>
        </Card>

        <Card title="Ô trả lời" wide>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(190px,100%),1fr))] gap-3.5">
            {(['default', 'selected', 'correct', 'wrong', 'locked'] as const).map((st, i) => (
              <div key={st} className="flex flex-col gap-2">
                <Cap>{['Mặc định', 'Đang chọn', 'Đúng', 'Sai', 'Đã khóa'][i]}</Cap>
                <AnswerTile state={st}>{st === 'wrong' || st === 'locked' ? 'Dừng' : 'Chưa dừng'}</AnswerTile>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-6">
            <div className="flex flex-col gap-2"><Cap>Mức chắc chắn</Cap><ConfidenceControl value={conf} onChange={setConf} /></div>
            <div className="flex flex-col gap-2"><Cap>Ô nhập số</Cap><NumberInput unit="phút" defaultValue={12} aria-label="Số phút" /></div>
            <div className="flex flex-col gap-2"><Cap>Chip g= cạnh nút bản đồ</Cap><NumberInput chip prefix="g=" defaultValue={13} aria-label="g" /></div>
            <div className="flex flex-col gap-2">
              <Cap>Ô che chữ trong sketch</Cap>
              <span className="inline-flex items-center gap-2.5">
                <span className="grid h-8 min-w-24 place-items-center rounded-lg border-2 border-dashed border-violet bg-violet-soft font-bold text-violet">?</span>
                <span className="bg-sun-mark px-1 font-hand">thay g và cha</span>
              </span>
            </div>
          </div>
        </Card>

        <Card title="Phản hồi">
          <div className="flex flex-col gap-2.5">
            <FeedbackBar kind="correct" title="Đúng rồi.">Lời giải thích một câu, nói vì sao đúng.</FeedbackBar>
            <FeedbackBar kind="wrong" title="Chưa đúng.">Chỉ ra chỗ sai, mời thử lại hoặc mở gợi ý.</FeedbackBar>
            <FeedbackBar kind="hint" title="Gợi ý.">Đưa bạn đi được nửa đường.</FeedbackBar>
            <FeedbackBar kind="solution" title="Lời giải.">Xem được, nhưng kỹ năng sẽ quay lại sớm hơn.</FeedbackBar>
          </div>
          <p className="mt-3 mb-0 text-sm text-muted">Phản hồi trượt lên từ đáy màn hình, nằm ngay trên nút chính.</p>
          <div className="mt-4"><HintLadder level={hint} onHint={() => setHint(1)} onSolution={() => setHint(2)} hint="Nhìn vào g(n) của hai nút." solution="Dừng khi lấy nút đích ra khỏi hàng đợi." /></div>
        </Card>

        <Card title="Tiến độ và độ nhớ">
          <div className="flex flex-col gap-4.5">
            <div className="flex flex-col gap-1.5"><Cap>Thanh buổi học</Cap><SessionHeader current={4} total={9} onClose={() => {}} /></div>
            <div className="flex flex-col gap-1.5"><Cap>Thanh buổi học hôm nay (chia đoạn)</Cap><SessionHeader segmented current={2} total={3} done={1.4} onClose={() => {}} /></div>
            <div className="flex flex-col gap-1.5"><Cap>Ga trên tuyến: xong · hôm nay · chưa học</Cap><StationStrip size="lg" label="5 trên 9 ga đã qua" states={['done', 'done', 'done', 'done', 'done', 'today', 'todo', 'todo', 'todo']} /></div>
            <div className="flex flex-col gap-1.5">
              <Cap>Độ nhớ của một kỹ năng (ước tính từ lịch ôn)</Cap>
              <MemoryBar value={0.82} />
              <MemoryBar value={0.96} />
              <Cap>Dưới 90% thì chuyển màu cam và vào danh sách ôn.</Cap>
            </div>
            <div className="flex flex-wrap items-center gap-6"><StepDots total={3} current={2} /><ViewToggle value={view} onChange={setView} /><PagesRow open={2} total={3} /></div>
          </div>
        </Card>

        <Card title="Thẻ sketch" wide>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3.5">
            <SketchCard state="open" title="Frontier và explored" />
            <SketchCard state="covered" title="UCS dừng khi nào?" />
            <SketchCard state="locked" title="Cả mục tiêu" unlockHint="Mở khi qua ga 9" />
          </div>
        </Card>
      </div>
    </div>
  )
}
