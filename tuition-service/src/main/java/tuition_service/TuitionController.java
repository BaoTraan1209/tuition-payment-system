
package tuition_service;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/tuition")
public class TuitionController {

    private final TuitionService tuitionService;

    public TuitionController(TuitionService tuitionService) {
        this.tuitionService = tuitionService;
    }

    @GetMapping("/students/{mssv}")
    public ResponseEntity<Map<String, Object>> getTuition(
            @PathVariable String mssv) {

        return tuitionService.findTuitionByMssv(mssv)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PutMapping("/students/{mssv}/status")
public ResponseEntity<Map<String, Object>> updateStatus(
        @PathVariable String mssv,
        @RequestParam String status) {

    if ("SUCCESS".equalsIgnoreCase(status)
            || "PROCESSING".equalsIgnoreCase(status)) {

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "message",
                        "Khong duoc cap nhat truc tiep trang thai thanh toan",
                        "mssv", mssv
                ));
    }

    return tuitionService.updateStatus(mssv, status)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
}
    
    @GetMapping("/students")
    public ResponseEntity<List<Map<String, Object>>> getAllTuition() {
        return ResponseEntity.ok(tuitionService.getAllTuition());
    }
    
    @GetMapping("/students/{mssv}/transactions")
    public ResponseEntity<List<TuitionTransaction>> getTransactionHistory(
            @PathVariable String mssv) {

        return ResponseEntity.ok(
            tuitionService.getTransactionHistory(mssv)
        );
    
    }
    
    @PutMapping("/students/{mssv}/pay")
public ResponseEntity<Map<String, Object>> payTuition(
        @PathVariable String mssv) {

    return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(Map.of(
                    "message",
                    "Thanh toan phai duoc xu ly qua Payment Service",
                    "mssv", mssv
            ));
}
    @PostMapping("/{tuitionId}/reserve")
    public ResponseEntity<Map<String, Object>> reservePayment(
        @PathVariable Long tuitionId,
        @RequestBody Map<String, String> request) {

    String paymentId = request.get("paymentId");

    Map<String, Object> result =
            tuitionService.reservePayment(tuitionId, paymentId);

    return ResponseEntity.ok(result);
}

@PostMapping("/{tuitionId}/confirm")
public ResponseEntity<Map<String, Object>> confirmPayment(
        @PathVariable Long tuitionId,
        @RequestBody Map<String, String> request) {

    String paymentId = request.get("paymentId");

    Map<String, Object> result =
            tuitionService.confirmTuitionPayment(
                    tuitionId, paymentId
            );

    return ResponseEntity.ok(result);
}


}
