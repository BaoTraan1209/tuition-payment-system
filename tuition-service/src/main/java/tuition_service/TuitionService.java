
package tuition_service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TuitionService {

    private final TuitionRepository tuitionRepository;
    private final TuitionTransactionRepository transactionRepository;
    private final NotificationClient notificationClient;
    private final TuitionPaymentReservationRepository reservationRepository;

    public TuitionService(
            TuitionRepository tuitionRepository,
            TuitionTransactionRepository transactionRepository,
            NotificationClient notificationClient,
            TuitionPaymentReservationRepository reservationRepository) {

        this.tuitionRepository = tuitionRepository;
        this.transactionRepository = transactionRepository;
        this.notificationClient = notificationClient;
        this.reservationRepository = reservationRepository;

    }

    public Optional<Map<String, Object>> findTuitionByMssv(
            String mssv) {

        return tuitionRepository.findByMssv(mssv)
                .map(tuition -> Map.<String, Object>of(
                        "mssv", tuition.getMssv(),
                        "fullName", tuition.getStudentName(),
                        "amount", tuition.getAmount(),
                        "status", tuition.getStatus()));
    }

    
@Transactional
public Optional<Map<String, Object>> updateStatus(
        String mssv, String newStatus) {

    if (newStatus == null
            || (!newStatus.equals("PENDING")
            && !newStatus.equals("PROCESSING")
            && !newStatus.equals("SUCCESS")
            && !newStatus.equals("FAILED"))) {

        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Trang thai khong hop le"
        );
    }

    throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "Khong duoc cap nhat trang thai hoc phi thu cong"
    );
}
    public List<Map<String, Object>> getAllTuition() {
        return tuitionRepository.findAll()
                .stream()
                .map(tuition -> Map.<String, Object>of(
                        "mssv", tuition.getMssv(),
                        "fullName", tuition.getStudentName(),
                        "amount", tuition.getAmount(),
                        "status", tuition.getStatus()))
                .toList();
    }

    public List<TuitionTransaction> getTransactionHistory(
            String mssv) {

        return transactionRepository
                .findByMssvOrderByChangedAtDesc(mssv);
    }
    @Transactional
public boolean payTuition(String mssv) {
    throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "Thanh toan phai duoc xac nhan boi Payment Service"
    );
}
        
private void sendStatusEmail(
        Tuition saved,
        String oldStatus,
        String newStatus) {

    if (saved.getEmail() == null
            || saved.getEmail().isBlank()) {
        return;
    }

    try {
        notificationClient.sendEmail(
                saved.getEmail(),
                "Thong bao trang thai hoc phi",
                "Xin chao " + saved.getStudentName()
                        + ",\n\nMa sinh vien: " + saved.getMssv()
                        + "\nSo tien hoc phi: " + saved.getAmount()
                        + "\nTrang thai cu: " + oldStatus
                        + "\nTrang thai moi: " + newStatus
                        + "\n\nThong bao tu he thong thanh toan hoc phi."
        );
    } catch (Exception e) {
        System.err.println(
                "Khong gui duoc email: " + e.getMessage());
    }
        }
        @Transactional
public Map<String, Object> reservePayment(
        Long tuitionId, String paymentId) {

    if (paymentId == null || paymentId.isBlank()) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "paymentId khong duoc de trong"
        );
    }

    // Neu paymentId da ton tai, kiem tra giao dich cu
    Optional<TuitionPaymentReservation> existing =
            reservationRepository.findByPaymentId(paymentId);

    if (existing.isPresent()) {
        TuitionPaymentReservation old = existing.get();

        if (!old.getTuitionId().equals(tuitionId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "paymentId da duoc su dung cho khoan hoc phi khac"
            );
        }

        return Map.of(
                "tuitionId", old.getTuitionId(),
                "paymentId", old.getPaymentId(),
                "status", old.getStatus()
        );
    }

    // Kiem tra khoan hoc phi co ton tai khong
    Tuition tuition = tuitionRepository.findById(tuitionId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Khong tim thay khoan hoc phi"
            ));

    // Chi cho phep xu ly hoc phi chua thanh toan
    if (!"PENDING".equals(tuition.getStatus())) {
        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Hoc phi khong o trang thai PENDING"
        );
    }

   // Thu giu quyen thanh toan bang INSERT
int inserted = reservationRepository.tryReserve(
        tuitionId, paymentId
);

// Neu khong them duoc, khoan hoc phi da co reservation
if (inserted == 0) {
    throw new ResponseStatusException(
            HttpStatus.CONFLICT,
            "Khoan hoc phi da co giao dich dang xu ly"
    );
}

    return Map.of(
            "tuitionId", tuitionId,
            "paymentId", paymentId,
            "status", "PROCESSING",
            "amount", tuition.getAmount()
                );
        }

        @Transactional
public Map<String, Object> confirmTuitionPayment(
        Long tuitionId, String paymentId) {

    if (paymentId == null || paymentId.isBlank()) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "paymentId khong duoc de trong"
        );
    }

    TuitionPaymentReservation reservation =
            reservationRepository.findByTuitionIdForUpdate(tuitionId)
                    .orElseThrow(() ->
                            new ResponseStatusException(
                                    HttpStatus.NOT_FOUND,
                                    "Khong tim thay reservation"
                            )
                    );

    if (!paymentId.equals(reservation.getPaymentId())) {
        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "paymentId khong khop"
        );
    }

    // Neu da xac nhan truoc do, tra lai ket qua cu
    if ("SUCCESS".equals(reservation.getStatus())) {
        return Map.of(
                "tuitionId", tuitionId,
                "paymentId", paymentId,
                "status", "SUCCESS",
                "message", "Giao dich da duoc xac nhan"
        );
    }

    if (!"PROCESSING".equals(reservation.getStatus())) {
        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Reservation khong o trang thai PROCESSING"
        );
    }

    Tuition tuition = tuitionRepository.findById(tuitionId)
            .orElseThrow(() ->
                    new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Khong tim thay hoc phi"
                    )
            );

    // Chi mot request duoc cap nhat hoc phi
    int updated = tuitionRepository
            .markAsPaidByTuitionIdIfPending(tuitionId);

    if (updated != 1) {
        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Hoc phi khong con o trang thai PENDING"
        );
    }

    // Chi reservation dung paymentId moi duoc xac nhan
    int reservationUpdated =
            reservationRepository.markReservationSuccess(
                    tuitionId, paymentId
            );

    if (reservationUpdated != 1) {
        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Khong the xac nhan reservation"
        );
    }

    // Ghi lich su sau khi cap nhat thanh cong
    transactionRepository.save(
            new TuitionTransaction(
                    tuitionId,
                    tuition.getMssv(),
                    "PENDING",
                    "SUCCESS"
            )
    );

    return Map.of(
            "tuitionId", tuitionId,
            "paymentId", paymentId,
            "status", "SUCCESS",
            "message", "Xac nhan hoc phi thanh cong"
    );
}



}
