// Tuition Service API via Vite development proxy. No internal API keys in browser.
const BASE = "/api/tuition";

async function read(path, signal) {
  const response = await fetch(`${BASE}${path}`, { signal });
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Không tải được dữ liệu học phí (HTTP ${response.status}).`);
  }
  return response.json();
}

export const getTuitionByMssv = (mssv, signal) =>
  read(`/students/${encodeURIComponent(mssv)}`, signal);

export const getTuitionHistory = (mssv, signal) =>
  read(`/students/${encodeURIComponent(mssv)}/transactions`, signal);

export const formatVnd = (value) =>
  `${Number(value || 0).toLocaleString("vi-VN")} ₫`;

export const formatTuitionStatus = (value) => ({
  PENDING: "Chưa thanh toán", PROCESSING: "Đang xử lý",
  SUCCESS: "Đã thanh toán", FAILED: "Thất bại"
}[value] || value || "Chưa xác định");
