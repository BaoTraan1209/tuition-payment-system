import api from "./api.js";
/* Lấy danh sách/thông tin học phí theo MSSV. */
export const getTuitionsByMssv = async (mssv) => {
  if (!mssv || !String(mssv).trim()) {
    throw new Error("Vui lòng cung cấp mã số sinh viên.");
  }

  const response = await api.get(
    `/tuitions/${encodeURIComponent(String(mssv).trim())}`
  );

  return response.data;
};
