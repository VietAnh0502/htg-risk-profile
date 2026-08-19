"use client";

import { useMemo, useRef, useState } from "react";

type Option = { label: string; score: number };
type Question = { id: number; section: number; title: string; options: Option[] };

const questions: Question[] = [
  {
    id: 1,
    section: 1,
    title: "Mức lợi nhuận kỳ vọng mỗi năm với số vốn này?",
    options: [
      { label: "10–15% · Ưu tiên đều đặn và bảo toàn vốn", score: 1 },
      { label: "15–25% · Chấp nhận biến động hợp lý", score: 2 },
      { label: "Trên 25% · Sẵn sàng chịu biến động lớn", score: 3 },
    ],
  },
  {
    id: 2,
    section: 1,
    title: "Trong 1–2 năm tới, bạn có cần rút phần lớn số vốn này?",
    options: [
      { label: "Có · Đã có kế hoạch sử dụng cụ thể", score: 1 },
      { label: "Có thể rút một phần", score: 2 },
      { label: "Không · Đây là vốn đầu tư dài hạn", score: 3 },
    ],
  },
  {
    id: 3,
    section: 1,
    title: "Số vốn đầu tư chiếm bao nhiêu trong tổng tài sản của bạn?",
    options: [
      { label: "Trên 70% tổng tài sản", score: 1 },
      { label: "Từ 30–70% tổng tài sản", score: 2 },
      { label: "Dưới 30% tổng tài sản", score: 3 },
    ],
  },
  {
    id: 4,
    section: 1,
    title: "Mức margin bạn thường sử dụng?",
    options: [
      { label: "Không dùng hoặc dùng rất ít", score: 1 },
      { label: "Dưới 50% sức mua", score: 2 },
      { label: "Sẵn sàng dùng tối đa khi có cơ hội", score: 3 },
    ],
  },
  {
    id: 5,
    section: 2,
    title: "Tài khoản giảm bao nhiêu thì bạn bắt đầu mất ngủ?",
    options: [
      { label: "Khoảng 5–10%", score: 1 },
      { label: "Khoảng 10–20%", score: 2 },
      { label: "Trên 20% tôi vẫn giữ được bình tĩnh", score: 3 },
    ],
  },
  {
    id: 6,
    section: 2,
    title: "Một cổ phiếu vừa mua giảm 6% nhưng chưa vi phạm kế hoạch. Bạn sẽ?",
    options: [
      { label: "Muốn bán ngay để tránh lỗ thêm", score: 1 },
      { label: "Giảm tỷ trọng và đánh giá lại", score: 2 },
      { label: "Giữ nếu luận điểm và điểm cắt lỗ còn hiệu lực", score: 3 },
    ],
  },
  {
    id: 7,
    section: 2,
    title: "Khi thị trường giảm mạnh trong một phiên, phản ứng đầu tiên của bạn?",
    options: [
      { label: "Bán phần lớn để đưa tài khoản về an toàn", score: 1 },
      { label: "Quan sát, hạ một phần vị thế yếu", score: 2 },
      { label: "Giữ kế hoạch và tìm cơ hội giải ngân", score: 3 },
    ],
  },
  {
    id: 8,
    section: 2,
    title: "Mức tỷ trọng tối đa bạn sẵn sàng dành cho một cổ phiếu?",
    options: [
      { label: "Không quá 10% tài khoản", score: 1 },
      { label: "Khoảng 10–20% tài khoản", score: 2 },
      { label: "Trên 20% nếu cơ hội đủ tốt", score: 3 },
    ],
  },
  {
    id: 9,
    section: 3,
    title: "Thời gian nắm giữ một cổ phiếu của bạn thường là?",
    options: [
      { label: "Trên 6 tháng · Theo doanh nghiệp", score: 1 },
      { label: "1–6 tháng · Theo xu hướng trung hạn", score: 2 },
      { label: "Vài phiên đến vài tuần · Theo sóng", score: 3 },
    ],
  },
  {
    id: 10,
    section: 3,
    title: "Tần suất bạn theo dõi thị trường?",
    options: [
      { label: "Cuối ngày hoặc vài ngày một lần", score: 1 },
      { label: "Xem vài lần trong ngày", score: 2 },
      { label: "Theo dõi bảng điện gần như cả phiên", score: 3 },
    ],
  },
  {
    id: 11,
    section: 3,
    title: "Khi nhận khuyến nghị, bạn mong muốn điều gì nhất?",
    options: [
      { label: "Điểm mua/bán cụ thể để làm theo", score: 1 },
      { label: "Trao đổi hai chiều trước khi vào lệnh", score: 2 },
      { label: "Phân tích luận điểm để tự quyết định", score: 3 },
    ],
  },
  {
    id: 12,
    section: 3,
    title: "Số mã tối đa bạn muốn nắm giữ cùng lúc?",
    options: [
      { label: "Trên 6 mã · Ưu tiên phân tán", score: 1 },
      { label: "4–6 mã · Cân bằng quản trị", score: 2 },
      { label: "1–3 mã · Danh mục tập trung", score: 3 },
    ],
  },
];

