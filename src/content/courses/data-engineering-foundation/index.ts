import type { Course } from '../../types';
import { curriculum } from './curriculum';

export const dataEngineeringFoundation: Course = {
  slug: 'data-engineering-foundation',
  topicLabels: {"def7.sources": "Nguồn dữ liệu", "def7.cdc": "CDC", "def7.kafka": "Kafka và consumer groups", "def7.delivery": "Độ bền và delivery", "def7.retention": "Retention và Debezium"},
  code: 'DEF',
  title: 'Data Engineering',
  titleAccent: 'Foundation',
  org: 'Sổ tay tự học · DEF',
  weeks: 12,
  roadmapOnly: false,
  hasPartTests: false,
  subtitle: 'Lộ trình đề xuất 12 tuần · 12 buổi · 4 phần · nền tảng đến pipeline dữ liệu',
  description: 'Một tệp dữ liệu chạy được trên máy bạn mới là điểm bắt đầu. Tôi sắp xếp 12 bộ slide AIDE-01 / EDAI–FSDS thành lộ trình đi từ Linux, Python và SQL đến ingestion, storage, batch/stream, consumption và orchestration. Tuần 7 đã có bài Ingestion song ngữ, lab mô phỏng và quiz; các tuần còn lại đang ở dạng khung học.',
  baseline: {
    audience: 'Bạn mới bước vào data engineering hoặc đã viết Python/SQL và muốn hiểu cách các phần nối thành một pipeline. Không cần học khóa AI trước.',
    prerequisites: [
      'Biết dùng thư mục, cài ứng dụng và trình soạn thảo; đã gặp biến, điều kiện và vòng lặp.',
      'Ôn số học, tập hợp, logic Boolean và khoảng thời gian; không cần giải tích hay thống kê nâng cao.',
      'Chuẩn bị tùy chọn trước tuần 1: terminal, thư mục dự án và Git cơ bản. Phiên bản công cụ sẽ được chốt khi viết lab.',
    ],
    outcomes: [
      'Đóng gói tác vụ Python có tham số, dependency riêng và cách xử lý lỗi rõ ràng.',
      'Mô hình hóa bản ghi, truy vấn bằng SQL và giải thích ranh giới API, kiểm thử, container.',
      'Lần theo dữ liệu qua ingestion, storage, batch/stream và mô hình phục vụ phân tích.',
      'Thiết kế workflow có kiểm tra chất lượng, chạy lại và phục hồi khi một bước thất bại.',
    ],
    pace: '12 tuần đề xuất, tổng khoảng 72–96 giờ. Mỗi tuần một buổi; tuần 3, 9, 10 và 12 cần nhiều thời gian hơn. Bạn có thể giãn mỗi tuần thành 2 tuần lịch. Đây là ước lượng tự học, không phải thời lượng từ slide.',
    scope: 'Bản này gồm mục tiêu, điều kiện đầu vào, thứ tự học và mốc thực hành dự kiến. Tuần 7 đã có bài học, lab mô phỏng và quiz. Các tuần khác và bài kiểm tra tổng hợp chưa được tạo. Kubernetes chuyên sâu, vận hành cloud và huấn luyện ML nằm ngoài phần bắt buộc.',
    tools: 'Lộ trình công cụ: Linux/Bash → Python/SQL → API/pytest/Docker → Kafka/Debezium → Spark/Flink → Airflow và data quality. Các công cụ thay thế học ở mức so sánh; không cần dựng tất cả cùng lúc.',
    completion: 'Mục tiêu cuối khóa: thiết kế pipeline đơn hàng/khách hàng với dữ liệu giả lập, đối chiếu đầu ra, chính sách lịch sử, cổng chất lượng và kế hoạch phục hồi. Ưu tiên batch trước; ví dụ streaming là phần mở rộng nhỏ. Đây là brief dự kiến, chưa phải bài tập đã triển khai.',
  },
  ...curriculum('vi'),
};
