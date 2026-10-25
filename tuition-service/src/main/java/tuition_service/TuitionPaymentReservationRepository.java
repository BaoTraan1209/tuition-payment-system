package tuition_service;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

public interface TuitionPaymentReservationRepository
        extends JpaRepository<TuitionPaymentReservation, Long> {

    Optional<TuitionPaymentReservation> findByPaymentId(
            String paymentId
    );

    @Modifying
    @Query(value = """
        INSERT IGNORE INTO tuition_payment_reservation
            (tuition_id, payment_id, status)
        VALUES
            (:tuitionId, :paymentId, 'PROCESSING')
        """, nativeQuery = true)
    int tryReserve(
            @Param("tuitionId") Long tuitionId,
            @Param("paymentId") String paymentId
    );

    @Modifying
@Query(value = """
    UPDATE tuition_payment_reservation
    SET status = 'SUCCESS'
    WHERE tuition_id = :tuitionId
      AND payment_id = :paymentId
      AND status = 'PROCESSING'
    """, nativeQuery = true)
int markReservationSuccess(
        @Param("tuitionId") Long tuitionId,
        @Param("paymentId") String paymentId
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
    SELECT r
    FROM TuitionPaymentReservation r
    WHERE r.tuitionId = :tuitionId
    """)
    Optional<TuitionPaymentReservation> findByTuitionIdForUpdate(
        @Param("tuitionId") Long tuitionId
    );
}