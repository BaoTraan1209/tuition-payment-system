import api from "./api.js";

export const requestOtp = async (paymentId) => {
  if (!paymentId) {
    throw new Error("Không tìm thấy mã thanh toán để gửi OTP.");
  }

  const response = await api.post("/otps/request", {
    payment_id: paymentId,
  });

  return response.data;
};
