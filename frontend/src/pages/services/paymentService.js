import api from "./api.js";

export const createPayment = async (tuitionId) => {
  if (!tuitionId) {
    throw new Error("Thiếu mã học phí (tuition_id).");
  }

  const response = await api.post("/payments", {
    tuition_id: tuitionId,
  });

  return response.data;
};

export const confirmPayment = async (paymentId, otp) => {
  if (!paymentId) {
    throw new Error("Không tìm thấy mã thanh toán.");
  }

  if (!otp || !String(otp).trim()) {
    throw new Error("Vui lòng nhập mã OTP.");
  }

  const response = await api.post("/payments/confirm", {
    payment_id: paymentId,
    otp: String(otp).trim(),
  });

  return response.data;
};
