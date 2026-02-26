package com.tarot.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tarot.model.TarotSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class TarotSessionService {
    private final String sessionDir;
    private final ObjectMapper objectMapper;

    public TarotSessionService(@Value("${session.dir:./data/sessions}") String sessionDir) {
        this.sessionDir = sessionDir;
        this.objectMapper = new ObjectMapper();
        try {
            Files.createDirectories(Paths.get(sessionDir));
        } catch (IOException e) {
            throw new RuntimeException("Failed to create session directory", e);
        }
    }

    public TarotSession createSession() {
        String sessionId = UUID.randomUUID().toString();
        TarotSession session = new TarotSession();
        session.setSessionId(sessionId);
        saveSession(session);
        return session;
    }

    public TarotSession loadSession(String sessionId) {
        Path sessionPath = Paths.get(sessionDir, sessionId + ".json");
        if (!Files.exists(sessionPath)) {
            TarotSession session = new TarotSession();
            session.setSessionId(sessionId);
            return session;
        }
        try {
            return objectMapper.readValue(sessionPath.toFile(), TarotSession.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load session: " + sessionId, e);
        }
    }

    public void saveSession(TarotSession session) {
        Path sessionPath = Paths.get(sessionDir, session.getSessionId() + ".json");
        try {
            Files.createDirectories(sessionPath.getParent());
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(sessionPath.toFile(), session);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save session: " + session.getSessionId(), e);
        }
    }
}


