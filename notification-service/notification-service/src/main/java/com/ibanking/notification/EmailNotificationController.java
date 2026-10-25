
package com.ibanking.notification;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class EmailNotificationController {

    private final EmailNotificationService emailService;

    public EmailNotificationController(
            EmailNotificationService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/email")
    public ResponseEntity<Map<String, String>> sendEmail(
            @RequestBody EmailRequest request) {

        emailService.sendEmail(
            request.to(),
            request.subject(),
            request.content()
        );

        return ResponseEntity.ok(
            Map.of("message", "Email sent successfully")
        );
    }

    public record EmailRequest(
        String to,
        String subject,
        String content
    ) {}
}
