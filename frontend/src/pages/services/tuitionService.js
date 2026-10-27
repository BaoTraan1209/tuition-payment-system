
import api from "./api.js";

// Lấy danh sách học phí theo MSSV
export const getTuitionsByMssv = async (mssv) => {
  if (!mssv || !String(mssv).trim()) {
    throw new Error("Vui lòng cung cấp mã số sinh viên.");
  }

  const response = await api.get(
    `/tuitions/${encodeURIComponent(String(mssv).trim())}`
  );

  return response.data;
};

// Lấy trạng thái học phí
export const getTuitionStatus = async (mssv) => {
  if (!mssv || !String(mssv).trim()) {
    throw new Error("Vui lòng cung cấp mã số sinh viên.");
  }

  const response = await api.get(
    `/tuitions/${encodeURIComponent(String(mssv).trim())}/status`
  );

  return response.data;
};

// Định dạng tiền Việt Nam
export const formatVnd = (value) =>
  `${Number(value || 0).toLocaleString("vi-VN")} ₫`;

// Chuyển trạng thái sang tiếng Việt
export const formatTuitionStatus = (status) => {
  const statuses = {
    UNPAID: "Chưa thanh toán",
    PAID: "Đã thanh toán",
    PENDING: "Đang chờ xử lý",
    PROCESSING: "Đang xử lý",
    SUCCESS: "Thành công",
    FAILED: "Thất bại",
  };

  return statuses[String(status || "").toUpperCase()]
    || status
    || "Chưa xác định";
};
