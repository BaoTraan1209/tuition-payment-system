
import { useCallback, useEffect, useMemo, useState } from "react";
import { getMyTransactions } from "../services/transactionService.js";
import "./TransactionHistory.css";

const PAGE_SIZE = 5;

const formatMoney = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString("vi-VN");
};

const getErrorMessage = (error) =>
  error.response?.data?.detail ||
  error.message ||
  "Không thể tải lịch sử giao dịch.";

const getList = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.data)) return result.data.data;
  if (Array.isArray(result?.transactions)) return result.transactions;
  if (Array.isArray(result?.items)) return result.items;
  return [];
};

const getStatus = (value) => {
  const status = String(value ?? "PENDING").toUpperCase();
  const labels = {
    SUCCESS: "Thành công",
    PAID: "Đã thanh toán",
    PENDING: "Đang chờ",
    PROCESSING: "Đang xử lý",
    FAILED: "Thất bại",
    CANCELLED: "Đã hủy",
  };

  const cssClass =
    ["SUCCESS", "PAID"].includes(status)
      ? "success"
      : ["FAILED", "CANCELLED"].includes(status)
        ? "failed"
        : "pending";

  return {
    label: labels[status] ?? status,
    cssClass,
  };
};

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getMyTransactions();
      setTransactions(getList(result));
    } catch (err) {
      setTransactions([]);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const status = String(item.status ?? "").toUpperCase();

      const rawDate =
        item.created_at ??
        item.transaction_date ??
        item.paid_at ??
        "";

      const date = String(rawDate).slice(0, 10);

      const matchStatus =
        statusFilter === "ALL" ||
        status === statusFilter;

      const matchFrom = !fromDate || date >= fromDate;
      const matchTo = !toDate || date <= toDate;

      return matchStatus && matchFrom && matchTo;
    });
  }, [transactions, fromDate, toDate, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const pageTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setStatusFilter("ALL");
    setPage(1);
  };

  return (
    <main className="history-page page-content">
      <header className="history-page-header">
        <div>
          <p className="history-eyebrow">IBANKING</p>
          <h1>Lịch sử giao dịch</h1>
          <p className="history-subtitle">
            Theo dõi các giao dịch học phí đã thực hiện.
          </p>
        </div>

        <button
          className="history-refresh-btn"
          type="button"
          onClick={loadTransactions}
          disabled={loading}
        >
          <i className={`bx bx-refresh ${loading ? "history-spin" : ""}`} />
          {loading ? " Đang tải" : " Làm mới"}
        </button>
      </header>

      <section className="history-summary-card">
        <div className="history-summary-icon">
          <i className="bx bx-transfer-alt" />
        </div>
        <div>
          <span>Tổng số giao dịch</span>
          <strong>{loading ? "—" : transactions.length}</strong>
        </div>
        <p>Dữ liệu từ hệ thống iBanking</p>
      </section>

      <section className="history-table-card" style={{ marginBottom: 20 }}>
        <div className="history-table-heading">
          <h2>Lọc giao dịch</h2>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "end",
            padding: 16,
          }}
        >
          <label>
            Từ ngày
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
            />
          </label>

          <label>
            Đến ngày
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
            />
          </label>

          <label>
            Trạng thái
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">Tất cả</option>
              <option value="SUCCESS">Thành công</option>
              <option value="PENDING">Đang chờ</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="FAILED">Thất bại</option>
            </select>
          </label>

          <button type="button" onClick={resetFilters}>
            Xóa bộ lọc
          </button>
        </div>
      </section>

      {error && (
        <div className="history-alert" role="alert">
          <i className="bx bx-error-circle" />
          <span>{String(error)}</span>
          <button type="button" onClick={loadTransactions}>
            Thử lại
          </button>
        </div>
      )}

      <section className="history-table-card">
        <div className="history-table-heading">
          <div>
            <h2>Danh sách giao dịch</h2>
            <p>Thông tin các giao dịch của tài khoản</p>
          </div>
          <span className="history-table-count">
            {filteredTransactions.length} giao dịch
          </span>
        </div>

        <div className="history-table-scroll">
          <table className="history-table">
            <thead>
              <tr>
                <th>Mã giao dịch</th>
                <th>Mã học phí</th>
                <th>Nội dung</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="history-empty-cell" colSpan={6}>
                    Đang tải dữ liệu giao dịch...
                  </td>
                </tr>
              ) : pageTransactions.length === 0 ? (
                <tr>
                  <td className="history-empty-cell" colSpan={6}>
                    Không có giao dịch phù hợp.
                  </td>
                </tr>
              ) : (
                pageTransactions.map((item, index) => {
                  const status = getStatus(item.status);

                  return (
                    <tr
                      key={
                        item.transaction_id ??
                        item.id ??
                        item.payment_id ??
                        `${currentPage}-${index}`
                      }
                    >
                      <td className="history-id-cell">
                        {item.transaction_id ?? item.id ?? "—"}
                      </td>
                      <td>{item.tuition_id ?? "—"}</td>
                      <td>
                        {item.description ??
                          item.content ??
                          item.note ??
                          "Thanh toán học phí"}
                      </td>
                      <td className="history-amount-cell">
                        {formatMoney(item.amount ?? item.total_amount)}
                      </td>
                      <td>
                        <span
                          className={`history-status history-status-${status.cssClass}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td>
                        {formatDate(
                          item.created_at ??
                          item.transaction_date ??
                          item.paid_at
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              padding: 16,
              alignItems: "center",
            }}
          >
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Trước
            </button>

            <span>
              Trang {currentPage}/{totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
            >
              Sau
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
