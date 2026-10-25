
package tuition_service;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TuitionRepository extends JpaRepository<Tuition, Long> {

    Optional<Tuition> findByMssv(String mssv);

    @Modifying
    @Query("""
        UPDATE Tuition t
        SET t.status = 'SUCCESS'
        WHERE t.mssv = :mssv
          AND t.status = 'PENDING'
        """)
    int markAsPaidIfPending(@Param("mssv") String mssv);

    @Modifying
    @Query("""
    UPDATE Tuition t
    SET t.status = 'SUCCESS'
    WHERE t.tuitionId = :tuitionId
      AND t.status = 'PENDING'
    """)
    int markAsPaidByTuitionIdIfPending(
        @Param("tuitionId") Long tuitionId
    );
}
