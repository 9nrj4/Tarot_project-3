package com.tarot.controller;

import com.tarot.model.TarotCard;
import com.tarot.model.TarotSession;
import com.tarot.service.AIService;
import com.tarot.service.TarotSessionService;
import com.tarot.utils.CardRecognition;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TarotController {
    private static final Logger log = LoggerFactory.getLogger(TarotController.class);
    private final TarotSessionService sessionService;
    private final AIService aiService;
    private final String cardsImagesDir;

    public TarotController(
            TarotSessionService sessionService,
            AIService aiService,
            @Value("${cards.images.dir:./static/images/tarot}") String cardsImagesDir) {
        this.sessionService = sessionService;
        this.aiService = aiService;
        this.cardsImagesDir = cardsImagesDir;
    }

    @GetMapping("/tarot-cards")
    public ResponseEntity<Map<String, Object>> getTarotCards() {
        List<Map<String, Object>> cardsData = IntStream.range(0, CardRecognition.TAROT_CARDS_DATA.size())
                .mapToObj(index -> {
                    TarotCard card = CardRecognition.TAROT_CARDS_DATA.get(index);
                    Map<String, Object> cardData = new HashMap<>();
                    cardData.put("id", "card-" + index);
                    cardData.put("name", card.getName());
                    cardData.put("image", card.getImage());
                    cardData.put("type", card.getType());
                    if (card.getSuit() != null) {
                        cardData.put("suit", card.getSuit());
                    }
                    return cardData;
                })
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("cards", cardsData);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/random-subset-cards")
    public ResponseEntity<Map<String, Object>> getRandomSubsetCards(
            @RequestParam(defaultValue = "20") int count) {
        List<TarotCard> allCards = new ArrayList<>(CardRecognition.TAROT_CARDS_DATA);
        Collections.shuffle(allCards);
        int actualCount = Math.min(count, allCards.size());
        List<TarotCard> selectedCards = allCards.subList(0, actualCount);

        List<Map<String, Object>> cardsData = new ArrayList<>();
        for (int i = 0; i < selectedCards.size(); i++) {
            TarotCard card = selectedCards.get(i);
            Map<String, Object> cardData = new HashMap<>();
            cardData.put("id", "card-" + i);
            cardData.put("name", card.getName());
            cardData.put("image", card.getImage());
            cardData.put("type", card.getType());
            if (card.getSuit() != null) {
                cardData.put("suit", card.getSuit());
            }
            cardsData.add(cardData);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("cards", cardsData);
        response.put("total_count", actualCount);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/submit-questions")
    public ResponseEntity<Map<String, Boolean>> submitQuestions(@RequestBody Map<String, Object> data) {
        String sessionId = (String) data.get("session_id");
        @SuppressWarnings("unchecked")
        List<String> responses = (List<String>) data.get("responses");

        TarotSession session = sessionService.loadSession(sessionId);
        if (responses != null) {
            for (String response : responses) {
                session.addUserResponse(response);
            }
        }
        session.setQuestionsAsked(true);
        sessionService.saveSession(session);

        Map<String, Boolean> result = new HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/draw-cards")
    public ResponseEntity<Map<String, Object>> drawTarotCards(@RequestBody Map<String, Object> data) {
        String sessionId = (String) data.get("session_id");
        @SuppressWarnings("unchecked")
        List<String> cards = (List<String>) data.get("cards");
        String readingDetail = (String) data.getOrDefault("reading_detail", "detailed");

        log.info("Received draw-cards request: sessionId={}, cards={}, readingDetail={}",
                sessionId, cards, readingDetail);

        TarotSession session = sessionService.loadSession(sessionId);
        List<TarotCard> selectedCards = new ArrayList<>();
        List<String> unknownNames = new ArrayList<>();

        if (cards != null) {
            for (String cardName : cards) {
                if (cardName == null || cardName.trim().isEmpty()) {
                    continue;
                }
                String trimmedName = cardName.trim();
                TarotCard cardInfo = CardRecognition.getCardByName(trimmedName);
                if (cardInfo != null) {
                    selectedCards.add(cardInfo);
                    log.debug("Matched card: {} -> {}", trimmedName, cardInfo.getName());
                } else {
                    unknownNames.add(trimmedName);
                    log.warn("Unknown card name: {}", trimmedName);
                }
            }
        }

        if (selectedCards.isEmpty()) {
            Map<String, Object> badRequest = new HashMap<>();
            badRequest.put("success", false);
            badRequest.put("message", "Не удалось сопоставить выбранные карты по именам. Проверьте, что имена совпадают с серверными.");
            if (!unknownNames.isEmpty()) {
                badRequest.put("unknown_names", unknownNames);
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(badRequest);
        }

        if (!unknownNames.isEmpty()) {
            Map<String, Object> warn = new HashMap<>();
            warn.put("success", false);
            warn.put("message", "Часть карт не распознана, требуется точное совпадение имен.");
            warn.put("unknown_names", unknownNames);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(warn);
        }

        session.drawCards(selectedCards);
        session.addUserResponse("Я выбрал карты: " + String.join(", ", cards));
        session.addMessage("system", String.format("Пользователь предпочитает %s чтение карт", readingDetail));

        String aiMessage = aiService.getAIResponse(session);
        session.addMessage("assistant", aiMessage);
        sessionService.saveSession(session);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", aiMessage);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/new-session")
    public ResponseEntity<Map<String, Object>> newSession() {
        log.info("Creating new session...");
        TarotSession session = sessionService.createSession();
        log.info("Session created: {}", session.getSessionId());

        log.info("Getting AI response for initial message...");
        String initialMessage = aiService.getAIResponse(session);
        log.info("AI response received, length: {}", initialMessage != null ? initialMessage.length() : 0);

        session.addMessage("assistant", initialMessage);
        sessionService.saveSession(session);

        Map<String, Object> response = new HashMap<>();
        response.put("session_id", session.getSessionId());
        response.put("message", initialMessage);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/message")
    public ResponseEntity<Map<String, String>> handleMessagePost(@RequestBody Map<String, String> data) {
        String sessionId = data.get("session_id");
        String userMessage = data.get("message");

        TarotSession session = sessionService.loadSession(sessionId);
        session.addUserResponse(userMessage);
        String aiMessage = aiService.getAIResponse(session);
        session.addMessage("assistant", aiMessage);
        sessionService.saveSession(session);

        Map<String, String> response = new HashMap<>();
        response.put("message", aiMessage);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/message")
    public ResponseEntity<Map<String, String>> handleMessageGet(@RequestParam String session_id) {
        TarotSession session = sessionService.loadSession(session_id);
        String aiMessage = aiService.getAIResponse(session);
        session.addMessage("assistant", aiMessage);
        sessionService.saveSession(session);

        Map<String, String> response = new HashMap<>();
        response.put("message", aiMessage);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getHistory(@RequestParam String session_id) {
        TarotSession session = sessionService.loadSession(session_id);
        Map<String, Object> response = new HashMap<>();
        response.put("history", session.getHistory());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/cards")
    public ResponseEntity<Map<String, Object>> getCards(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String suit,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        List<Map<String, Object>> cardsData = IntStream.range(0, CardRecognition.TAROT_CARDS_DATA.size())
                .mapToObj(index -> {
                    TarotCard card = CardRecognition.TAROT_CARDS_DATA.get(index);
                    Map<String, Object> cardData = new HashMap<>();
                    cardData.put("id", "card-" + index);
                    cardData.put("name", card.getName());
                    cardData.put("image", card.getImage());
                    cardData.put("type", card.getType());
                    if (card.getSuit() != null) {
                        cardData.put("suit", card.getSuit());
                    }
                    return cardData;
                })
                .collect(Collectors.toList());

        // filtering
        if (type != null && !type.isBlank()) {
            cardsData = cardsData.stream()
                    .filter(c -> type.equalsIgnoreCase((String) c.get("type")))
                    .collect(Collectors.toList());
        }
        if (suit != null && !suit.isBlank()) {
            cardsData = cardsData.stream()
                    .filter(c -> suit.equalsIgnoreCase((String) c.get("suit")))
                    .collect(Collectors.toList());
        }
        if (search != null && !search.isBlank()) {
            String s = search.toLowerCase();
            cardsData = cardsData.stream()
                    .filter(c -> ((String) c.get("name")).toLowerCase().contains(s))
                    .collect(Collectors.toList());
        }

        // sorting (by name for now)
        Comparator<Map<String, Object>> comparator = Comparator.comparing(c -> ((String) c.get("name")));
        if ("desc".equalsIgnoreCase(sortDir)) {
            comparator = comparator.reversed();
        }
        cardsData = cardsData.stream().sorted(comparator).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("cards", cardsData);
        response.put("total", cardsData.size());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/static/images/tarot/{filename:.+}")
    public ResponseEntity<Resource> serveTarotImage(@PathVariable String filename) {
        try {
            // Try configured directory and a few sensible fallbacks depending on run directory
            String[] baseDirs = new String[] {
                cardsImagesDir,
                "./backend/static/images/tarot",
                "backend/static/images/tarot",
                "./static/images/tarot"
            };

            for (String base : baseDirs) {
                if (base == null || base.isBlank()) continue;
                Path candidate = Paths.get(base).resolve(filename).normalize();
                Resource res = new UrlResource(candidate.toUri());
                if (res.exists() && res.isReadable()) {
                    String contentType = determineContentType(filename);
                    return ResponseEntity.ok()
                            .contentType(MediaType.parseMediaType(contentType))
                            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + res.getFilename() + "\"")
                            .body(res);
                }
            }

            return ResponseEntity.notFound().build();
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private String determineContentType(String filename) {
        String lowerFilename = filename.toLowerCase();
        if (lowerFilename.endsWith(".png")) {
            return "image/png";
        } else if (lowerFilename.endsWith(".jpg") || lowerFilename.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (lowerFilename.endsWith(".webp")) {
            return "image/webp";
        }
        return "application/octet-stream";
    }
}


