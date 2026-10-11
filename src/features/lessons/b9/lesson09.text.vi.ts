export const VI = {
  nav: {
    math: "TOÁN NỀN",
    kb: "01 Agent tri thức",
    wumpus: "02 Hang Wumpus",
    entail: "03 Hệ quả",
    syntax: "04 Cú pháp",
    modelcheck: "05 Kiểm mô hình",
    rules: "06 Luật suy diễn",
    resolution: "07 Hợp giải",
    chaining: "08 Chaining",
    dpll: "09 DPLL",
    lab: "10 Lab",
    summary: "11 Ghi nhớ",
    quiz: "12 Quiz",
    practice: "13 Bài tập"
  },
  hero: {
    badge: "BUỔI 9",
    eyebrow: "CSC14003 · PHẦN III — TRI THỨC & SUY LUẬN",
    title: "Tác tử logic",
    accent: "Không nhìn thấy hố. Vẫn biết ô nào an toàn.",
    lead: "Bạn đứng trong một hang tối 4×4. Không thấy gì, chỉ cảm được gió và mùi hôi. Vậy mà sau ba bước, bạn chỉ đúng ô có hố và ô có quái vật — dù chưa từng bước vào hai ô đó. Buổi này tôi muốn bạn dạy máy làm việc ấy: viết điều đã biết thành câu, rồi để thuật toán suy ra phần còn lại.",
    time: "~4 giờ · có lab",
    families: "Kiểm mô hình · Hợp giải · Chaining · DPLL",
    quiz: "11 câu tự kiểm",
    cta: "Bắt đầu với agent biết suy luận →",
    back: "← Lộ trình khóa học"
  },
  goals: {
    title: "Sau buổi này, bạn làm được gì?",
    items: [
      "Viết một tình huống thành KB logic mệnh đề, phân biệt câu được cho với câu suy ra.",
      "Kiểm KB ⊨ α bằng bảng chân trị, và giải thích vì sao ⊭ α không có nghĩa là ⊨ ¬α.",
      "Đổi câu bất kỳ sang CNF rồi chứng minh bằng hợp giải phản chứng.",
      "Chạy forward / backward chaining trên KB Horn, biết lúc nào nên dùng DPLL và lúc nào WalkSAT không đủ."
    ],
    path: "Lượt đọc đầu: mục 01–05 là phần ngữ nghĩa — hiểu chắc ⊨ trước đã. Mục 06–09 là bốn cách chứng minh. Sau đó mở Lab ở mục 10 và cho cùng một KB chạy qua cả năm cách."
  },
  common: {
    t: "đúng",
    f: "sai",
    tf: "T = đúng · F = sai",
    hint: "Xem gợi ý và lời giải",
    answer: "Xem đáp án"
  },
  kb: {
    title: "🧠 Agent biết thêm điều chưa ai nói",
    en: "Knowledge-based agents",
    lead: "Agent giải 8-puzzle ở buổi 5 tìm đường rất giỏi. Nhưng hỏi nó “hai trạng thái này có tới được nhau không” thì nó chịu — dù câu trả lời nằm sẵn trong tính chẵn lẻ của hoán vị. Nó biết, nhưng chỉ biết theo một kiểu cứng nhắc.",
    paras: [
      "Agent giải bài toán ở các buổi trước giữ hiểu biết dưới dạng <strong>mã cài sẵn</strong>: hàm sinh trạng thái, hàm heuristic. CSP ở buổi 8 nhích lên một bước — trạng thái thành phép gán giá trị cho biến, nên một phần thuật toán chạy được cho mọi miền và nhanh hơn. Agent dựa trên tri thức đi tiếp: nó giữ điều đã biết dưới dạng <strong class='hl'>câu trong một ngôn ngữ hình thức</strong> — logic — rồi ghép đi ghép lại các câu đó cho đủ mọi mục đích.",
      "Nhờ vậy nó làm được ba việc mà agent tìm kiếm phải viết lại mã mới làm nổi: <strong>nhận nhiệm vụ mới</strong> dưới dạng mục tiêu viết rõ ra, <strong>giỏi lên</strong> khi học thêm tri thức về môi trường, và <strong>thích nghi</strong> khi thế giới đổi — chỉ cần cập nhật đúng những câu liên quan."
    ],
    cards: [
      {
        title: "KB · Cơ sở tri thức",
        body: "Một tập <strong>câu</strong> (sentence), mỗi câu khẳng định một điều về thế giới. Đây là cuốn sổ tay của agent."
      },
      {
        title: "Axiom · Tiên đề",
        body: "Câu được cho sẵn, không suy ra từ câu nào khác — như “luật vật lý” của hang Wumpus ở mục 02."
      },
      {
        title: "Inference · Suy diễn",
        body: "Sinh câu mới từ câu cũ. Câu mới được thêm vào KB, và agent hỏi KB xem mình đã biết những gì."
      }
    ],
    exampleTitle: "Một vòng suy luận nhỏ",
    example: "KB có sẵn luật <span class='code-inline'>A ⇒ (B ∨ C)</span>. Agent cảm nhận được <span class='code-inline'>A</span> và <span class='code-inline'>¬C</span>. Bộ suy diễn ghép lại: A đúng nên B ∨ C đúng; C sai nên chỉ còn <strong class='hl'>B</strong>. Câu B được thêm vào KB — một điều không cảm biến nào đọc trực tiếp được.",
    decomp: "Tách agent làm hai nửa. <strong>Offline</strong>: tri thức nền và kinh nghiệm, dữ liệu quá khứ được nạp vào KB. <strong>Online</strong>: bộ suy diễn đọc quan sát, mục tiêu và khả năng hành động, dùng KB để chọn hành động. Ở hệ thật, vòng quanh KB còn có kỹ sư tri thức, chuyên gia miền, ontology, dữ liệu, cảm biến, người dùng và nguồn tri thức bên ngoài.",
    codeTitle: "Vòng lặp của KB-AGENT",
    codeLead: "Bản Python dưới đây giữ đúng ba lời gọi của pseudocode: TELL điều vừa thấy, ASK nên làm gì, TELL việc đã làm, rồi tăng bộ đếm thời gian t. Để ý: không dòng nào “suy luận” cả — toàn bộ cơ chế suy diễn giấu trong <span class='code-inline'>tell</span> và <span class='code-inline'>ask</span>.",
    approachesTitle: "Bốn cách đổ tri thức vào agent",
    headers: [
      "Cách",
      "Làm thế nào",
      "Mức tự chủ"
    ],
    rows: [
      [
        "Khai báo (declarative)",
        "Bắt đầu với KB rỗng, TELL từng câu cho tới khi agent biết cách hoạt động trong môi trường",
        "Phụ thuộc người TELL"
      ],
      [
        "Thủ tục (procedural)",
        "Viết thẳng hành vi mong muốn thành mã chương trình",
        "Phụ thuộc người lập trình"
      ],
      [
        "Kết hợp",
        "Phần lớn khai báo, phần hay dùng thì viết thành mã cho nhanh",
        "Tự chủ một phần"
      ],
      [
        "Học (buổi 12–13)",
        "Cho agent cơ chế để tự học tri thức mới",
        "Tự chủ hoàn toàn"
      ]
    ],
    bridge: "Còn hai câu hỏi: viết KB bằng ngôn ngữ nào, và “suy ra” chính xác nghĩa là gì? Muốn trả lời cho tử tế, tôi cần một thế giới đủ nhỏ để lật hết mọi khả năng. Mời bạn xuống hang."
  },
  wumpus: {
    title: "🕳️ Hang Wumpus: đi trong bóng tối",
    en: "The Wumpus world",
    lead: "Đầu thập niên 1970, Hunt the Wumpus là một trò chơi chữ trên máy tính: bạn lần mò trong hang, chỉ được báo “có gió lùa”, “có mùi quái vật”, và phải đoán đâu là hố, đâu là Wumpus. AI mượn đúng trò ấy làm phòng thí nghiệm, vì muốn sống sót thì phải suy luận chứ đoán mò không được.",
    paras: [
      "Bản dùng trong AI là một hang lưới <strong>4×4</strong>. Agent bắt đầu ở ô [1,1], mặt quay sang phải. Vàng và Wumpus nằm ở các ô ngẫu nhiên; mỗi ô còn có thể là hố với xác suất <strong>0,2</strong>. Ô kề cạnh (không tính chéo) với hố thì có gió, kề Wumpus thì có mùi hôi, ô có vàng thì lấp lánh."
    ],
    peas: [
      {
        title: "P · Thước đo hiệu năng",
        body: "<strong>+1000</strong> khi trèo ra khỏi hang cùng vàng, <strong>−1000</strong> khi chết; −1 mỗi bước, −10 khi bắn tên. Ván kết thúc khi agent chết hoặc trèo ra."
      },
      {
        title: "E · Môi trường",
        body: "Lưới 4×4 phòng, bắt đầu ở [1,1] quay phải; vàng và Wumpus ở ô ngẫu nhiên; mỗi ô có hố với xác suất 0,2."
      },
      {
        title: "A · Hành động",
        body: "Forward, TurnLeft / TurnRight 90°, Grab (nhặt), Shoot (bắn), Climb (trèo ra)."
      },
      {
        title: "S · Cảm biến",
        body: "Stench (mùi), Breeze (gió), Glitter (lấp lánh), Bump (đụng tường), Scream (Wumpus chết). Một tri giác là vector năm phần tử, ví dụ [Stench, Breeze, None, None, None]."
      }
    ],
    envTitle: "Đặt hang lên các chiều môi trường của buổi 2",
    headers: [
      "Chiều",
      "Hang Wumpus",
      "Vì sao"
    ],
    rows: [
      [
        "Quan sát đầy đủ?",
        "Không",
        "Chỉ cảm được ô đang đứng"
      ],
      [
        "Tất định?",
        "Có",
        "Kết quả mỗi hành động được quy định chính xác"
      ],
      [
        "Theo tập (episodic)?",
        "Không",
        "Tuần tự ở mức hành động"
      ],
      [
        "Tĩnh?",
        "Có",
        "Wumpus và hố không di chuyển"
      ],
      [
        "Rời rạc?",
        "Có",
        "Ô, hành động và tri giác đều đếm được"
      ],
      [
        "Một agent?",
        "Có",
        "Wumpus coi như một đặc điểm tự nhiên của hang"
      ]
    ],
    exploreTitle: "Ba bước, hai kết luận chắc chắn",
    steps: [
      "<strong>[1,1]</strong> · tri giác [None, None, None, None, None]. Không gió, không mùi → hai ô kề [1,2] và [2,1] an toàn (OK).",
      "<strong>[2,1]</strong> · Breeze. Có hố ở một ô kề: [2,2] hoặc [3,1] (P?) — [1,1] đã an toàn nên bị loại. Chưa đủ để đi tiếp, agent quay về [1,1] rồi sang [1,2].",
      "<strong>[1,2]</strong> · Stench, không Breeze. Wumpus không ở [1,1], cũng không ở [2,2] vì [2,1] không có mùi → <strong class='hl'>W! ở [1,3]</strong>. Không gió nên [2,2] không có hố → <strong class='hl'>P! ở [3,1]</strong>, và [2,2] an toàn.",
      "<strong>[2,2]</strong> an toàn, đi tiếp tới <strong>[2,3]</strong> · Glitter, Stench, Breeze. Nhặt vàng (Grab). Gió mới nghĩa là [2,4] hoặc [3,3] có thể có hố."
    ],
    after: "Để ý bước thứ ba: kết luận W! ở [1,3] cần <strong>cả hai</strong> lần cảm nhận — có mùi ở [1,2] và <em>không</em> có mùi ở [2,1]. Cái “không cảm thấy gì” cũng là thông tin. Mục 03 biến kiểu lập luận đó thành một định nghĩa chính xác. Nói trước một điều: không phải lúc nào cũng có ô chắc chắn an toàn để đi — khi đó agent buộc phải liều, và xác suất ở buổi 11 là công cụ để đo xem liều ở ô nào ít rủi ro hơn.",
    visualTitle: "Thám hiểm hang Wumpus",
    legend: "A: agent · B: gió · S: mùi · G: vàng · OK: an toàn · V: đã đi qua · P? / W?: có thể · P! / W!: chắc chắn",
    cycle: "Minh họa tự lặp. Diễn giải đầy đủ từng bước nằm ngay dưới hình.",
    grid: "Lưới hang 4×4"
  },
  entail: {
    title: "Mô hình và hệ quả logic",
    en: "Models and entailment",
    lead: "“Chắc chắn” trong hang nghĩa là gì? Không phải “tôi thấy”, vì agent chẳng thấy gì. Nó nghĩa là: trong mọi thế giới có thể, thế giới nào khớp với điều đã biết thì cũng khớp với kết luận.",
    paras: [
      "<strong class='hl'>Mô hình</strong> (model, hay thế giới khả dĩ) là một trừu tượng toán học cố định đúng/sai cho mọi câu liên quan. Với câu về số, mô hình có thể là mọi cách gán số thực cho x và y. Mô hình m <strong>thỏa</strong> α (m là một mô hình của α) nếu α đúng trong m; <span class='code-inline'>M(α)</span> là tập mọi mô hình của α.",
      "<strong class='hl'>α ⊨ β</strong> — α kéo theo logic β — khi và chỉ khi trong <em>mọi</em> mô hình α đúng thì β cũng đúng, tức <span class='code-inline'>M(α) ⊆ M(β)</span>. Ví dụ x = 0 ⊨ xy = 0. Hay KB có “táo màu đỏ” và “cà chua màu đỏ” thì ⊨ “táo hoặc cà chua màu đỏ”. Entailment là quan hệ giữa các câu (cú pháp), nhưng được định nghĩa bằng ngữ nghĩa.",
      "Tôi hay nghĩ về nó như <strong>lọc danh sách nghi phạm</strong>. Mỗi manh mối gạch bớt vài người. Kết luận được coi là chắc khi nó đúng với <em>tất cả</em> những người còn lại trong danh sách — người đã bị gạch thì không cần xét."
    ],
    modelsTitle: "Tám thế giới sau hai bước",
    modelsIntro: "Agent đã ở [1,1] (không gió) và [2,1] (có gió). Chỉ ba ô liên quan còn chưa rõ: [1,2], [2,2], [3,1] → 2³ = 8 mô hình. Hình dưới lọc tám thế giới bằng KB, rồi hỏi hai câu khác nhau.",
    modelsResult: "KB chỉ giữ lại <strong>3</strong> thế giới. α₁ = “không có hố ở [1,2]” đúng ở cả 3 → <strong class='hl-green'>KB ⊨ α₁</strong>. α₂ = “không có hố ở [2,2]” sai ở 2 trong 3 → <strong class='hl-red'>KB ⊭ α₂</strong>.",
    check: {
      q: "KB ⊭ α₂. Vậy agent kết luận được là [2,2] chắc chắn có hố, phải không?",
      opts: [
        "Phải — không suy ra được “không có hố” thì là có hố",
        "Không — KB có thế giới có hố ở [2,2] và có thế giới không có",
        "Phải — vì 2 trong 3 thế giới có hố"
      ],
      a: 1,
      ex: "Trong ba thế giới còn lại, hai có hố ở [2,2], một không. KB ⊭ ¬P₂,₂ và cũng ⊭ P₂,₂: đơn giản là <strong>chưa biết</strong>. Đa số 2/3 không phải chứng minh — logic không đếm phiếu. Agent cẩn thận sẽ né ô đó cho tới khi có thêm tri giác."
    },
    soundTitle: "Suy diễn: đúng đắn và đầy đủ",
    sound: "Lật từng thế giới là định nghĩa, chưa phải thuật toán. Một thủ tục suy diễn i sinh câu mới; viết <span class='code-inline'>KB ⊢ᵢ α</span> khi α suy ra được từ KB bằng thủ tục i (có tài liệu viết ⊨ᵢ).",
    cards: [
      {
        title: "Sound · Đúng đắn",
        body: "Mọi thứ i suy ra đều thật sự được kéo theo: KB ⊢ᵢ α thì KB ⊨ α. Thủ tục không bịa."
      },
      {
        title: "Complete · Đầy đủ",
        body: "Mọi thứ được kéo theo, i đều suy ra được: KB ⊨ α thì KB ⊢ᵢ α. Câu hỏi nào có đáp án nằm trong KB, thủ tục đều trả lời được."
      }
    ],
    socrates: "Hình ảnh kinh điển: “Socrates là người” và “mọi người đều phải chết” <strong>kéo theo</strong> “Socrates phải chết” — đó là quan hệ giữa các câu, ở tầng biểu diễn. Ở tầng thế giới thật, sự việc tương ứng <strong>theo sau</strong>. Ngữ nghĩa là sợi dây nối từng câu với một khía cạnh của thế giới.",
    noAccess: "Đây là lý do tôi nhấn chữ <em>đúng đắn</em>: agent <strong>không có lối riêng</strong> nhìn vào thế giới. Nó nhận tri thức dưới dạng một chuỗi câu logic, và mọi kết luận chỉ được rút ra từ chuỗi câu đó. Một bước suy diễn không đúng đắn là agent bước vào hố với niềm tin tràn trề."
  },
  syntax: {
    title: "Logic mệnh đề: viết câu và tính đúng sai",
    en: "Propositional logic: syntax and semantics",
    lead: "Muốn máy lật được tám thế giới kia, câu phải viết theo luật đủ chặt để máy đọc — và mỗi câu phải có đúng một cách tính đúng/sai. Logic mệnh đề là ngôn ngữ đơn giản nhất làm được cả hai.",
    paras: [
      "Cú pháp gồm hai hằng <strong>True</strong>, <strong>False</strong>; các <strong>ký hiệu mệnh đề</strong> như P, Q, P₁, W₁,₃ — mỗi ký hiệu đứng cho một câu đúng hoặc sai; và năm phép nối. Một <strong class='hl'>literal</strong> là câu nguyên tử (P) hoặc phủ định của câu nguyên tử (¬P)."
    ],
    headers: [
      "Phép nối",
      "Tên",
      "Đọc là"
    ],
    rows: [
      [
        "¬",
        "Negation · phủ định",
        "không"
      ],
      [
        "∧",
        "Conjunction · hội",
        "và"
      ],
      [
        "∨",
        "Disjunction · tuyển",
        "hoặc"
      ],
      [
        "⇒",
        "Implication · kéo theo",
        "nếu … thì"
      ],
      [
        "⇔",
        "Biconditional · tương đương",
        "khi và chỉ khi"
      ]
    ],
    grammarTitle: "Ngữ pháp và thứ tự ưu tiên",
    precedence: "Thứ tự ưu tiên từ cao xuống thấp: <strong>¬, ∧, ∨, ⇒, ⇔</strong>. Nên <span class='code-inline'>¬A ∧ B ∨ C ⇒ D</span> đọc là <span class='code-inline'>((¬A ∧ B) ∨ C) ⇒ D</span>. Không chắc thì cứ thêm ngoặc — ngoặc thừa không làm sai câu nào.",
    semantics: "Ngữ nghĩa: mỗi mô hình gán đúng/sai cho từng ký hiệu. Ba ký hiệu P₁,₂, P₂,₂, P₃,₁ cho 2³ = <strong>8</strong> mô hình, ví dụ m₁ = {P₁,₂ = sai, P₂,₂ = sai, P₃,₁ = đúng}. Giá trị câu phức được tính đệ quy từ trong ra ngoài theo bảng dưới.",
    evalExample: "Tính ¬P₁,₂ ∧ (P₂,₂ ∨ P₃,₁) trong m₁: ¬sai = <strong>đúng</strong>; sai ∨ đúng = <strong>đúng</strong>; đúng ∧ đúng = <strong class='hl'>đúng</strong>.",
    check: {
      q: "“Nếu trời mưa thì đường ướt.” Hôm nay trời nắng, đường khô. Câu đó đúng hay sai?",
      opts: [
        "Sai — trời đâu có mưa",
        "Đúng — điều kiện không xảy ra thì câu kéo theo không bị phá",
        "Không xác định — logic không xét trường hợp này"
      ],
      a: 1,
      ex: "P ⇒ Q chỉ sai ở đúng một dòng: P đúng mà Q sai. Hãy nghĩ nó như lời hứa “nếu bạn được 9 điểm, tôi bao bạn một tô phở”: bạn được 7 điểm thì tôi không bao, và cũng chẳng ai bảo tôi thất hứa. Logic mệnh đề không đòi P với Q phải liên quan nhân quả — nó chỉ nhìn giá trị đúng sai."
    },
    kbTitle: "Viết hang Wumpus thành câu",
    kbIntro: "Mỗi ô [i,j] có bốn ký hiệu: <span class='code-inline'>Pᵢ,ⱼ</span> có hố, <span class='code-inline'>Wᵢ,ⱼ</span> có Wumpus, <span class='code-inline'>Bᵢ,ⱼ</span> có gió, <span class='code-inline'>Sᵢ,ⱼ</span> có mùi. Sau hai bước đầu, KB có năm câu:",
    kbNotes: [
      "ô xuất phát không có hố",
      "có gió ở [1,1] khi và chỉ khi có hố ở ô kề",
      "tương tự cho [2,1]",
      "tri giác ở [1,1]: không gió",
      "tri giác ở [2,1]: có gió"
    ],
    kbNote: "R2, R3 là “vật lý” của hang — đúng ở mọi ván. R4, R5 là điều agent vừa cảm thấy. Để ý R2 dùng ⇔ chứ không phải ⇒: chiều (P₁,₂ ∨ P₂,₁) ⇒ B₁,₁ mới là chiều cho phép agent suy ra “không hố” từ “không gió”."
  },
  modelcheck: {
    title: "🔍 Kiểm mô hình: lật hết mọi thế giới",
    en: "Model checking, validity and satisfiability",
    lead: "Định nghĩa của ⊨ đã cho sẵn một thuật toán: liệt kê mọi mô hình, giữ những mô hình KB đúng, xem α có đúng ở tất cả không. Chậm, nhưng thật thà — và là thước đo để kiểm mọi thuật toán khôn hơn phía sau.",
    approaches: [
      {
        title: "Kiểm mô hình",
        body: "Liệt kê mô hình (inference by enumeration). Chính là mục này."
      },
      {
        title: "Luật suy diễn",
        body: "Áp luật lên câu để dựng chứng minh, không nhìn tới mô hình. Mục 06 và 08."
      },
      {
        title: "Phản chứng · SAT",
        body: "Đưa về câu hỏi “KB ∧ ¬α có thỏa được không”: hợp giải, DPLL, WalkSAT. Mục 07 và 09."
      }
    ],
    approachesTitle: "Ba con đường trả lời KB ⊨ α?",
    paras: [
      "Với KB hang Wumpus ở mục 04: 7 ký hiệu → 2⁷ = <strong>128</strong> mô hình. KB chỉ đúng ở <strong>3</strong> dòng, và cả 3 dòng đều có P₁,₂ = sai. Vậy KB ⊨ ¬P₁,₂: không có hố ở [1,2]. Năm câu đã gạch đi <strong>125</strong> thế giới."
    ],
    ttTitle: "Ba dòng còn sống trong 128 dòng",
    ttNote: "Bảng được tính lại từ R1–R5 ngay trong trình duyệt. Mọi dòng khác của bảng đều làm ít nhất một câu R1–R5 sai.",
    codeTitle: "TT-ENTAILS bằng Python",
    codeLead: "Thuật toán duyệt mô hình theo chiều sâu: mỗi tầng gán một ký hiệu là đúng rồi sai. Tới lá, nếu KB đúng thì trả về giá trị của α; nếu KB sai thì trả về đúng — thế giới đó không phản bác được gì. Các hàm phụ như <span class='code-inline'>pl_true</span> được giả định có sẵn.",
    complexity: "Thuật toán <strong class='hl'>đúng đắn và đầy đủ</strong>, thời gian <strong>O(2ⁿ)</strong>, bộ nhớ <strong>O(n)</strong> vì mỗi lúc chỉ giữ một nhánh. Nghe ổn — cho tới khi bạn biết agent Wumpus thật cần 64 ký hiệu: 2⁶⁴ ≈ 1,8 × 10¹⁹ dòng. Mục 09 sẽ quay lại con số đó.",
    quiz01Title: "Quiz 01 · vòi phun có bật không?",
    quiz01: "KB gồm ba luật và hai sự kiện. R1: nếu nóng và có khói thì có cháy. R2: nếu chuông báo kêu thì có khói. R3: nếu có cháy thì vòi phun bật. F1: chuông báo kêu. F2: trời nóng. Viết KB bằng logic mệnh đề với H = nóng, S = có khói, F = cháy, A = chuông kêu, R = vòi phun bật, rồi trả lời “vòi phun có bật không?” bằng kiểm mô hình.",
    quiz01Answer: "KB: H ∧ S ⇒ F, A ⇒ S, F ⇒ R, A, H. 5 ký hiệu → 2⁵ = 32 mô hình. A và H phải đúng; A ⇒ S buộc S đúng; H ∧ S ⇒ F buộc F đúng; F ⇒ R buộc R đúng. Nên KB chỉ đúng ở <strong>1</strong> mô hình — cả năm ký hiệu đều đúng — và R đúng ở đó: <strong class='hl'>KB ⊨ R</strong>, vòi phun bật. Lab ở mục 10, ví dụ “Báo cháy”, chế độ Bảng chân trị cho đúng con số 32 và 1.",
    equivTitle: "Tương đương logic",
    equiv: "<strong class='hl'>α ≡ β</strong> khi hai câu đúng trên cùng một tập mô hình, tức α ⊨ β và β ⊨ α. Đây là bộ biến đổi bạn sẽ dùng suốt phần còn lại của buổi:",
    equivNames: [
      "giao hoán ∧",
      "giao hoán ∨",
      "kết hợp ∧",
      "kết hợp ∨",
      "khử phủ định kép",
      "phản đảo (contraposition)",
      "khử kéo theo",
      "khử tương đương",
      "De Morgan",
      "De Morgan",
      "phân phối ∧ qua ∨",
      "phân phối ∨ qua ∧"
    ],
    cards: [
      {
        title: "Valid · Hằng đúng",
        body: "Đúng trong mọi mô hình: P ∨ ¬P, P ⇒ P, (P ∧ (P ⇒ Q)) ⇒ Q. <strong>Định lý suy diễn</strong>: α ⊨ β khi và chỉ khi α ⇒ β hằng đúng."
      },
      {
        title: "Satisfiable · Thỏa được",
        body: "Đúng trong ít nhất một mô hình: P ∨ Q, P. <strong>Không thỏa được</strong> nếu không đúng ở mô hình nào: P ∧ ¬P. α ⊨ β khi và chỉ khi α ∧ ¬β không thỏa được — đó là phản chứng."
      },
      {
        title: "SAT",
        body: "Bài toán quyết định một câu logic mệnh đề có thỏa được không — bài toán đầu tiên được chứng minh là <strong>NP-đầy đủ</strong>. CSP ở buổi 8 cũng hỏi đúng kiểu đó: các ràng buộc có thỏa được bởi phép gán nào không."
      }
    ],
    trap: "Một lỗi hay gặp: P ⇒ ¬P <strong>không</strong> hằng đúng — P đúng thì câu sai. Nó chỉ thỏa được (đúng khi P sai). Ví dụ hằng đúng chuẩn là P ⇒ P.",
    quizTitle: "Quiz 02 · tự phân loại bốn câu",
    quizIntro: "Che cột đáp án, tự lập bảng chân trị cho bốn câu rồi mới so. Mẹo: muốn biết câu kéo theo có hằng đúng không, đi tìm dòng làm vế trái đúng mà vế phải sai — không tìm ra thì nó hằng đúng.",
    quizHeaders: [
      "Câu",
      "Kết luận",
      "Lý do"
    ],
    quizRows: [
      [
        "thỏa được, không hằng đúng",
        "A đúng, C sai làm câu sai; A, C cùng đúng làm câu đúng"
      ],
      [
        "hằng đúng",
        "vế trái đúng buộc A đúng, nên vế phải đúng"
      ],
      [
        "hằng đúng",
        "đây chính là một bước hợp giải trên B — mục 07"
      ],
      [
        "thỏa được, không hằng đúng",
        "A đúng, B sai làm câu sai; A, B cùng đúng làm câu đúng"
      ]
    ],
    labHint: "Tự kiểm bằng Lab ở mục 10: để trống ô KB, nhập câu vào ô truy vấn, chọn Bảng chân trị — Lab báo câu đó hằng đúng, thỏa được hay không thỏa được."
  },
  rules: {
    title: "Luật suy diễn: chứng minh mà không lật bảng",
    en: "Inference rules and proofs",
    lead: "Bảng chân trị nhìn hết mọi thứ, kể cả những thứ chẳng liên quan. Một chứng minh chỉ đi qua những câu cần thiết — nên khi số mô hình khổng lồ mà chứng minh lại ngắn, nó thắng đậm.",
    paras: [
      "<strong class='hl'>Chứng minh định lý</strong> (theorem proving) áp luật suy diễn trực tiếp lên các câu trong KB để dựng ra câu cần chứng minh, không cần hỏi tới mô hình. Một <strong>chứng minh</strong> là một chuỗi kết luận dẫn tới đích. Bốn luật đúng đắn hay dùng:"
    ],
    ruleNames: [
      "Modus Ponens",
      "Modus Tollens",
      "Thêm ∧ (And-Introduction)",
      "Khử ∧ (And-Elimination)"
    ],
    proof1Title: "Chứng minh S từ ba câu",
    headers: [
      "#",
      "Câu",
      "Giải thích"
    ],
    proof1: [
      "Từ KB",
      "Từ KB",
      "Từ KB",
      "1, khử ∧",
      "4, 2 Modus Ponens",
      "1, khử ∧",
      "5, 6 thêm ∧",
      "3, 7 Modus Ponens"
    ],
    proof2Title: "Chứng minh ¬P₁,₂ trong hang",
    proof2: [
      "khử ⇔ ở R2",
      "khử ∧ ở R6",
      "phản đảo R7",
      "Modus Ponens với R8 và tri giác R4",
      "De Morgan ở R9"
    ],
    proof2Note: "Năm bước, và chứng minh không hề nhắc tới B₂,₁, P₁,₁, P₂,₂ hay P₃,₁. Bảng chân trị thì phải lật cả bốn ký hiệu thừa đó — gấp 2⁴ = <strong>16</strong> lần số dòng thật sự cần.",
    searchTitle: "Chứng minh cũng là một bài toán tìm kiếm",
    search: [
      {
        title: "Trạng thái đầu",
        body: "KB ban đầu."
      },
      {
        title: "Hành động",
        body: "Áp mọi luật suy diễn lên mọi câu khớp với nửa trên của luật."
      },
      {
        title: "Kết quả",
        body: "Thêm câu ở nửa dưới của luật vào KB."
      },
      {
        title: "Đích",
        body: "Một trạng thái chứa câu cần chứng minh."
      }
    ],
    searchNote: "Khác với bảng chân trị, tìm chứng minh có thể bỏ qua mọi mệnh đề không liên quan, có bao nhiêu cũng mặc — nên hiệu quả hơn hẳn.",
    monotonic: "<strong class='hl'>Tính đơn điệu</strong>: thêm thông tin chỉ làm tập câu được kéo theo lớn lên — nếu KB ⊨ α thì KB ∧ β ⊨ α. Nhờ vậy, luật áp được bất cứ khi nào điều kiện khớp: kết luận đã rút ra không bao giờ bị câu mới làm mất hiệu lực.",
    incomplete: "Nhưng có một cái bẫy: bộ luật trong tay bạn có thể <strong>không đủ</strong>. Thiếu luật thì có những câu được kéo theo mà không bao giờ với tới — đúng đắn nhưng không đầy đủ. Mục tiếp theo chữa đúng chỗ này bằng một luật duy nhất."
  },
  resolution: {
    title: "✂️ Hợp giải: một luật là đủ",
    en: "CNF and resolution",
    lead: "Modus Ponens, khử ∧, De Morgan… bộ luật càng dài càng dễ thiếu. Hợp giải làm một việc khác thường: chỉ đúng một luật, đi cùng một thuật toán tìm kiếm đầy đủ, là thành một thủ tục suy diễn đầy đủ.",
    paras: [
      "Luật <strong class='hl'>hợp giải đơn vị</strong> (unit resolution): từ mệnh đề <span class='code-inline'>l₁ ∨ … ∨ lₖ</span> và literal <span class='code-inline'>m</span> bù với lᵢ, suy ra mệnh đề đã bỏ lᵢ. Bản <strong>đầy đủ</strong>: từ <span class='code-inline'>l₁ ∨ … ∨ lₖ</span> và <span class='code-inline'>m₁ ∨ … ∨ mₙ</span> với lᵢ và mⱼ bù nhau, suy ra mệnh đề gộp mọi literal còn lại của cả hai.",
      "Vì sao đúng? Giống khi bạn nói “mai mưa thì tôi ở nhà, không mưa thì tôi đi biển”: chưa biết mai thế nào, nhưng chắc chắn tôi ở nhà <em>hoặc</em> đi biển. Hai mệnh đề (¬Mưa ∨ Nhà) và (Mưa ∨ Biển) hợp giải trên Mưa cho (Nhà ∨ Biển).",
      "<strong>Factoring</strong>: mệnh đề kết quả chỉ giữ một bản của mỗi literal. Hợp giải (A ∨ B) với (A ∨ ¬B) cho A ∨ A, rút gọn thành <strong>A</strong>."
    ],
    wumpus: "Trong hang: agent tới [1,2] và không thấy gió (R11: ¬B₁,₂; R12: B₁,₂ ⇔ (P₁,₁ ∨ P₂,₂ ∨ P₁,₃)), từ đó có R13: ¬P₂,₂ và R14: ¬P₁,₃. Từ R3 và R5 có R15: P₁,₁ ∨ P₂,₂ ∨ P₃,₁. Hợp giải ¬P₂,₂ với P₂,₂ → R16: P₁,₁ ∨ P₃,₁. Hợp giải ¬P₁,₁ (R1) với P₁,₁ → <strong class='hl'>R17: P₃,₁</strong>. Hố nằm ở [3,1] — đúng kết luận agent rút ra khi mò trong hang ở mục 02.",
    cnfTitle: "Trước hết, mọi câu phải là mệnh đề",
    cnf: "Hợp giải chỉ áp lên <strong>mệnh đề</strong> (clause) — tuyển của các literal. Nên mọi câu trong KB phải đổi sang <strong class='hl'>dạng chuẩn hội CNF</strong>: hội của các mệnh đề. Ví dụ B₁,₁ ⇔ (P₁,₂ ∨ P₂,₁) thành hội của 3 mệnh đề: (¬B₁,₁ ∨ P₁,₂ ∨ P₂,₁) ∧ (¬P₁,₂ ∨ B₁,₁) ∧ (¬P₂,₁ ∨ B₁,₁). Một lưu ý về chữ: từ đây, <em>mệnh đề</em> nghĩa là clause — tuyển các literal — chứ không còn nghĩa rộng “câu đúng hoặc sai” của thẻ toán nền.",
    cnfSteps: [
      "Khử ⇔: α ⇔ β ≡ (α ⇒ β) ∧ (β ⇒ α)",
      "Khử ⇒: α ⇒ β ≡ ¬α ∨ β",
      "Đẩy ¬ vào trong tới khi chỉ đứng trước ký hiệu: ¬¬α ≡ α · ¬(α ∧ β) ≡ ¬α ∨ ¬β · ¬(α ∨ β) ≡ ¬α ∧ ¬β",
      "Phân phối ∨ qua ∧: (α ∧ β) ∨ γ ≡ (α ∨ γ) ∧ (β ∨ γ)"
    ],
    cnfDemo: "Bốn bước trên R2, do engine của bài chạy:",
    unchanged: "không đổi",
    quizTitle: "Quiz 03 · đổi hai câu sang CNF",
    quiz: [
      {
        hint: "Khử ⇒ hai lần: ¬(A ∧ B) ∨ (¬C ∨ D). De Morgan: <strong>¬A ∨ ¬B ∨ ¬C ∨ D</strong> — chỉ một mệnh đề."
      },
      {
        hint: "Theo thứ tự ưu tiên, câu là (P ∨ Q) ⇔ ((R ∧ ¬Q) ⇒ P), và vế phải ≡ ¬R ∨ Q ∨ P. Chiều (P ∨ Q) ⇒ (¬R ∨ Q ∨ P) cho hai mệnh đề chứa cặp bù (P với ¬P, Q với ¬Q) — hằng đúng, bỏ. Chiều ngược lại cho R ∨ P ∨ Q cùng hai mệnh đề hằng đúng. Kết quả: <strong>P ∨ Q ∨ R</strong>. Kiểm lại: câu gốc chỉ sai khi P, Q, R đều sai."
      }
    ],
    algoTitle: "Thuật toán hợp giải phản chứng",
    algo: "Muốn chứng minh KB ⊨ α, chứng minh <strong class='hl'>KB ∧ ¬α không thỏa được</strong>. PL-RESOLUTION đổi KB ∧ ¬α sang CNF, hợp giải từng cặp mệnh đề và thêm mệnh đề mới vào tập. Hai cách dừng: sinh ra <strong>mệnh đề rỗng □</strong> → mâu thuẫn → KB ⊨ α; hoặc không còn mệnh đề mới nào → KB ⊭ α. Với n ký hiệu, số mệnh đề khác nhau là hữu hạn, nên vòng lặp luôn dừng.",
    algoNote: "Nhiều bước hợp giải là vô ích. Mệnh đề chứa hai literal bù nhau thì bỏ ngay: B₁,₁ ∨ ¬B₁,₁ ∨ P₂,₁ ≡ True ∨ P₂,₁ ≡ True — luôn đúng, chẳng giúp gì cho việc tìm mâu thuẫn. Với mọi cặp câu α, β của logic mệnh đề, một bộ chứng minh dựa trên hợp giải luôn <strong>quyết định được</strong> α ⊨ β hay không. Chữ “đầy đủ” ở đây là <em>đầy đủ theo phản chứng</em>: hợp giải không liệt kê hết mọi hệ quả của KB, nhưng hễ KB ∧ ¬α không thỏa được thì nó luôn đi tới □.",
    umbrellaTitle: "Quiz 04 · Joe có bị ướt không?",
    umbrella: "Giả thiết: trời mưa thì Joe mang dù (R ⇒ U); mang dù thì Joe không ướt (U ⇒ ¬W); không mưa thì Joe không ướt (¬R ⇒ ¬W). Chứng minh Joe không ướt. Hình dưới chạy đúng chứng minh phản chứng: thêm W — phủ định kết luận — rồi hợp giải tới □.",
    umbrellaAfter: "Đừng tin lời tôi: mở Lab ở mục 10, chọn ví dụ “Joe và cây dù”, chế độ Hợp giải. Lab có thể tìm một chứng minh khác thứ tự, nhưng cũng kết thúc bằng □."
  },
  chaining: {
    title: "⛓️ Mệnh đề Horn: suy luận theo dây chuyền",
    en: "Horn clauses, forward and backward chaining",
    lead: "Hợp giải đầy đủ nhưng có thể sinh ra rất nhiều mệnh đề. Nếu KB chịu viết theo một khuôn hẹp hơn — mỗi mệnh đề nhiều nhất một literal dương — thì quyết định hệ quả logic chỉ tốn thời gian tuyến tính.",
    cards: [
      {
        title: "Definite clause · Mệnh đề xác định",
        body: "Đúng <strong>một</strong> literal dương. ¬P ∨ ¬Q ∨ R là mệnh đề xác định; ¬P ∨ Q ∨ R thì không."
      },
      {
        title: "Horn clause",
        body: "<strong>Nhiều nhất một</strong> literal dương. Mọi mệnh đề xác định đều là Horn. Horn đóng với hợp giải: hợp giải hai mệnh đề Horn lại ra mệnh đề Horn."
      },
      {
        title: "Goal clause · Mệnh đề đích",
        body: "Không có literal dương nào, ví dụ ¬P ∨ ¬Q, tức (P ∧ Q) ⇒ False."
      }
    ],
    rule: "Mệnh đề xác định đọc được như một luật: <span class='code-inline'>¬P ∨ ¬Q ∨ R ≡ P ∧ Q ⇒ R</span>. <strong>Thân</strong> (premise) là hội các literal dương, <strong>đầu</strong> (conclusion) là một ký hiệu dương; mệnh đề chỉ gồm một literal dương, không có literal âm nào (thân rỗng) — như A — là một <strong>sự kiện</strong>. Dễ đọc hơn CNF nhiều, là nền của lập trình logic, và với KB toàn mệnh đề xác định, việc quyết định hệ quả chỉ tốn <strong class='hl'>thời gian tuyến tính</strong> theo kích thước KB.",
    grammarTitle: "CNF và Horn viết bằng ngữ pháp",
    hornVsCnf: "CNF: mỗi mệnh đề là tuyển literal bất kỳ, nối với nhau bằng ∧. Horn là dạng hạn chế: mỗi mệnh đề nhiều nhất một literal dương. Chịu hạn chế đó, bạn đổi được hợp giải lấy forward / backward chaining.",
    fcTitle: "Forward chaining: mở tủ lạnh xem nấu được gì",
    fc: "Ý chính: bắn mọi luật đã đủ tiền đề trong KB, thêm kết luận vào KB, lặp tới khi gặp truy vấn. PL-FC-ENTAILS? giữ cho mỗi luật một <span class='code-inline'>count</span> = số tiền đề còn thiếu, như thẻ tích điểm ghi còn thiếu bao nhiêu tem mới đổi được quà. Mỗi khi một ký hiệu được xác nhận đúng, mọi luật có nó trong thân được đóng thêm một tem — số tem còn thiếu giảm đi một; luật nào còn thiếu 0 tem (đủ thẻ) thì kết luận được đẩy vào <span class='code-inline'>agenda</span>. Thuật toán đúng đắn và đầy đủ với KB mệnh đề xác định.",
    graph: "Đồ thị dưới là KB: P ⇒ Q, L ∧ M ⇒ P, B ∧ L ⇒ M, A ∧ P ⇒ L, A ∧ B ⇒ L, cùng hai sự kiện A, B. Mỗi ô chữ nhật là một luật — <strong>AND</strong>: cần đủ mọi mũi tên đi vào. Hai luật cùng trỏ vào L là <strong>OR</strong>: một luật đủ là được.",
    bcTitle: "Backward chaining: đọc công thức ngược từ món muốn ăn",
    bc: "Đi lùi từ truy vấn q: nếu q đã biết thì xong; nếu chưa, tìm một luật kết luận q rồi chứng minh đệ quy mọi tiền đề của nó. Hai cái phanh: <strong>tránh lặp</strong> — mục tiêu mới đã nằm trên chồng mục tiêu thì bỏ; <strong>tránh làm lại</strong> — mục tiêu đã chứng minh xong thì dùng lại kết quả; mục tiêu đã thất bại cũng dùng lại được, <em>trừ khi</em> nó thất bại chỉ vì bị cắt vòng lặp — gọi từ chỗ khác, lúc không còn vòng lặp, nó có thể chứng minh được.",
    bcNote: "Trong hình, khi cần L, luật đầu tiên là A ∧ P ⇒ L — nhưng P đang chờ trên chồng (P cần L). Đó là vòng lặp, nên backward chaining bỏ luật đó và thử A ∧ B ⇒ L. Lúc sau cần L cho M, nó dùng lại kết quả đã có thay vì chứng minh lại.",
    fcOrder: "Thứ tự trên đồ thị này: lấy A (A ∧ P ⇒ L và A ∧ B ⇒ L còn 1) → lấy B (B ∧ L ⇒ M còn 1; A ∧ B ⇒ L về 0 → thêm L) → lấy L (L ∧ M ⇒ P còn 1; B ∧ L ⇒ M về 0 → thêm M) → lấy M (L ∧ M ⇒ P về 0 → thêm P) → lấy P (P ⇒ Q về 0 → thêm Q; A ∧ P ⇒ L về 0 → thêm L lần nữa) → lấy Q: gặp truy vấn.",
    bcOrder: "Thứ tự mục tiêu: Q? cần P (qua P ⇒ Q); P? cần L và M (qua L ∧ M ⇒ P). Với L: thử A ∧ P ⇒ L — A ✓ nhưng P đang trên chồng → bỏ; thử A ∧ B ⇒ L — A ✓, B ✓ → L ✓. Với M: B ∧ L ⇒ M — B ✓ (đã chứng minh), L ✓ (dùng lại) → M ✓ → P ✓ → Q ✓.",
    traceTitle: "Xem toàn bộ diễn biến của hai hình (bản tĩnh)",
    codeTitle: "PL-FC-ENTAILS? bằng Python",
    codeLead: "Mỗi mệnh đề <span class='code-inline'>c</span> là một đối tượng có <span class='code-inline'>premise</span> (tập ký hiệu ở thân) và <span class='code-inline'>conclusion</span>; <span class='code-inline'>count</span> dùng chính c làm khóa nên c phải hash được.",
    compareTitle: "Forward hay backward?",
    compareHeaders: [
      "",
      "Forward chaining",
      "Backward chaining"
    ],
    compareRows: [
      [
        "Hướng",
        "Dữ liệu dẫn đường; tự động, như xử lý vô thức",
        "Mục tiêu dẫn đường; hợp với giải quyết vấn đề"
      ],
      [
        "Ví dụ",
        "Nhận diện vật thể, quyết định thường ngày",
        "Chìa khóa của tôi đâu? Làm sao vào được chương trình tiến sĩ?"
      ],
      [
        "Chi phí",
        "Có thể làm nhiều việc chẳng liên quan tới đích",
        "Thường ít hơn nhiều so với tuyến tính theo kích thước KB"
      ]
    ],
    anotherTitle: "Thêm một ví dụ, tự làm bằng tay",
    another: "KB: A ∧ B ⇒ C, C ∧ D ⇒ E, C ∧ F ⇒ G, A, B, D. Hỏi E?",
    anotherAnswer: "<strong>Forward</strong>: A, B ⇒ C (luật 1); C, D ⇒ E (luật 2) — xong. <strong>Backward</strong>: E? cần C và D; C? cần A, B — cả hai cho sẵn; D cho sẵn → mọi luật cần thiết đều thỏa, E được chứng minh. Luật C ∧ F ⇒ G không bao giờ phải đụng tới.",
    quizTitle: "Quiz 05 · báo cháy theo hai hướng",
    quiz: "Dùng lại KB của Quiz 01 ở mục 05 — H ∧ S ⇒ F, A ⇒ S, F ⇒ R, A, H — và trả lời “vòi phun có bật không?” bằng forward rồi backward chaining.",
    quizAnswer: "KB: H ∧ S ⇒ F, A ⇒ S, F ⇒ R, A, H. <strong>Forward</strong>: lấy A → A ⇒ S về 0, thêm S; lấy H → H ∧ S ⇒ F còn 1; lấy S → về 0, thêm F; lấy F → thêm R; gặp R. <strong>Backward</strong>: R? ← F? ← H ✓ và S? ← A ✓. Cùng đáp án với kiểm mô hình ở Quiz 01, mà không phải lật bảng nào."
  },
  dpll: {
    title: "DPLL và WalkSAT: khi thế giới quá lớn để lật",
    en: "Efficient model checking: DPLL, DP and WalkSAT",
    lead: "Năm 1960, Martin Davis và Hilary Putnam công bố một thủ tục kiểm thỏa được dựa trên hợp giải. Nó đúng, nhưng ngốn bộ nhớ. Hai năm sau, Davis cùng George Logemann và Donald Loveland thay phần khử biến bằng tìm kiếm quay lui — và bốn chữ cái DPLL theo nó tới tận các bộ giải SAT ngày nay.",
    paras: [
      "Kiểm KB ⊨ α chính là kiểm KB ∧ ¬α không thỏa được — một bài SAT. Có hai họ thuật toán hiệu quả dựa trên kiểm mô hình: <strong>quay lui đầy đủ</strong> (DPLL) và <strong>tìm kiếm cục bộ không đầy đủ</strong> (WalkSAT, họ hàng của leo đồi ở buổi 6).",
      "DPLL nhận câu ở CNF và duyệt mô hình theo chiều sâu, đệ quy — y như TT-ENTAILS — nhưng có ba cải tiến:"
    ],
    cards: [
      {
        title: "1 · Dừng sớm",
        body: "Mệnh đề đúng nếu <strong>một</strong> literal đúng; câu sai nếu <strong>một</strong> mệnh đề sai. Ví dụ (A ∨ B) ∧ (A ∨ C) đúng ngay khi A đúng, chẳng cần biết B và C — bỏ được cả cây con."
      },
      {
        title: "2 · Ký hiệu thuần",
        body: "Ký hiệu luôn xuất hiện cùng một dấu trong mọi mệnh đề. Với (A ∨ ¬B), (¬B ∨ ¬C), (A ∨ C): A và B thuần, C thì không. Gán cho literal thuần là đúng (A = đúng, B = sai) không bao giờ làm mệnh đề nào sai. Khi kiểm độ thuần, bỏ qua mệnh đề đã đúng."
      },
      {
        title: "3 · Mệnh đề đơn vị",
        body: "Mệnh đề mà mọi literal khác đều đã bị gán sai, chỉ còn đúng một literal chưa gán: literal đó buộc phải đúng. A = đúng thì (¬A ∨ ¬B) thành đơn vị → B sai; còn (A ∨ B) đã đúng nhờ A nên chẳng ép gì cả. Lan truyền: nếu B = đúng, (¬B ∨ ¬C) thành ¬C → C sai → (A ∨ C) buộc A đúng. Như chỉ còn một ghế trống, người cuối khỏi phải chọn."
      }
    ],
    codeTitle: "DPLL bằng Python",
    codeLead: "Thứ tự trong DPLL: dừng sớm → ký hiệu thuần → mệnh đề đơn vị → rồi mới tách nhánh. Bản Python giữ đúng thứ tự đó; các hàm tìm ký hiệu thuần và mệnh đề đơn vị được giả định có sẵn.",
    dpTitle: "DP và DPLL",
    dp: "Thủ tục DP gốc khử lần lượt từng ký hiệu φ: hợp giải <em>mọi</em> cặp mệnh đề chứa φ và ¬φ, giữ các kết quả không hằng đúng, rồi xóa mọi mệnh đề chứa φ hoặc ¬φ. Cuối cùng còn mệnh đề rỗng thì không thỏa được. Mỗi lần khử có thể làm tập mệnh đề <strong>nở bậc hai</strong> — bài lớn là cạn bộ nhớ. DPLL giải tuần tự các bài nhỏ hơn: chọn một literal, giả sử nó đúng, rút gọn tập mệnh đề, thử chứng minh thỏa được; không được thì làm lại với phủ định. Không bao giờ nhân chéo tập mệnh đề.",
    dpHeaders: [
      "Bài",
      "Tautology",
      "DP",
      "DPLL"
    ],
    dpNote: "Đọc bảng cho tỉnh: bảng gốc không ghi đơn vị, không giải thích cột Tautology (nhiều khả năng là kiểm hằng đúng kiểu liệt kê) và dấu *, nên tôi chỉ đọc thứ tự. DP không thua ở mọi dòng — ở Mkadder32 tới Mkadder53 nó còn nhanh hơn. Nhưng ở các ô <strong>*</strong>, DP không có kết quả, trong khi DPLL vẫn trả lời. Cột Tautology thì đã vượt một giờ từ Prime16.",
    quiz06Title: "Quiz 06 · DPLL hoặc DP",
    quiz06: "KB: A ⇒ B ∨ C, A ⇒ D, C ∧ D ⇒ ¬F, B ⇒ F, A. Dùng DPLL hoặc DP kiểm xem KB có kéo theo (a) C và (b) B ⇒ ¬C không.",
    quiz06Answer: "CNF của KB: ¬A ∨ B ∨ C · ¬A ∨ D · ¬C ∨ ¬D ∨ ¬F · ¬B ∨ F · A. <strong>(a)</strong> Thêm ¬C. Đơn vị A → A đúng; ¬A ∨ D thành đơn vị → D đúng; ¬C → C sai. Lúc này ¬C ∨ ¬D ∨ ¬F đã đúng; trong các mệnh đề còn lại F chỉ xuất hiện dương → thuần, F đúng; B cũng chỉ còn dương → B đúng. Mọi mệnh đề đúng: mô hình {A, B, D, F đúng; C sai} thỏa KB ∧ ¬C → <strong class='hl'>KB ⊭ C</strong>. <strong>(b)</strong> ¬(B ⇒ ¬C) ≡ B ∧ C, thêm hai mệnh đề đơn vị B và C. Đơn vị A → D đúng; B → (¬B ∨ F) cho F đúng; còn ¬C ∨ ¬D ∨ ¬F với C, D, F đều đúng → sai. Mâu thuẫn mà chưa cần tách nhánh nào → <strong class='hl'>KB ⊨ B ⇒ ¬C</strong>. Đi đường DP cho (b): khử C → thêm ¬A ∨ B ∨ ¬D ∨ ¬F và ¬D ∨ ¬F; khử F → ¬B ∨ ¬D (bỏ mệnh đề hằng đúng); khử D → ¬A ∨ ¬B; khử A → ¬B; khử B: B với ¬B cho □ → không thỏa được.",
    walkTitle: "WalkSAT: leo đồi có chút liều",
    walk: "WalkSAT bắt đầu từ một phép gán ngẫu nhiên. Mỗi vòng: chọn ngẫu nhiên một mệnh đề đang sai; với xác suất <strong>p</strong> (thường khoảng 0,5) lật một ký hiệu ngẫu nhiên trong mệnh đề đó, còn lại thì lật ký hiệu làm <strong>nhiều mệnh đề đúng nhất</strong> — chính là heuristic min-conflicts của buổi 8, tối thiểu số mệnh đề chưa thỏa. Cân bằng giữa tham lam và ngẫu nhiên; hết max_flips thì trả về failure.",
    check: {
      q: "WalkSAT chạy trên KB ∧ ¬α, hết lượt lật mà không tìm thấy mô hình nào. Vậy KB ⊨ α?",
      opts: [
        "Đúng — không có mô hình nghĩa là không thỏa được",
        "Chưa chắc — có thể chỉ là chưa tìm đủ lâu",
        "Không — chắc chắn KB ⊭ α"
      ],
      a: 1,
      ex: "WalkSAT tìm ra mô hình thì câu chắc chắn thỏa được. Còn trả về failure thì có hai khả năng: thật sự không thỏa được, hoặc cần thêm thời gian. Nó <strong>không phát hiện được</strong> tính không thỏa được, nên agent Wumpus không thể dùng WalkSAT để chứng minh một ô an toàn — cùng lắm nó nói: “tôi nghĩ cả tiếng rồi mà không ra thế giới nào ô đó không an toàn”. WalkSAT hữu ích nhất khi bạn tin là có nghiệm."
    },
    scaleTitle: "Agent Wumpus thật cần bao nhiêu câu?",
    scale: "Một agent Wumpus dùng logic mệnh đề cho hang 4×4 cần KB với <strong>64</strong> ký hiệu riêng biệt — 16 ô × 4 loại P, W, B, S — và <strong>155</strong> câu: ¬P₁,₁ và ¬W₁,₁; mỗi ô một câu Bₓ,ᵧ ⇔ (Pₓ,ᵧ₊₁ ∨ Pₓ,ᵧ₋₁ ∨ Pₓ₊₁,ᵧ ∨ Pₓ₋₁,ᵧ) và một câu Sₓ,ᵧ tương tự với W; câu “có ít nhất một Wumpus” W₁,₁ ∨ W₁,₂ ∨ … ∨ W₄,₄; và từng cặp ¬W₁,₁ ∨ ¬W₁,₂, ¬W₁,₁ ∨ ¬W₁,₃, … nói “nhiều nhất một Wumpus”.",
    scalePunch: "Đếm thử: 2 + 16 + 16 + 1 + 120 cặp = 155. Riêng ý “nhiều nhất một Wumpus” đã chiếm <strong>120</strong> câu.",
    limitsTitle: "Giới hạn của logic mệnh đề",
    limits: "Logic mệnh đề chạm trần về sức diễn đạt. KB phải chép lại “vật lý” cho <strong>từng ô một</strong>: câu “đừng đi tới nếu Wumpus ở ngay trước mặt” cần <strong>16 ô × 4 hướng = 64</strong> luật mệnh đề. Thời gian còn khó hơn: với mọi thời điểm t và vị trí [x,y] phải viết riêng một câu như dưới đây — như thể có một KB riêng cho mỗi thời điểm. Dựng một agent thật sẽ cần hàng nghìn luật.",
    limitsFormula: "Lᵗₓ,ᵧ ∧ FacingRightᵗ ∧ Forwardᵗ ⇒ Lᵗ⁺¹ₓ₊₁,ᵧ",
    bridge: "Buổi 10 chữa đúng chỗ đau này bằng <strong>logic bậc nhất</strong>: có đối tượng, quan hệ, biến và lượng từ ∀ ∃, nên một câu thay được cho cả họ câu viết riêng từng ô."
  },
  lab: {
    title: "🧪 Một KB, năm cỗ máy suy luận",
    en: "Logic Lab",
    lead: "Cùng một câu hỏi KB ⊨ α? Bảng chân trị lật hết thế giới, hợp giải đi tìm □, chaining bắn luật, DPLL quay lui có mẹo, WalkSAT lật bừa có tính toán. Đọc năm cách là một chuyện; nhìn chúng chạy trên cùng một KB mới thấy mỗi cách trả giá ở đâu.",
    intro: "Ba thí nghiệm tôi muốn bạn làm: (1) chọn <strong>Hang Wumpus</strong>, chạy Bảng chân trị rồi Hợp giải — 3/128 dòng và một chứng minh □ nói cùng một điều; (2) vẫn KB đó, chọn Forward chaining — Lab sẽ từ chối, và lý do từ chối chính là bài học; (3) chọn <strong>Quiz 06</strong>, đổi truy vấn thành <span class='code-inline'>C</span>: DPLL trả về một mô hình phản ví dụ, còn WalkSAT có thể tìm thấy nó hoặc bỏ cuộc mà không kết luận được gì.",
    answer: "(1) Cả hai cùng nói KB ⊨ ¬P₁,₂. (2) R1 = ¬P₁,₁ là mệnh đề đích, không có literal dương; R2 đổi sang CNF còn ra ¬B₁,₁ ∨ P₁,₂ ∨ P₂,₁ với hai literal dương. Chaining chỉ chạy trên mệnh đề xác định. (3) KB ⊭ C: mô hình A, B, D, F đúng, C sai làm mọi câu của KB đúng. Với truy vấn mặc định B ⇒ ¬C, DPLL ra mâu thuẫn mà không cần tách nhánh: KB ⊨ B ⇒ ¬C.",
    preset: "Ví dụ",
    presets: {
      wumpus: "Hang Wumpus (R1–R5)",
      fire: "Báo cháy (Quiz 01/05)",
      umbrella: "Joe và cây dù (Quiz 04)",
      chain: "Đồ thị AND-OR",
      dpll: "Quiz 06",
      custom: "Tự nhập"
    },
    kb: "KB — mỗi dòng một câu",
    query: "Truy vấn α",
    syntax: "Cú pháp: ¬ hoặc ~ · ∧ hoặc & · ∨ hoặc | · ⇒ hoặc => · ⇔ hoặc <=> · ngoặc ( ). Ký hiệu là chữ cái kèm chữ số, như P1,2 hay alarm_beeps. Dòng bắt đầu bằng # là chú thích.",
    method: "Cách suy luận",
    methods: {
      tt: "Bảng chân trị",
      resolution: "Hợp giải",
      fc: "Forward chaining",
      bc: "Backward chaining",
      dpll: "DPLL",
      walksat: "WalkSAT"
    },
    verdict: {
      yes: "KB ⊨ α",
      no: "KB ⊭ α",
      unknown: "Chưa kết luận"
    },
    errors: {
      empty: "câu rỗng",
      char: "ký tự lạ",
      unexpected: "không chờ ký hiệu này",
      end: "câu dừng giữa chừng",
      unclosed: "thiếu dấu đóng ngoặc",
      line: "Dòng",
      query: "Truy vấn",
      at: "tại vị trí"
    },
    tt: {
      tooMany: "ký hiệu — quá nhiều để lật bảng trong Lab (giới hạn 12).",
      models: "Số mô hình",
      kbModels: "KB đúng",
      counter: "Phản ví dụ",
      alpha: "α một mình là",
      classes: {
        valid: "hằng đúng",
        satisfiable: "thỏa được, không hằng đúng",
        unsatisfiable: "không thỏa được"
      },
      rows: "Các mô hình KB đúng",
      more: "dòng nữa không hiện"
    },
    res: {
      clauses: "Mệnh đề của KB ∧ ¬α (CNF)",
      kb: "KB câu",
      query: "¬α",
      proof: "Chứng minh",
      on: "hợp giải trên",
      generated: "Mệnh đề sinh thêm",
      saturated: "Không sinh thêm được mệnh đề mới → KB ⊭ α",
      limit: "Dừng ở giới hạn 500 mệnh đề — chưa kết luận",
      empty: "KB ∧ ¬α không có mệnh đề nào (mọi câu đều hằng đúng)"
    },
    fc: {
      notDefinite: "Forward / backward chaining chỉ chạy trên KB toàn mệnh đề xác định. Câu này phá điều kiện:",
      goal: "mệnh đề đích (không literal dương)",
      nonHorn: "nhiều hơn một literal dương",
      badQuery: "Truy vấn phải là một ký hiệu dương — không ¬, không phép nối.",
      rules: "Luật (count ban đầu)",
      agenda: "agenda",
      events: {
        init: "Khởi tạo agenda bằng các sự kiện",
        pop: "Lấy ra",
        skip: "đã suy ra trước đó, bỏ qua",
        decrement: "giảm count của",
        fire: "count = 0, bắn luật",
        found: "Gặp truy vấn",
        exhausted: "agenda rỗng mà chưa gặp truy vấn"
      }
    },
    bc: {
      events: {
        goal: "Mục tiêu",
        fact: "là sự kiện ✓",
        "memo-true": "đã chứng minh trước đó ✓",
        "memo-fail": "đã thất bại trước đó",
        loop: "đang nằm trên chồng mục tiêu → bỏ (tránh lặp)",
        try: "thử luật",
        proved: "chứng minh xong ✓",
        "rule-fail": "luật này không dùng được",
        fail: "không chứng minh được"
      }
    },
    dp: {
      events: {
        sat: "Mọi mệnh đề đúng → thỏa được",
        conflict: "Có mệnh đề sai → nhánh này thất bại",
        pure: "Ký hiệu thuần",
        unit: "Mệnh đề đơn vị",
        split: "Tách nhánh"
      },
      unsat: "KB ∧ ¬α không thỏa được → KB ⊨ α",
      sat: "Tìm thấy mô hình của KB ∧ ¬α — phản ví dụ:",
      truncated: "Trace bị cắt ở 400 sự kiện."
    },
    ws: {
      start: "Phép gán ngẫu nhiên ban đầu",
      flip: "Lật",
      random: "ngẫu nhiên",
      greedy: "tham lam",
      unsat: "mệnh đề sai",
      model: "Tìm thấy mô hình của KB ∧ ¬α → KB ⊭ α",
      failure: "Hết 100 lượt lật, không tìm thấy mô hình → chưa kết luận được",
      reseed: "Chạy lại với seed khác"
    },
    trace: "Diễn biến",
    more: "bước nữa",
    reset: "Khôi phục ví dụ"
  },
  visual: {
    models: {
      title: "Lọc tám thế giới",
      tabs: [
        "α₁: không hố ở [1,2]",
        "α₂: không hố ở [2,2]"
      ],
      phases: [
        "Tám mô hình của ba ô [1,2], [2,2], [3,1].",
        "Viền đỏ: M(KB) — KB giữ lại 3 mô hình.",
        "Nền vàng: M(α) — các mô hình làm α đúng.",
        "So hai tập."
      ],
      verdicts: [
        "M(KB) ⊆ M(α₁) → KB ⊨ α₁",
        "2 mô hình của KB nằm ngoài M(α₂) → KB ⊭ α₂"
      ],
      pit: "hố",
      legend: "Mỗi bảng nhỏ là một thế giới: hàng dưới [1,1] [2,1] [3,1], hàng trên [1,2] [2,2] [3,2]; chấm đậm = hố."
    },
    res: {
      title: "Hợp giải phản chứng: Joe không ướt",
      headers: [
        "#",
        "Mệnh đề",
        "Từ đâu"
      ],
      kb: "Từ KB",
      query: "Phủ định kết luận",
      pair: "Hợp giải",
      captions: [
        "Bốn mệnh đề ban đầu: ba câu KB ở CNF và W — phủ định của ¬W.",
        "Hợp giải 1 và 2 trên U: ¬R ∨ ¬W.",
        "Hợp giải 3 và 5 trên R: ¬W ∨ ¬W, factoring còn ¬W.",
        "Hợp giải 4 và 6 trên W: □. KB ∧ W mâu thuẫn → KB ⊨ ¬W."
      ]
    },
    chain: {
      title: "Chaining trên đồ thị AND-OR",
      tabs: [
        "Forward chaining",
        "Backward chaining"
      ],
      legend: "Ô chữ nhật: luật, số là count · tròn tô màu: đã suy ra / đã chứng minh · viền vàng: đang xét · viền chấm: đang chờ trên chồng mục tiêu",
      stack: "Chồng mục tiêu"
    },
    cycle: "Minh họa tự lặp; lời giải tĩnh nằm ngay quanh hình."
  },
  summary: {
    title: "Ghi nhớ trên một màn hình",
    en: "Five ways to answer KB ⊨ α",
    lead: "Khi quên tên thuật toán, hãy hỏi: nó lật thế giới, hay nó viết chứng minh?",
    headers: [
      "Cách",
      "Ý chính",
      "Đúng đắn / đầy đủ",
      "Chi phí"
    ],
    rows: [
      [
        "Bảng chân trị",
        "Lật mọi mô hình; α đúng ở mọi dòng KB đúng",
        "✓ / ✓",
        "O(2ⁿ) thời gian, O(n) bộ nhớ"
      ],
      [
        "Luật suy diễn",
        "Modus Ponens, khử ∧, De Morgan… dựng chứng minh",
        "✓ / tùy bộ luật",
        "Chỉ đi qua câu liên quan"
      ],
      [
        "Hợp giải",
        "CNF của KB ∧ ¬α, hợp giải tới □",
        "✓ / ✓ (theo phản chứng)",
        "Có thể sinh rất nhiều mệnh đề"
      ],
      [
        "Forward / backward chaining",
        "Chỉ cho KB mệnh đề xác định",
        "✓ / ✓ trên KB xác định",
        "Tuyến tính; backward thường ít hơn"
      ],
      [
        "DPLL",
        "Quay lui + dừng sớm, ký hiệu thuần, mệnh đề đơn vị",
        "✓ / ✓",
        "Xấu nhất vẫn mũ, thực tế nhanh hơn nhiều"
      ],
      [
        "WalkSAT",
        "Leo đồi min-conflicts + bước ngẫu nhiên",
        "✓ khi tìm ra mô hình / ✗",
        "Nhanh khi có nghiệm; không chứng minh được vô nghiệm"
      ]
    ],
    recall: "Tự kể lại bằng một câu: KB ⊨ α nghĩa là M(KB) ⊆ M(α), và mọi thuật toán của buổi này hoặc kiểm thẳng điều đó, hoặc chứng minh KB ∧ ¬α không có mô hình nào."
  },
  quiz: {
    title: "Tự kiểm · rồi quay lại chỗ vướng",
    en: "Check your understanding",
    lead: "Mười một câu, mỗi câu nhắm một chỗ hay nhầm. Sai câu nào thì đọc phản hồi rồi quay lại đúng mục đó trước khi làm bài tập."
  },
  hw: {
    title: "Bài tập · từ hang Wumpus tới vụ án",
    en: "Practice and transfer",
    lead: "Ba bài dưới đây là bài tập gốc của buổi. Giải bằng giấy trước, rồi dán KB của bạn vào Lab để tự kiểm.",
    file: "Mở bài tập gốc (PDF)",
    lab2: "Mở Lab 2 (notebook)",
    lab2Note: "Phần 1 của Lab 2 yêu cầu viết ba câu tiếng Anh thành logic mệnh đề, kiểm bằng model checking — đúng thứ bạn vừa học. Các phần sau dùng logic bậc nhất của buổi 10. Mẹo cho câu 1c “Day or night”: bộ chấm chỉ nhận hai mô hình {Day} và {Night} — “hoặc” đời thường ở đây là hoặc loại trừ, nên Day ∨ Night sẽ trượt.",
    cards: [
      {
        title: "1 · Ai là thủ phạm?",
        body: "Ba nghi phạm: Adams, Brown, Clark. Adams: “Tôi không làm. Nạn nhân là người quen cũ của Brown. Nhưng Clark ghét ông ta.” Brown: “Tôi không làm. Tôi còn không biết ông ta. Hơn nữa cả tuần tôi đi vắng.” Clark: “Tôi không làm. Tôi thấy cả Adams và Brown ở trung tâm với nạn nhân hôm đó; một trong hai người đã làm.” Hai người vô tội nói thật, người có tội thì có thể nói dối. Viết thành logic mệnh đề và dùng hợp giải tìm thủ phạm.",
        hint: "Đặt A, B, C = Adams / Brown / Clark có tội; K = Brown quen nạn nhân; H = Clark ghét nạn nhân; T = Brown đi vắng cả tuần; D = Adams và Brown ở trung tâm với nạn nhân. Đúng một người có tội: A ∨ B ∨ C, ¬(A ∧ B), ¬(A ∧ C), ¬(B ∧ C). Người vô tội nói thật: ¬A ⇒ K ∧ H, ¬B ⇒ ¬K ∧ T, ¬C ⇒ D ∧ (A ∨ B). Thêm hiểu biết nền: ở trung tâm thì không thể đi vắng, D ⇒ ¬T. Giả sử Brown vô tội (¬B, phủ định kết luận): có ¬K và T. Nếu Adams có tội thì Clark vô tội → D → ¬T, mâu thuẫn với T. Nếu Clark có tội thì Adams vô tội → K, mâu thuẫn với ¬K. Mọi nhánh tới □ → <strong>Brown là thủ phạm</strong>. Dán tám câu vào Lab với truy vấn B để xem hợp giải tự làm. Muốn <em>tìm</em> thủ phạm thay vì đoán rồi kiểm: chạy hợp giải lần lượt với truy vấn A, B, C — chỉ truy vấn B đi tới □. Với A và C, Lab có thể dừng ở giới hạn 500 mệnh đề mà chưa kết luận; khi đó chuyển sang Bảng chân trị hoặc DPLL để thấy KB ⊭ A và KB ⊭ C."
      },
      {
        title: "2 · Kiểm hệ quả trong một KB có ⇔",
        body: "KB = {A, B, A ∨ C, K ∧ E ⇔ A ∧ B, ¬C ⇒ D, E ∨ F ⇒ ¬D}. Kiểm xem KB có kéo theo: (a) B ∧ C? (b) C ∨ E ⇒ F ∧ B?",
        hint: "A, B đúng → K ∧ E đúng → E đúng → E ∨ F đúng → ¬D. Câu ¬C ⇒ D với D sai buộc C đúng. (a) B ∧ C: <strong>được kéo theo</strong>. (b) C ∨ E đúng nên cần F ∧ B; B đúng, nhưng F không bị câu nào ràng buộc — mô hình có F sai vẫn làm KB đúng mà làm câu (b) sai. <strong>Không</strong> được kéo theo."
      },
      {
        title: "3 · Chaining trên mệnh đề xác định",
        body: "KB: 1. C ∧ D ⇒ Y · 2. R ∧ Z ⇒ C · 3. ¬B ∨ D · 4. ¬D ∨ ¬R ∨ Z · 5. B · 6. R ⇒ D · 7. D ⇒ R. Chứng minh Y bằng backward chaining và forward chaining; với forward chaining, mỗi luật chỉ bắn một lần.",
        hint: "Viết 3 và 4 thành luật: B ⇒ D và D ∧ R ⇒ Z. <strong>Forward</strong>: B (5) → D (3) → R (7) → Z (4, cần D và R) → C (2, cần R và Z) → Y (1, cần C và D). <strong>Backward</strong>: Y? cần C, D. C? cần R, Z. R? qua D ⇒ R cần D; D? qua B ⇒ D, B là sự kiện ✓ → D ✓ → R ✓. Z? cần D ✓, R ✓ → Z ✓ → C ✓. D đã có → Y ✓. Nếu lúc chứng minh D bạn thử R ⇒ D trước, R đang nằm trên chồng mục tiêu — vòng lặp, bỏ nhánh đó."
      }
    ],
    checks: [
      "Tôi phân biệt được câu được cho (tiên đề, tri giác) với câu suy ra.",
      "Tôi giải thích được KB ⊨ α bằng tập mô hình, và biết ⊭ α không có nghĩa là ⊨ ¬α.",
      "Tôi lập được bảng chân trị và nhận ra hằng đúng, thỏa được, không thỏa được.",
      "Tôi đổi được một câu bất kỳ sang CNF qua bốn bước.",
      "Tôi chứng minh được bằng hợp giải phản chứng tới mệnh đề rỗng.",
      "Tôi chạy tay được forward và backward chaining trên KB Horn.",
      "Tôi biết DPLL đầy đủ còn WalkSAT thì không, và giải thích được vì sao."
    ],
    next: "Buổi 10 mở sang logic bậc nhất: đối tượng, quan hệ, lượng từ ∀ ∃ — và bài tập về chó săn, mèo, ông già Noel của buổi đó sẽ cần tới nó.",
    roadmap: "← Trở về lộ trình"
  }
};
