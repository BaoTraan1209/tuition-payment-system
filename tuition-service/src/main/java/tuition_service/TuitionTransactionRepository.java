
package tuition_service;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
public interface TuitionTransactionRepository
        extends JpaRepository<TuitionTransaction, Long> {
            List<TuitionTransaction> findByMssvOrderByChangedAtDesc(
        String mssv);

        boolean existsByTuitionIdAndNewStatus(
        Long tuitionId,
        String newStatus
    );
}

