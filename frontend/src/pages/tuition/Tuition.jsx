import { useCallback, useEffect, useMemo, useState } from "react";
import { formatTuitionStatus, formatVnd, getTuitionsByMssv } from "../services/tuitionService.js";
import "./Tuition.css";

// Frontend chỉ xem và chọn học phí; mọi việc tạo payment/trừ tiền do Payment Service thực hiện.
export default function Tuition({ user, onSelectTuition, onNavigate }) {
  const mssv = user?.mssv ?? user?.student?.mssv ?? user?.student_code ?? "";
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    setSelectedId(null);
    if (!mssv) {
      setTuitions([]);
      setError("Tài khoản chưa có MSSV. Vui lòng kiểm tra thông tin sinh viên trong /auth/me.");
      return () => { active = false; };
    }

    setLoading(true);
    setError("");
    getTuitionsByMssv(mssv)
      .then((response) => {
        if (!active) return;
        const rows = Array.isArray(response) ? response : response?.data;
        if (!Array.isArray(rows)) throw new Error("API học phí không trả về danh sách hợp lệ.");
        setTuitions(rows);
      })
      .catch((err) => {
        if (!active) return;
        setTuitions([]);
        setError(err?.response?.data?.detail || err?.message || "Không tải được danh sách học phí.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [mssv, reload]);

  const getId = useCallback((item) => item?.tuition_id ?? item?.tuitionId ?? item?.id, []);
  const isUnpaid = (item) => String(item?.status ?? "").toUpperCase() === "UNPAID";

  const selected = useMemo(
    () => tuitions.find((item) => String(getId(item)) === String(selectedId) && isUnpaid(item)),
    [tuitions, selectedId, getId]
  );
  const unpaidTotal = tuitions.reduce((sum, item) => sum + (isUnpaid(item) ? Number(item.amount || 0) : 0), 0);

  function goToPayment() {
    const tuitionId = selected && getId(selected);
    if (!tuitionId || !Number.isFinite(Number(selected.amount)) || Number(selected.amount) <= 0) {
      setError("Vui lòng chọn một khoản học phí chưa thanh toán có mã và số tiền hợp lệ.");
      return;
    }
    if (typeof onSelectTuition !== "function" || typeof onNavigate !== "function") {
      setError("Ứng dụng chưa cấu hình điều hướng thanh toán.");
      return;
    }
    // PaymentConfirm lấy selectedTuition từ App.jsx, không dùng mã học phí giả trong sessionStorage.
    onSelectTuition(selected);
    onNavigate("payment-confirm");
  }

  return (
    <div className="page-content">
      <section className="tuition-banner">
        <div className="banner-content">
          <h1>Thanh toán học phí</h1>
          <h3>Nhanh chóng - An toàn - Tiện lợi</h3>
          <p>Tra cứu và thanh toán học phí trực tuyến</p>
        </div>
        <div className="banner-image" aria-hidden="true">
          <div className="book book-one" />
          <div className="book book-two" />
          <div className="graduation-cap"><i className="bx bxs-graduation" /></div>
          <div className="tuition-paper"><strong>HỌC PHÍ</strong><span /><span /><span /><span /></div>
        </div>
      </section>

      <section className="filter-card">
        <div className="section-title">
          <div className="title-icon"><i className="bx bxs-file-doc" /></div>
          <h2>Thông tin học phí</h2>
        </div>
        <div className="filter-grid">
          <div className="form-group"><label>Mã số sinh viên</label><p>{mssv || "Chưa liên kết"}</p></div>
          <div className="form-group"><label>Họ và tên</label><p>{user?.fullname ?? user?.full_name ?? user?.name ?? "—"}</p></div>
          <button className="search-btn" type="button" onClick={() => setReload((x) => x + 1)} disabled={loading || !mssv}>
            <i className="bx bx-refresh" /> {loading ? "Đang tải..." : "Tải lại học phí"}
          </button>
        </div>
        <p style={{ marginTop: 12, opacity: 0.75 }}>
          Dữ liệu được lấy từ Tuition Service. Chưa lọc theo năm học/học kỳ vì API hiện chưa trả các trường này.
        </p>
      </section>

      <section className="tuition-card">
        <h2>Danh sách khoản thu</h2>
        {error && <p role="alert" style={{ color: "#b42318", padding: 12 }}>{String(error)}</p>}
        {loading && <p role="status" style={{ padding: 12 }}>Đang tải dữ liệu học phí...</p>}
        {!loading && !error && tuitions.length === 0 && <p style={{ padding: 12 }}>Chưa có khoản học phí nào.</p>}
        {!loading && tuitions.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Chọn</th><th>Mã học phí</th><th>Nội dung thu</th><th>Số tiền (VND)</th><th>Trạng thái</th></tr></thead>
              <tbody>
                {tuitions.map((item, index) => {
                  const id = getId(item);
                  const unpaid = isUnpaid(item);
                  return (
                    <tr key={id ?? `tuition-${index}`}>
                      <td>
                        <input
                          type="radio"
                          name="selected-tuition"
                          aria-label={`Chọn khoản học phí ${id ?? index + 1}`}
                          disabled={!unpaid || id == null || !(Number(item.amount) > 0)}
                          checked={selectedId != null && id != null && String(selectedId) === String(id)}
                          onChange={() => setSelectedId(id)}
                        />
                      </td>
                      <td>{id ?? "—"}</td>
                      <td className="fee-name">{item.name ?? item.title ?? item.description ?? `Học phí #${id ?? index + 1}`}</td>
                      <td>{formatVnd(item.amount)}</td>
                      <td><span className={`status ${unpaid ? "unpaid" : "paid"}`}>{formatTuitionStatus(item.status)}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="payment-summary">
          <div className="total-card">
            <div className="total-icon"><i className="bx bx-coin-stack" /></div>
            <div>
              <span>Tổng học phí chưa thanh toán</span>
              <h2>{formatVnd(unpaidTotal)}</h2>
              <small>Khoản đang chọn: {selected ? formatVnd(selected.amount) : "Chưa chọn"}</small>
            </div>
          </div>
          <div className="payment-action">
            <button className="pay-btn" type="button" disabled={loading || !selected} onClick={goToPayment}>
              <span>Tiếp tục thanh toán khoản đã chọn</span>
              <i className="bx bx-chevron-right" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
