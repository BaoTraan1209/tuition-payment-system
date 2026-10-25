
package tuition_service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class NotificationClient {

    private final RestClient restClient;

    public NotificationClient() {
        this.restClient = RestClient.create(
                "http://localhost:8081");
    }

    public void sendEmail(
            String to,
            String subject,
            String content) {

        restClient.post()
                .uri("/api/notifications/email")
                .body(Map.of(
                        "to", to,
                        "subject", subject,
                        "content", content
                ))
                .retrieve()
                .toBodilessEntity();
    }
}
