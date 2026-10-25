
package tuition_service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tuition")
public class Tuition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tuition_id")
    private Long tuitionId;

    @Column(name = "mssv", nullable = false)
    private String mssv;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "email")
    private String email;

    public Tuition() {
    }

    public Long getTuitionId() {
        return tuitionId;
    }

    public String getMssv() {
        return mssv;
    }

    public String getStudentName() {
        return studentName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public String getEmail() {
        return email;
    }
}
