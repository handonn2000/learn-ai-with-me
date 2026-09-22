# Coverage ledger — CSC14003 · b6 · Tìm kiếm cục bộ

Ngày đọc nguồn: 2026-09-21; hoàn tất báo cáo: 2026-09-22. Review độc lập, chỉ đọc. Tên `Lecture04`/`Homework4` được giữ như provenance sau khi lộ trình đổi sang 13 buổi.

Phạm vi: kiến thức, điều kiện, ví dụ tính toán và bài tập để hoàn thành buổi local search theo yêu cầu “tham khảo các bài đã tạo trước đó”. User không yêu cầu chép lại nguyên xi từng chuỗi ngẫu nhiên của mọi hình; các hình lặp cùng cơ chế được gộp, vẫn ghi tất cả locator. Việc phát triển riêng một chương continuous optimization nằm ngoài buổi này. Không chứng nhận UI runtime; caller kiểm browser riêng.

Quy ước: `VI` = `src/features/lessons/b6/lesson06.text.vi.ts`; `EN` là bundle cùng tên `.en.ts`; engine = `local-search-engine.ts`; code = `lesson06.code.ts`; route = `Lesson06LocalSearch.tsx`. Anchor là ID thực sự trong route. Đã đọc toàn bộ 42 trang trích xuất, xem toàn bộ 42 trang trên contact sheet, phóng riêng các hình bảng/cờ/GA phức tạp trang 14,16,29,31; đọc và xem đầy đủ hai trang homework.

