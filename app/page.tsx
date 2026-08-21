"use client";

import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";

type Option = { label: string; score: number };
type Question = { id: number; section: number; title: string; options: Option[] };

const ZALO_HAI_ANH = "https://zalo.me/0393835398";
const ZALO_MINH_HAI = "https://zalo.me/0971025264";

function normalizeVnd(value: string) {
  return value.replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, 15);
}

function formatVnd(value: string) {
  if (!value) return "";
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(Number(value));
}

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



function averageScore(answers: Record<number, number>, ids: number[]) {
  return Math.round((ids.reduce((sum, id) => sum + (answers[id] || 0), 0) / (ids.length * 3)) * 100);
}

export default function Home() {
  const assessmentRef = useRef<HTMLElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [profile, setProfile] = useState({ name: "", phone: "", capital: "", experience: "", assistant: "", consent: false, website: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "sent" | "error">("idle");

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

  const updateProfile = <K extends keyof typeof profile>(key: K, value: (typeof profile)[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const submitLead = async () => {
    const answerLabels = questions.map((question) => {
      const score = answers[question.id];
      const option = question.options.find((item) => item.score === score);
      return `${score} · ${option?.label ?? ""}`;
    });

    const payload = {
      name: profile.name,
      phone: profile.phone,
      capital: Number(profile.capital),
      capitalVnd: Number(profile.capital),
      capitalFormatted: `${formatVnd(profile.capital)} VND`,
      experience: profile.experience,
      assistant: profile.assistant,
      totalScore,
      riskProfile: result.name,
      capacity: dimensions[0][1],
      tolerance: dimensions[1][1],
      autonomy: dimensions[2][1],
      answers: answerLabels,
      source: window.location.href,
      website: profile.website,
    };

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await response.json().catch(() => ({ ok: false, error: "Phản hồi không hợp lệ từ máy chủ." }));
    if (!response.ok || !body.ok) throw new Error(body.error || "Không thể lưu dữ liệu vào Google Sheet.");
  };

  const nextStage = async () => {
    if (stage === 0) {
      if (!profile.name.trim()) {
        setError("Vui lòng nhập họ và tên để cá nhân hóa kết quả.");
        return;
      }
      if (!/^(0|\+84)[0-9 .]{8,12}$/.test(profile.phone.trim())) {
        setError("Số điện thoại chưa hợp lệ. Ví dụ: 0912 345 678.");
        return;
      }
      if (!profile.capital || Number(profile.capital) <= 0) {
        setError("Vui lòng nhập quy mô vốn bằng VND.");
        return;
      }
      if (!profile.assistant) {
        setError("Vui lòng chọn trợ lý HTG sẽ hỗ trợ bạn.");
        return;
      }
      if (!profile.consent) {
        setError("Vui lòng đồng ý lưu thông tin để HTG gửi và hỗ trợ kết quả.");
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

    if (stage === 3) {
      setSubmitting(true);
      try {
        await submitLead();
        setSubmitState("sent");
      } catch {
        setSubmitState("error");
      } finally {
        setSubmitting(false);
      }
    }

    setStage((current) => Math.min(4, current + 1));
    window.setTimeout(() => assessmentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const restart = () => {
    setAnswers({});
    setStage(0);
    setError("");
    setSubmitState("idle");
    scrollToAssessment();
  };

  const saveResultAsImage = async () => {
    if (!resultRef.current || savingImage) return;

    setSavingImage(true);
    setError("");
    try {
      await document.fonts.ready;
      const dataUrl = await toPng(resultRef.current, {
        backgroundColor: "#ffffff",
        cacheBust: true,
        pixelRatio: 2,
        filter: (node) => !(node instanceof HTMLElement && node.classList.contains("result-footer")),
      });
      const safeName = profile.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase() || "nha-dau-tu";
      const download = document.createElement("a");
      download.download = `ho-so-rui-ro-${safeName}.png`;
      download.href = dataUrl;
      download.click();
    } catch {
      setError("Không thể tạo ảnh kết quả. Vui lòng thử lại sau vài giây.");
    } finally {
      setSavingImage(false);
    }
  };

  return (
    <main>
      <nav className="nav-shell" aria-label="Điều hướng chính">
        <span className="nav-menu-mark" aria-hidden="true"><i /><i /></span>
        <a className="brand" href="#top" aria-label="Tài Trần HTG về đầu trang"><strong>TAI TRAN</strong><small>HTG</small></a>
        <button className="nav-cta" type="button" onClick={scrollToAssessment}>Bắt đầu chẩn đoán</button>
      </nav>

      

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
              <div className="field-grid">
                <label><span>Họ và tên *</span><input value={profile.name} onChange={(event) => updateProfile("name", event.target.value)} placeholder="Nguyễn Văn A" autoComplete="name" /></label>
                <label><span>Số điện thoại / Zalo *</span><input value={profile.phone} onChange={(event) => updateProfile("phone", event.target.value)} placeholder="0912 345 678" inputMode="tel" autoComplete="tel" /></label>
                <label>
                  <span>Quy mô vốn (VND) *</span>
                  <span className="currency-input">
                    <input
                      value={formatVnd(profile.capital)}
                      onChange={(event) => updateProfile("capital", normalizeVnd(event.target.value))}
                      placeholder="Ví dụ: 500.000.000"
                      inputMode="numeric"
                      autoComplete="off"
                      aria-label="Quy mô vốn bằng VND"
                    />
                    <b>VND</b>
                  </span>
                </label>
                <label><span>Kinh nghiệm đầu tư</span><select value={profile.experience} onChange={(event) => updateProfile("experience", event.target.value)}><option value="">Chọn kinh nghiệm</option><option>Dưới 1 năm</option><option>1 – 3 năm</option><option>3 – 5 năm</option><option>Trên 5 năm</option></select></label>
                <label><span>Trợ lý hỗ trợ *</span><select value={profile.assistant} onChange={(event) => updateProfile("assistant", event.target.value)}><option value="">Chọn trợ lý HTG</option><option value="Hải Anh">Hải Anh</option><option value="Minh Hải">Minh Hải</option></select></label>
                <label className="honeypot" aria-hidden="true"><span>Website</span><input value={profile.website} onChange={(event) => updateProfile("website", event.target.value)} tabIndex={-1} autoComplete="off" /></label>
                <label className="consent-row"><input type="checkbox" checked={profile.consent} onChange={(event) => updateProfile("consent", event.target.checked)} /><span>Tôi đồng ý để HTG lưu thông tin và kết quả đánh giá nhằm hỗ trợ tư vấn qua Zalo. HTG không sử dụng dữ liệu để cam kết lợi nhuận hoặc thực hiện giao dịch thay khách hàng.</span></label>
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
            <div className="result-step" ref={resultRef}>
              {submitState === "sent" && <p className="submit-notice success">Hồ sơ đã được chuyển tới hệ thống HTG. Đội ngũ trợ lý sẽ hỗ trợ bạn qua Zalo khi cần.</p>}
              {submitState === "error" && <p className="submit-notice error">Kết quả đã được tạo nhưng chưa thể lưu thông tin. Bạn có thể gửi trực tiếp cho Hải Anh hoặc Minh Hải qua Zalo.</p>}
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
              <div className="result-cta"><div><strong>Muốn chẩn đoán trực tiếp danh mục đang nắm giữ?</strong><p>Gửi ảnh danh mục để đội ngũ trợ lý kết nối bạn với HTG.</p></div><div className="contact-buttons"><a className="primary-button lime-button" href={ZALO_HAI_ANH} target="_blank" rel="noreferrer">Zalo Hải Anh <span aria-hidden="true">↗</span></a><a className="primary-button lime-button secondary-zalo" href={ZALO_MINH_HAI} target="_blank" rel="noreferrer">Zalo Minh Hải <span aria-hidden="true">↗</span></a></div></div>
              <div className="result-footer"><button type="button" onClick={restart}>↻ Làm lại bài đánh giá</button><button type="button" onClick={saveResultAsImage} disabled={savingImage}>{savingImage ? "Đang tạo ảnh…" : "⇩ Tải ảnh kết quả"}</button></div>
              <p className="disclaimer">Kết quả dựa trên câu trả lời tự khai và chỉ mang tính tham khảo, không phải khuyến nghị mua/bán hay cam kết lợi nhuận.</p>
            </div>
          )}

          {error && <p className="form-error" role="alert">{error}</p>}
          {stage < 4 && (
            <div className="form-navigation">
              <button className="back-button" type="button" onClick={() => { setError(""); setStage((current) => Math.max(0, current - 1)); }} disabled={stage === 0}>← Quay lại</button>
              <button className="primary-button" type="button" onClick={nextStage} disabled={submitting}>{submitting ? "Đang lưu hồ sơ..." : stage === 3 ? "Xem hồ sơ rủi ro" : "Tiếp tục"}<span aria-hidden="true">→</span></button>
            </div>
          )}
        </div>
      </section>

      <section className="expert-section" id="chuyen-gia" aria-labelledby="expert-name">
        <div className="expert-photo"><img src="/nguyen-duc-tai-working-transparent.png" alt="Tài Trần trong không gian làm việc" width="5000" height="3213" loading="lazy" decoding="async" /></div>
        <div className="expert-copy"><p className="eyebrow light"><span /> Đồng hành cùng chuyên gia</p><h2 id="expert-name">Tài Trần</h2><p className="expert-role">Nhà sáng lập HTG Investments</p><blockquote>“Rủi ro không nằm ở biến động giá. Rủi ro lớn nhất là sở hữu một danh mục không phù hợp với mục tiêu và khả năng chịu đựng của chính mình.”</blockquote><div className="expert-stats"><span><b>8+</b>Năm kinh nghiệm</span><span><b>3.000+</b>Nhà đầu tư đồng hành</span><span><b>24h</b>Thời gian phản hồi</span></div><div className="expert-links"><a className="text-link" href={ZALO_HAI_ANH} target="_blank" rel="noreferrer">Trợ lý Hải Anh <span>↗</span></a><a className="text-link" href={ZALO_MINH_HAI} target="_blank" rel="noreferrer">Trợ lý Minh Hải <span>↗</span></a></div></div>
      </section>

      <footer>
        <div className="footer-brand"><div><strong>TAI TRAN <span>HTG</span></strong><p>Hiểu đúng rủi ro. Đầu tư đúng cách.</p></div></div>
        <div className="footer-contact"><p>Kết nối trực tiếp</p><a href={ZALO_HAI_ANH} target="_blank" rel="noreferrer">Hải Anh · Zalo ↗</a><a href={ZALO_MINH_HAI} target="_blank" rel="noreferrer">Minh Hải · Zalo ↗</a></div>
        <p className="footer-legal"><b>Miễn trừ trách nhiệm:</b> Nội dung trên website chỉ mang tính tham khảo và giáo dục, không cấu thành khuyến nghị mua/bán chứng khoán. Nhà đầu tư tự chịu trách nhiệm với quyết định của mình.</p>
      </footer>
    </main>
  );
}
