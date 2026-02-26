package com.tarot.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tarot.model.Message;
import com.tarot.model.TarotCard;
import com.tarot.model.TarotSession;
import com.tarot.utils.Prompts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIService {
    private final String apiKey;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AIService(@Value("${google.ai.api-key:}") String apiKey) {
        this.apiKey = apiKey;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String getAIResponse(TarotSession session) {
        // Build conversation content for Gemini
        List<Map<String, Object>> contents = new ArrayList<>();
        
        // Add system instruction as first content
        StringBuilder fullPrompt = new StringBuilder(Prompts.TAROT_SYSTEM_PROMPT).append("\n\n");
        
        // Add session history
        for (Message msg : session.getHistory()) {
            if ("user".equals(msg.getRole())) {
                fullPrompt.append("User: ").append(msg.getContent()).append("\n\n");
            } else if ("assistant".equals(msg.getRole())) {
                fullPrompt.append("Assistant: ").append(msg.getContent()).append("\n\n");
            }
        }

        // Add card information if cards are drawn
        if (session.isQuestionsAsked() && session.isCardsDrawn() && !session.getCards().isEmpty()) {
            List<String> cardNames = new ArrayList<>();
            List<String> cardDescriptions = new ArrayList<>();
            
            for (TarotCard card : session.getCards()) {
                cardNames.add(card.getName());
                cardDescriptions.add(String.format("Карта: %s, тип: %s", card.getName(), card.getType()));
            }
            
            String cardsMsg = "\nВыбранные карты: " + String.join(", ", cardNames);
            String cardsDetails = "\nПодробная информация о картах: " + String.join("; ", cardDescriptions);
            fullPrompt.append(cardsMsg).append(cardsDetails).append("\n\n");
            
            // Check for reading detail preference in system messages
            String readingDetail = "detailed"; // default
            for (Message msg : session.getHistory()) {
                if ("system".equals(msg.getRole()) && msg.getContent().contains("чтение карт")) {
                    if (msg.getContent().toLowerCase().contains("brief") || msg.getContent().toLowerCase().contains("кратк")) {
                        readingDetail = "brief";
                    } else if (msg.getContent().toLowerCase().contains("detailed") || msg.getContent().toLowerCase().contains("подробн")) {
                        readingDetail = "detailed";
                    }
                }
            }
            
            // Add explicit format instruction
            if ("brief".equals(readingDetail)) {
                fullPrompt.append("\nВАЖНО: Клиент выбрал КРАТКИЙ формат интерпретации. Предоставь лаконичный анализ (2-3 предложения для каждой карты и 4 предложения для общего вывода). НЕ спрашивай о формате - клиент уже выбрал краткий формат.\n\n");
            } else {
                fullPrompt.append("\nВАЖНО: Клиент выбрал ПОДРОБНЫЙ формат интерпретации. Предоставь развернутый анализ (8-10 предложений для каждой карты и 8-10 предложений для общего вывода). НЕ спрашивай о формате - клиент уже выбрал подробный формат.\n\n");
            }
        }

        // Call Gemini API
        return callGeminiAPI(fullPrompt.toString());
    }

    private String callGeminiAPI(String prompt) {
        try {
            if (apiKey == null || apiKey.isBlank()) {
                throw new RuntimeException("Google AI API key is missing. Set property google.ai.api-key.");
            }
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

            // Build request body according to Gemini API format
            Map<String, Object> requestBody = new HashMap<>();

            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", Collections.singletonList(part));

            requestBody.put("contents", Collections.singletonList(content));

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            System.out.println("Calling Gemini API with URL: " + url.replace(apiKey, "***"));
            System.out.println("Prompt length: " + prompt.length());

            // Make API call
            ResponseEntity<Map> response;
            try {
                response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            } catch (org.springframework.web.client.HttpClientErrorException e) {
                System.err.println("Gemini API HTTP error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
                throw new RuntimeException("Gemini API HTTP error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e);
            } catch (org.springframework.web.client.HttpServerErrorException e) {
                System.err.println("Gemini API server error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
                throw new RuntimeException("Gemini API server error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e);
            }

            System.out.println("Gemini API response status: " + response.getStatusCode());

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                
                // Check for error in response
                if (body.containsKey("error")) {
                    Object errorObj = body.get("error");
                    System.err.println("Gemini API error: " + errorObj);
                    throw new RuntimeException("Gemini API error: " + errorObj);
                }
                
                Object candidatesObj = body.get("candidates");
                if (candidatesObj instanceof List<?> candidates && !candidates.isEmpty()) {
                    Object first = candidates.get(0);
                    if (first instanceof Map<?, ?> candidate) {
                        // Check for finishReason or blocking
                        if (candidate.containsKey("finishReason")) {
                            Object finishReason = candidate.get("finishReason");
                            if (!"STOP".equals(finishReason)) {
                                System.err.println("Gemini API finish reason: " + finishReason);
                            }
                        }
                        
                        Object contentObj = candidate.get("content");
                        if (contentObj instanceof Map<?, ?> contentMap) {
                            Object partsObj = contentMap.get("parts");
                            if (partsObj instanceof List<?> parts && !parts.isEmpty()) {
                                Object firstPart = parts.get(0);
                                if (firstPart instanceof Map<?, ?> partMap) {
                                    Object textObj = partMap.get("text");
                                    if (textObj instanceof String text && !text.isBlank()) {
                                        System.out.println("Gemini API response received successfully, text length: " + text.length());
                                        return text;
                                    } else {
                                        System.err.println("Text is null or blank. partMap: " + partMap);
                                    }
                                }
                            }
                        }
                    }
                }
                System.err.println("Gemini API response structure: " + body);
            } else {
                System.err.println("Gemini API returned status: " + response.getStatusCode());
                if (response.getBody() != null) {
                    System.err.println("Response body: " + response.getBody());
                }
            }

            throw new RuntimeException("Invalid response from Gemini API (no text in candidates)");
        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error calling Gemini API: " + e.getMessage(), e);
        }
    }

    private String callGeminiAPIReal(String prompt) {
        try {
            if (apiKey == null || apiKey.isBlank()) {
                throw new RuntimeException("Google AI API key is missing. Set property google.ai.api-key.");
            }
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

            // Build request body according to Gemini API format
            Map<String, Object> requestBody = new HashMap<>();

            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", Collections.singletonList(part));

            requestBody.put("contents", Collections.singletonList(content));

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Make API call
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                Object candidatesObj = body.get("candidates");
                if (candidatesObj instanceof List<?> candidates && !candidates.isEmpty()) {
                    Object first = candidates.get(0);
                    if (first instanceof Map<?, ?> candidate) {
                        Object contentObj = candidate.get("content");
                        if (contentObj instanceof Map<?, ?> contentMap) {
                            Object partsObj = contentMap.get("parts");
                            if (partsObj instanceof List<?> parts && !parts.isEmpty()) {
                                Object firstPart = parts.get(0);
                                if (firstPart instanceof Map<?, ?> partMap) {
                                    Object textObj = partMap.get("text");
                                    if (textObj instanceof String text && !text.isBlank()) {
                                        return text;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            throw new RuntimeException("Invalid response from Gemini API (no text in candidates)");
        } catch (Exception e) {
            throw new RuntimeException("Error calling Gemini API: " + e.getMessage(), e);
        }
    }
}

