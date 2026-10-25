
package tuition_service;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tuition_transaction")
public class TuitionTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "tuition_id", nullable = false)
    private Long tuitionId;

    @Column(name = "mssv", nullable = false)
    private String mssv;

    @Column(name = "old_status")
    private String oldStatus;

    @Column(name = "new_status", nullable = false)
    private String newStatus;

    @Column(name = "changed_at", insertable = false, updatable = false)
    private LocalDateTime changedAt;

    public TuitionTransaction() {
    }

    public TuitionTransaction(
            Long tuitionId,
            String mssv,
            String oldStatus,
            String newStatus) {
        this.tuitionId = tuitionId;
        this.mssv = mssv;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
    }
    
    public Long getTransactionId() {
        return transactionId;
    }

    public Long getTuitionId() {
        return tuitionId;
    }

    public String getMssv() {
        return mssv;
    }

    public String getOldStatus() {
        return oldStatus;
    }

    public String getNewStatus() {
        return newStatus;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

}