| Nguồn + trang | Unit kiến thức / chi tiết | Đích thực tế | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| Lecture04 p4 | Phân biệt tìm đường có lịch sử với tối ưu cấu hình cuối | VI ch1.lead/body/memory/examples; #ch1 | covered | Lịch thi và TSP phân biệt thứ tự của lời giải với thứ tự chỉnh sửa lời giải. |
| Lecture04 p4,p7 | Pure optimization: mục tiêu max/min, không nhất thiết goal test nhận biết sẵn | VI ch1.body; #ch1 | covered-with-correction | Tránh suy rộng “không có goal test” sang N-hậu: h=0 nhận ra nghiệm. |
| Lecture04 p5 | Objective function chấm chất lượng trạng thái | VI ch1.body/cards[2]; #ch1 | covered | C(s) giảm và V(s) tăng; h đổi sang fitness có giải thích. |
| Lecture04 p5 | Ví dụ scheduling, TSP, knight’s tour, circuit, factory, routing, program generation | VI ch1.lead/examples; #ch1 | covered | Tất cả loại ứng dụng nêu trong nguồn hiện diện, TSP có diễn giải trạng thái. |
| Lecture04 p6 | Local search sửa quanh trạng thái hiện tại, không lưu toàn bộ đường | VI ch1.cards[0:2]/memory, ch2.rule; #ch1,#ch2 | covered | Nêu một/vài cấu hình; láng giềng do phép sửa quy định. |
| Lecture04 p6 | Bộ nhớ nhỏ, số cấu hình khác số byte | VI ch1.memory, ch7.rows/cost; #ch1,#ch7 | covered-with-correction | O(1) cấu hình không biến bàn N-hậu thành O(1) byte; beam/GA và trace học tập được tách. |
| Lecture04 p6 | Lợi thế quy mô minh họa n=200 so với n=1.000.000 | VI ch1.scale; #ch1 | covered-with-correction | Giữ số nhưng không nhận là giới hạn cứng/hứa benchmark. Khả năng ở không gian liên tục chỉ gợi qua primer gradient; xem bổ sung tùy chọn của report. |
| Lecture04 p7,p9 | Mục tiêu cực tiểu chi phí / cực đại giá trị | VI ch1.body, ch2.body; #ch1,#ch2 | covered | Nhãn V của địa hình và h của bàn cờ có chiều tốt đối nhau rõ ràng. |
| Lecture04 p8 | Landscape location↔state, elevation↔value | VI ch2.body; LocalSearchVisuals Landscape; #ch2 | covered | SVG, trục, caption và dữ liệu LANDSCAPE dùng cùng giá trị. |
| Lecture04 p8,p15 | Local/global peak, plateau, shoulder và ridge | VI ch2.traps; #ch2 | covered | Nêu shoulder có lối tăng sau bước ngang; ridge phụ thuộc neighborhood. |
| Lecture04 p9 | Đầy đủ khác tối ưu | VI ch2.distinction; #ch2 | covered | Không bảo đảm cho hill-climbing thường, không đồng nhất GBFS. |
| Lecture04 p11,p12 | Steepest hill-climbing; so toàn bộ hàng xóm; dừng khi không tốt hơn | VI ch2.rule; code PYTHON[0]; queenTrace; #ch2,#lab,#codelab | covered | Python đảo sang h giảm, dừng best≥current; engine chọn best và random tie. |
| Lecture04 p12 | Không nhìn xa, không cây, tính tham lam địa phương | VI ch2.rule/distinction; #ch2 | covered | Giải thích khác biệt với GBFS có frontier. |
| Lecture04 p13 | Complete-state formulation, một hậu mỗi cột, Nᴺ trạng thái | VI lab.model; QueensLab; #lab | covered | 8⁸=16.777.216; một chữ số là hàng top-down 1-based. |
| Lecture04 p13 | Successor đổi một hậu trong cột; N(N−1), 56 cho N=8 | VI lab.model/help; engine neighbors; #lab | covered | Mỗi ô dời là một cột; số 12/56 tái tính. |
| Lecture04 p13 | h đếm cặp tấn công trực tiếp/gián tiếp; h=0 nghiệm | VI lab.pairs; engine attackingPairs; #lab | covered | Điều kiện cùng hàng/đường chéo, không đếm quân riêng hoặc chặn bởi quân giữa. |
| Lecture04 p13,p15 | 17 triệu trạng thái nhưng trung bình 4 bước thành công, 3 bước thất bại | VI lab.model, ch3.stats/caveat; #lab,#ch3 | covered | Số thực nghiệm được giữ cùng ngữ cảnh, không áp thành kỳ vọng lab. |
| Lecture04 p14 | Bàn 56745676 có h17, 56 ô kết quả, minimum12 và phá hòa | PRESETS[2], QueensLab h-grid, engine; #lab | covered | Độc lập tính toàn bộ 56 ô khớp bảng trong hình, min12; phá hòa seeded random. |
| Lecture04 p15,p16 | Dễ kẹt, bảng 83742516 h1, mọi successor tệ hơn | VI lab.lead/presets; PRESETS[3]; code PYTHON[0]; #lab,#codelab | covered | Tính lại min successor h2; trace dừng, Python trả h1. |
| Lecture04 p15 | 86% kẹt, 14% giải được trong thí nghiệm | VI ch3.stats/caveat; #ch3 | covered | Không nâng tỷ lệ thành bảo đảm phổ quát. |
| Lecture04 p17 | Sideways, giới hạn chống vòng lặp; không chữa cực trị nghiêm ngặt | VI ch3.variants[0], lab.budget; #ch3,#lab | covered | Lab 20 bước ngang liên tiếp có ghi khác giới hạn100 của thí nghiệm. |
| Lecture04 p17 | 100 sideways →94%, 21 bước khi giải/64 bước khi trượt | VI ch3.stats/caveat; #ch3 | covered | Tất cả số giữ đúng vai trò. |
| Lecture04 p18 | Stochastic uphill-only; có thể ưu tiên độ dốc, tradeoff tốc độ/chất lượng | VI ch3.variants[1]; #ch3 | covered | Không nhận bước xấu, không gộp với SA. |
| Lecture04 p18 | First-choice sinh/thử ngẫu nhiên tới cải thiện, hợp branching lớn | VI ch3.variants[2], lab.budget; engine first; #ch3,#lab | covered | Biến thể lab duyệt hoán vị neighbors không lặp, đánh giá dừng sớm. |
| Lecture04 p18,p19 | Random restart, điểm đầu mới, giới hạn theo thời gian/lượt | VI ch3.variants[3]/probability, lab.budget; #ch3,#lab | covered | Runs độc lập, finite budget không chứng minh vô nghiệm. |
| Lecture04 p19 | E=1/p và điều kiện xác suất mỗi lượt | VI ch3.restart/probability; quiz local-restart; #ch3,#quiz | covered-with-correction | 1/p đếm tổng lượt; restart sau lượt đầu là (1−p)/p. p=.14→7.14 lượt/6.14 restart. |
| Lecture04 p20 | Quiz 4-hậu ban đầu cùng hàng, first-choice và h | PRESETS[1], lựa chọn First-choice; #lab | covered | Bàn gốc hàng0 đã đổi hệ tọa độ thành1111 theo quy ước 1-based; thao tác first-choice có thật. |
| Lecture04 p22 | Ý tưởng annealing: thay đổi ngẫu nhiên mạnh khi nóng, giảm khi nguội | VI ch4.lead/body/experiment; AnnealingLab; #ch4 | covered | Xác suất điều chỉnh bằng T, không đồng nhất T với chi phí. |
| Lecture04 p22 | Cẩn trọng bảo đảm completeness/optimum của annealing | VI ch4.guarantee; #ch4 | covered-with-correction | Ghi reachability và lịch đủ chậm trong giới hạn vô hạn; geometric finite không có bảo đảm. |
| Lecture04 p23 | SA pseudocode: random neighbor, Δ, exp, schedule, dừngT0 | VI ch4.body/sign/schedule; code PYTHON[1]; AnnealingLab; #ch4,#codelab | covered | Đổi sang cực tiểu với exp(−ΔC/T), giải thích cả dấu cực đại; theo dõi best/current riêng. |
| Lecture04 p25 | Beam giữ k, sinh tất cả successors, goal test, tuyển top-k pool chung | VI ch5.body; BeamVisual; #ch5 | covered | k2 chọn A9/A8; không ép mỗi parent phải có một survivor. |
| Lecture04 p26 | Chia sẻ thông tin khác k restart độc lập | VI ch5.diversity; BeamVisual mode1; #ch5 | covered | Tab độc lập chọn A9/B6, tab pool chọn A9/A8. |
| Lecture04 p26 | Mất đa dạng, tốn tiền như hill-climbing | VI ch5.diversity; #ch5 | covered | Nêu các nhánh có thể dồn vào cùng vùng. |
| Lecture04 p26 | Stochastic beam ưu tiên theo value | VI ch5.stochastic; #ch5 | covered | Thêm quy tắc đổi cost thành trọng số, không gán cost lớn xác suất lớn. |
| Lecture04 p28 | GA khác stochastic beam nhờ hai parent, recombination | VI ch6.lead/body; #ch6 | covered | Không biến phép lai thành bảo đảm con tốt. |
| Lecture04 p29,p30,p32 | Quần thể 8-hậu 4 cá thể, fitness24/23/20/11, roulette | VI ch6.fitness; #ch6 | covered | Toàn bộ bốn chuỗi và tỷ số có thật; độc lập tính khớp. |
| Lecture04 p29,p35 | Crossover hai parent, cắt gene3, hai con đối ứng | VI ch6.crossover; GeneticLab; #ch6 | covered | 32748552 và24752411 đúng. Hình nguồn còn một cặp dưới lặp cùng cơ chế, không chép toàn bộ một lượt GA cố định. |
| Lecture04 p29,p36 | Mutation tạo biến đổi từng vị trí, có thể nhiều hoặc không gene | VI ch6.mutation; GeneticLab; code PYTHON[2]; #ch6,#codelab | covered | Lab cho chọn gene cụ thể; code xác suất độc lập0.05, nguồn per-individual được phân biệt. |
| Lecture04 p30 | Fitness số cặp không tấn công, min0 max28; simulated evolution | VI ch6.body/fitness; GeneticLab; #ch6 | covered | fit=N(N−1)/2−h; ba chặng selection/crossover/mutation được giải thích. |
| Lecture04 p31 | Chuỗi hữu hạn, nhị phân hoặc 8 chữ số; 24bit | VI ch6.encoding; #ch6 | covered | Mapping1…8↔000…111 chính xác; ảnh binary toy lặp cơ chế đã dạy, không nhầm 12bit ảnh với 24bit bài8-hậu. |
| Lecture04 p32,p33 | Roulette theo tỷ lệ fitness, cá thể có thể nhiều lần/không lần | VI ch6.body/roulette; GeneticLab probabilities; #ch6 | covered | Bands theo xác suất4-hậu; có fallback all-zero. Tỷ lệ ngẫu nhiên không hứa tần suất chính xác. |
| Lecture04 p34; Homework4 p2 Q3 | Fit/probability2341,2132,1232,4321 | GeneticLab; VI genetic.answer/hw.cards[2]; #ch6,#hw | covered | Tính lại fit2,3,1,0; probability1/3,1/2,1/6,0. |
| Lecture04 p35,p39 | Crossover có thể nhảy xa; endpointcut chỉ copy parent | VI ch6.crossover; engine crossover; code; #ch6,#codelab | covered | Code chọn cut bên trong1…n−1; chú thích rõ khác endpoint nguồn. |
| Lecture04 p37 | Workflow fitness→stop?→select→cross→mutate→replace | VI ch6.body; code PYTHON[2]; #ch6,#codelab | covered | Không cần animation riêng để workflow được hiện đầy đủ và chạy đúng. |
| Lecture04 p38 | GA pseudocode full generation, stochastic selection, stop enough/time, returnbest | code PYTHON[2]; VI code.notes[2]; #codelab | covered-with-correction | 200 generations, giữ best-ever ngoài quần thể; đã nói rõ không elitism và phân phối mutation khác pseudocode. |
| Lecture04 p40 | Khám phá vùng khác nhờ lai, bài khó, ít domain knowledge | VI ch6.conclusion; #ch6 | covered | Không khẳng định mọi crossover hoặc mọi GA tốt hơn local search. |
| Lecture04 p41 | Tuning/transfer-performance/representation; không có thứ hạng chung | VI ch6.caveat/conclusion, code.task; #ch6,#codelab | covered-with-correction | Chuyển nhận xét thực nghiệm cũ thành yêu cầu benchmark cùng ngân sách, không khẳng định tình trạng nghiên cứu hiện tại chưa có bằng chứng. |
| Lecture04 p41 | Genetic programming là ứng dụng mở rộng | VI ch6.caveat; #ch6 | covered | Nêu tiến hóa cấu trúc chương trình, vừa đủ độ sâu nguồn chỉ nêu tên. |
| Homework4 p1 Q1a,b | N4 trạng thái và moveset | VI hw.cards[0].hint, lab.model; #hw,#lab | covered | 4⁴=256;4×3=12. |
| Homework4 p1 Q1c | Board S1214 và h(S) | VI hw.cards[0]; PRESETS[0]; #hw,#lab | covered | Hình nguồn top-down khớp1214; liệt kê đúng5 cặp. |
| Homework4 p1 Q1d | Đường hợp lệ tới nghiệm, h mỗi node | VI hw.cards[0].hint; #hw | covered | 1214(5)→2214(3)→2414(1)→2413(0); mỗi lần đổi1cột, không gán nhầm thành steepest. |
| Homework4 p2 Q2 | State space tô3màu toàn bộ graph, số lượng | VI hw.cards[1], hw.graphNote; ColoringGraph; #hw | covered-with-correction | Đồ thị A–H thực có8 đỉnh;3⁸=6561, không3⁷. |
| Homework4 p2 Q2 | Topology, coloring ban đầu, neighborhood, solution/path | ColoringGraph constants; VI hw.graphNote/hw.cards[1].hint; #hw | covered | Đủ11cạnh, đúngcolor;16neighbors;C→red rồiH→yellow cho h2→1→0. |

Có **53 unit nội dung** trong bảng: 45 `covered`, 8 `covered-with-correction`; không có `missing`, `thin` hoặc `unverifiable` trong phạm vi nội dung/cơ chế đã định. Đây là số unit, không phải phần trăm phủ trang.

Trang hành chính được kiểm và loại khỏi mẫu số: p1 bìa; p2 outline (mọi mục trong outline đã có); p3,p10,p21,p24,p27 divider có hình minh họa lặp cơ chế, được đối chiếu với các unit phía sau; p42 kết. Không có trang nguồn nào chưa được xem. Hai dòng bối cảnh không dùng làm mệnh đề giảng bắt buộc: p15 “NP-hard thường có số local maxima mũ” (không biến nhận xét thành định lý về mọi bài NP-hard); p40 liên hệ vẻ hấp dẫn với tiến hóa sinh học (GA đã được giới thiệu qua tiến hóa mô phỏng).

Giới hạn rõ ràng: ledger ghi coverage bằng nội dung và code hiện có, không khẳng định browser đã hiện tốt ở mọi viewport. Đề xuất nêu thêm phạm vi continuous space là cải thiện nhỏ, không yêu cầu thêm chương đạo hàm hay thuật toán ngoài outline.