const sectionMeta = [
  { number: "01", label: "Năng lực chịu rủi ro", detail: "Mục tiêu, nguồn vốn và khả năng sử dụng margin." },
  { number: "02", label: "Tâm lý khi biến động", detail: "Phản ứng thực tế trước thua lỗ và biến động mạnh." },
  { number: "03", label: "Phong cách giao dịch", detail: "Kỳ nắm giữ, mức tập trung và cách ra quyết định." },
];

const painPoints = [
  ["01", "Mua xong là giảm", "Không có ngưỡng rủi ro và kế hoạch xử lý rõ ràng."],
  ["02", "Danh mục quá tập trung", "Một vài mã quyết định toàn bộ hiệu suất tài khoản."],
  ["03", "Không biết giữ hay bán", "Quyết định theo cảm xúc khi thị trường biến động."],
  ["04", "Mục tiêu không khớp", "Kỳ vọng lợi nhuận cao hơn mức rủi ro có thể chịu."],
];

function averageScore(answers: Record<number, number>, ids: number[]) {
  return Math.round((ids.reduce((sum, id) => sum + (answers[id] || 0), 0) / (ids.length * 3)) * 100);
}

export default function Home() {
  const assessmentRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [profile, setProfile] = useState({ name: "", phone: "", capital: "", experience: "" });
  const [error, setError] = useState("");

  const currentQuestions = questions.filter((question) => question.section === stage);
  const totalScore = useMemo(
    () => Object.values(answers).reduce((sum, value) => sum + value, 0),
    [answers],
  );

  const result = useMemo(() => {
    if (totalScore <= 19) {
      return {
        key: "conservative",
        name: "Nhà đầu tư thận trọng",
        short: "Thận trọng",
        summary: "Bạn ưu tiên bảo toàn vốn, tính ổn định và sự rõ ràng hơn tốc độ tăng trưởng. Danh mục phù hợp nên có biên an toàn cao, tỷ trọng vừa phải và kỷ luật cắt lỗ chặt chẽ.",
        allocation: [["Tiền mặt", 20], ["Cổ phiếu nền tảng", 55], ["Cổ phiếu tăng trưởng", 25]],
        actions: ["Giữ tỷ lệ tiền mặt 15–25% để giảm áp lực tâm lý.", "Ưu tiên doanh nghiệp đầu ngành, thanh khoản tốt.", "Hạn chế margin và vị thế đơn lẻ trên 15% NAV."],
      };
    }
    if (totalScore <= 28) {
      return {
        key: "balanced",
        name: "Nhà đầu tư cân bằng",
        short: "Cân bằng",
        summary: "Bạn chấp nhận biến động có kiểm soát để tìm kiếm tăng trưởng tốt hơn. Chiến lược phù hợp là kết hợp vị thế nền tảng với cơ hội theo xu hướng, luôn có điểm mua và điểm thoát rõ ràng.",
        allocation: [["Tiền mặt", 10], ["Cổ phiếu nền tảng", 55], ["Cổ phiếu tăng trưởng", 35]],
        actions: ["Duy trì 4–6 cổ phiếu để vừa tập trung vừa phân tán.", "Chốt một phần khi vị thế tăng nóng khỏi kế hoạch.", "Chỉ dùng margin khi xu hướng thị trường được xác nhận."],
      };
    }
    return {
      key: "growth",
      name: "Nhà đầu tư tăng trưởng",
      short: "Tăng trưởng",
      summary: "Bạn có khả năng chịu biến động cao và chủ động tìm kiếm cơ hội tăng trưởng. Lợi thế này chỉ bền vững khi đi cùng giới hạn vị thế, kỷ luật cắt lỗ và quản trị margin nghiêm ngặt.",
      allocation: [["Tiền mặt", 5], ["Cổ phiếu nền tảng", 40], ["Cổ phiếu tăng trưởng", 55]],
      actions: ["Đặt rủi ro tối đa cho từng giao dịch trước khi mua.", "Không để một cổ phiếu chi phối toàn bộ danh mục.", "Giảm margin ngay khi xu hướng thị trường suy yếu."],
    };
  }, [totalScore]);

  const dimensions = [
    ["Năng lực chịu rủi ro", averageScore(answers, [1, 2, 3, 4])],
    ["Sức chịu biến động", averageScore(answers, [5, 6, 7, 8])],
    ["Mức độ chủ động", averageScore(answers, [9, 10, 11, 12])],
  ] as const;

  const scrollToAssessment = () => {
    assessmentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updateProfile = (key: keyof typeof profile, value: string) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const nextStage = () => {
    if (stage === 0) {
      if (!profile.name.trim()) {
        setError("Vui lòng nhập họ và tên để cá nhân hóa kết quả.");
        return;
      }
      if (!/^(0|\+84)[0-9 .]{8,12}$/.test(profile.phone.trim())) {
        setError("Số điện thoại chưa hợp lệ. Ví dụ: 0912 345 678.");
        return;
      }
    } else {
      const missing = currentQuestions.some((question) => !answers[question.id]);
      if (missing) {
        setError("Vui lòng chọn một đáp án cho tất cả câu hỏi trong phần này.");
        return;
      }
    }
    setError("");
    setStage((current) => Math.min(4, current + 1));
    window.setTimeout(() => assessmentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const restart = () => {
    setAnswers({});
    setStage(0);
    setError("");
    scrollToAssessment();
  };

  return (
    <main>
      <nav className="nav-shell" aria-label="Điều hướng chính">
        <a className="brand" href="#top" aria-label="HTG Investment về đầu trang">
          <span className="brand-mark">HTG</span>
          <span><strong>HTG INVESTMENT</strong><small>Tài Trần · Risk Profile</small></span>
        </a>
        <div className="nav-links">
          <a href="#phuong-phap">Phương pháp</a>
          <a href="#chuyen-gia">Chuyên gia</a>
          <button className="nav-cta" type="button" onClick={scrollToAssessment}>Bắt đầu chẩn đoán</button>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Hồ sơ rủi ro đầu tư · Miễn phí</p>
          <h1>Hiểu đúng rủi ro.<br /><em>Đầu tư đúng cách.</em></h1>
          <p className="hero-lead">5 phút để nhận diện khẩu vị rủi ro, hành vi giao dịch và cấu trúc danh mục phù hợp với chính bạn.</p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={scrollToAssessment}>Chẩn đoán rủi ro ngay <span aria-hidden="true">↗</span></button>
            <span className="trust-note"><b>1–1</b> Chuyên gia HTG phản hồi riêng</span>
          </div>
          <div className="trust-row" aria-label="Cam kết dịch vụ">
            <span>✓ Bảo mật thông tin</span><span>✓ Kết quả cá nhân hóa</span><span>✓ Không cam kết lợi nhuận</span>
          </div>
        </div>

        <aside className="diagnostic-card" aria-label="Thông tin bài chẩn đoán">
          <div className="card-topline"><span>HTG / RISK PROFILE</span><b>01</b></div>
          <div className="gauge" aria-hidden="true">
            <div className="gauge-ring"><span>?</span></div>
            <p>KHẨU VỊ<br />RỦI RO CỦA BẠN</p>
          </div>
          <div className="card-grid">
            <div><strong>12</strong><span>Câu hỏi</span></div><div><strong>05&apos;</strong><span>Thời gian</span></div><div><strong>24h</strong><span>Phản hồi</span></div>
          </div>
          <p className="card-caption">Bản đánh giá được thiết kế cho nhà đầu tư cá nhân tại thị trường Việt Nam.</p>
        </aside>
      </section>

      <section className="problem-section" aria-labelledby="problems-title">
        <div className="section-heading split-heading">
          <div><p className="eyebrow"><span /> Nhận diện vấn đề</p><h2 id="problems-title">Rủi ro thường đến trước khi bạn kịp gọi tên.</h2></div>
          <p>Một danh mục tốt không chỉ nằm ở mã cổ phiếu — mà còn ở mức rủi ro phù hợp với mục tiêu, nguồn vốn và tâm lý của người nắm giữ.</p>
        </div>
        <div className="problem-grid">
          {painPoints.map(([number, title, copy]) => (
            <article className="problem-card" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
      </section>

      <section className="assessment-section" id="assessment" ref={assessmentRef} aria-labelledby="assessment-title">
        <div className="assessment-intro">
          <p className="eyebrow light"><span /> Chẩn đoán cùng HTG</p>
          <h2 id="assessment-title">Hồ sơ rủi ro của bạn</h2>
          <p>Hãy trả lời theo phản ứng thực tế. Không có đáp án đúng hay sai — chỉ có lựa chọn phù hợp với bạn.</p>
          <div className="assessment-facts"><span><b>12</b> câu hỏi</span><span><b>05</b> phút</span><span><b>03</b> nhóm chỉ số</span></div>
        </div>

        <div className="assessment-panel">
          {stage < 4 && (
            <div className="progress-wrap">
              <div className="progress-meta"><span>{stage === 0 ? "Thông tin nền" : `Phần ${stage} / 3`}</span><strong>{stage === 0 ? 0 : Math.round((stage / 3) * 100)}%</strong></div>
              <div className="progress-track"><span style={{ width: `${stage === 0 ? 4 : (stage / 3) * 100}%` }} /></div>
            </div>
          )}

          {stage === 0 && (
            <div className="profile-step">
              <p className="step-kicker">Bước chuẩn bị</p>
              <h3>Cho HTG biết một chút về bạn</h3>
              <p className="step-description">Thông tin giúp cá nhân hóa kết quả. Website không tự động gửi dữ liệu này đến bên thứ ba.</p>
              <div className="field-grid">
                <label><span>Họ và tên *</span><input value={profile.name} onChange={(event) => updateProfile("name", event.target.value)} placeholder="Nguyễn Văn A" autoComplete="name" /></label>
                <label><span>Số điện thoại / Zalo *</span><input value={profile.phone} onChange={(event) => updateProfile("phone", event.target.value)} placeholder="0912 345 678" inputMode="tel" autoComplete="tel" /></label>
                <label><span>Quy mô vốn</span><select value={profile.capital} onChange={(event) => updateProfile("capital", event.target.value)}><option value="">Chọn khoảng vốn</option><option>Dưới 300 triệu</option><option>300 triệu – 1 tỷ</option><option>1 – 3 tỷ</option><option>Trên 3 tỷ</option></select></label>
                <label><span>Kinh nghiệm đầu tư</span><select value={profile.experience} onChange={(event) => updateProfile("experience", event.target.value)}><option value="">Chọn kinh nghiệm</option><option>Dưới 1 năm</option><option>1 – 3 năm</option><option>3 – 5 năm</option><option>Trên 5 năm</option></select></label>
              </div>
            </div>
          )}

          {stage > 0 && stage < 4 && (
            <div className="questions-step">
              <div className="step-heading"><span>{sectionMeta[stage - 1].number}</span><div><p className="step-kicker">{sectionMeta[stage - 1].label}</p><h3>{sectionMeta[stage - 1].detail}</h3></div></div>
              <div className="questions-list">
                {currentQuestions.map((question) => (
                  <fieldset className="question-card" key={question.id}>
                    <legend><span>{String(question.id).padStart(2, "0")}</span>{question.title}</legend>
                    <div className="option-list">
                      {question.options.map((option) => {
                        const selected = answers[question.id] === option.score;
                        return (
                          <label className={`option-row ${selected ? "selected" : ""}`} key={option.label}>
                            <input type="radio" name={`question-${question.id}`} checked={selected} onChange={() => { setAnswers((current) => ({ ...current, [question.id]: option.score })); setError(""); }} />
                            <span className="radio-mark" aria-hidden="true" />
                            <span>{option.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            </div>
          )}

          {stage === 4 && (
            <div className="result-step">
              <div className="result-header">
                <div><p className="step-kicker">Hồ sơ của {profile.name.split(" ").slice(-1)[0] || "bạn"}</p><h3>{result.name}</h3><p>{result.summary}</p></div>
                <div className={`result-score ${result.key}`}><span>{totalScore}</span><small>/ 36 điểm</small><b>{result.short}</b></div>
              </div>
              <div className="dimension-grid">
                {dimensions.map(([label, value]) => (
                  <div className="dimension" key={label}><div><span>{label}</span><b>{value}%</b></div><div className="dimension-track"><span style={{ width: `${value}%` }} /></div></div>
                ))}
              </div>
              <div className="result-columns">
                <div className="allocation-card"><p className="result-label">Cấu trúc tham khảo</p><div className="allocation-bar">{result.allocation.map(([label, value], index) => <span className={`segment segment-${index}`} style={{ width: `${value}%` }} key={label} title={`${label}: ${value}%`} />)}</div><ul>{result.allocation.map(([label, value], index) => <li key={label}><i className={`dot dot-${index}`} /><span>{label}</span><b>{value}%</b></li>)}</ul></div>
                <div className="action-card"><p className="result-label">Ba hành động ưu tiên</p><ol>{result.actions.map((action, index) => <li key={action}><span>{index + 1}</span>{action}</li>)}</ol></div>
              </div>
              <div className="result-cta"><div><strong>Muốn chẩn đoán trực tiếp danh mục đang nắm giữ?</strong><p>Gửi ảnh danh mục để Tài Trần và đội ngũ HTG đánh giá 1-1.</p></div><a className="primary-button lime-button" href="https://zalo.me/0393835398" target="_blank" rel="noreferrer">Trao đổi qua Zalo <span aria-hidden="true">↗</span></a></div>
              <div className="result-footer"><button type="button" onClick={restart}>↻ Làm lại bài đánh giá</button><button type="button" onClick={() => window.print()}>⇩ Lưu kết quả</button></div>
              <p className="disclaimer">Kết quả dựa trên câu trả lời tự khai và chỉ mang tính tham khảo, không phải khuyến nghị mua/bán hay cam kết lợi nhuận.</p>
            </div>
          )}

          {error && <p className="form-error" role="alert">{error}</p>}
          {stage < 4 && (
            <div className="form-navigation">
              <button className="back-button" type="button" onClick={() => { setError(""); setStage((current) => Math.max(0, current - 1)); }} disabled={stage === 0}>← Quay lại</button>
              <button className="primary-button" type="button" onClick={nextStage}>{stage === 3 ? "Xem hồ sơ rủi ro" : "Tiếp tục"}<span aria-hidden="true">→</span></button>
            </div>
          )}
        </div>
      </section>

      <section className="method-section" id="phuong-phap" aria-labelledby="method-title">
        <div className="section-heading split-heading"><div><p className="eyebrow"><span /> Phương pháp HTG</p><h2 id="method-title">Không chỉ hỏi bạn “chịu lỗ được bao nhiêu”.</h2></div><p>Khung đánh giá kết hợp cả năng lực tài chính, sức chịu biến động và hành vi ra quyết định — ba yếu tố thường không giống nhau.</p></div>
        <div className="method-grid">
          {sectionMeta.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.label}</h3><p>{item.detail}</p></article>)}
        </div>
      </section>

      <section className="expert-section" id="chuyen-gia" aria-labelledby="expert-name">
        <div className="expert-photo"><img src="https://storage.readdy-site.link/project_files/b229583e-008f-48d2-852b-dca990f7c1d8/d929f86a-5b7c-4eb1-b8f3-b6b012e10dbf_compressed_brokerTaiTran.webp" alt="Tài Trần - chuyên gia HTG Investment" loading="lazy" /></div>
        <div className="expert-copy"><p className="eyebrow light"><span /> Đồng hành cùng chuyên gia</p><h2 id="expert-name">Tài Trần</h2><p className="expert-role">Broker & chuyên gia quản trị danh mục · HTG Investment</p><blockquote>“Rủi ro không nằm ở biến động giá. Rủi ro lớn nhất là sở hữu một danh mục không phù hợp với mục tiêu và khả năng chịu đựng của chính mình.”</blockquote><div className="expert-stats"><span><b>8+</b>Năm kinh nghiệm</span><span><b>3.000+</b>Nhà đầu tư đồng hành</span><span><b>24h</b>Thời gian phản hồi</span></div><a className="text-link" href="https://zalo.me/0393835398" target="_blank" rel="noreferrer">Kết nối với Tài Trần <span>↗</span></a></div>
      </section>

      <footer>
        <div className="footer-brand"><span className="brand-mark">HTG</span><div><strong>HTG INVESTMENT</strong><p>Hiểu đúng rủi ro. Đầu tư đúng cách.</p></div></div>
        <div className="footer-contact"><p>Liên hệ tư vấn</p><a href="tel:0393835398">0393 835 398</a><a href="https://zalo.me/0393835398" target="_blank" rel="noreferrer">Zalo Tài Trần ↗</a></div>
        <p className="footer-legal"><b>Miễn trừ trách nhiệm:</b> Nội dung trên website chỉ mang tính tham khảo và giáo dục, không cấu thành khuyến nghị mua/bán chứng khoán. Nhà đầu tư tự chịu trách nhiệm với quyết định của mình.</p>
      </footer>
    </main>
  );
}
