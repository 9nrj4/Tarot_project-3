package com.tarot.service;

import com.tarot.model.TarotSession;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class TarotSessionServiceTest {

    @Autowired
    private TarotSessionService tarotSessionService;

    @Test
    void createAndLoadSessionWorks() {
        TarotSession created = tarotSessionService.createSession();
        assertNotNull(created.getSessionId());

        TarotSession loaded = tarotSessionService.loadSession(created.getSessionId());
        assertEquals(created.getSessionId(), loaded.getSessionId());
    }
}




