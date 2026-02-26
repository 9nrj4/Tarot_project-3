package com.tarot.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class TarotSession {
    private String sessionId;
    private boolean questionsAsked = false;
    private boolean cardsDrawn = false;
    private List<String> userResponses = new ArrayList<>();
    private List<TarotCard> cards = new ArrayList<>();
    private List<Message> history = new ArrayList<>();

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public boolean isQuestionsAsked() {
        return questionsAsked;
    }

    public void setQuestionsAsked(boolean questionsAsked) {
        this.questionsAsked = questionsAsked;
    }

    public boolean isCardsDrawn() {
        return cardsDrawn;
    }

    public void setCardsDrawn(boolean cardsDrawn) {
        this.cardsDrawn = cardsDrawn;
    }

    public List<String> getUserResponses() {
        return userResponses;
    }

    public void setUserResponses(List<String> userResponses) {
        this.userResponses = userResponses;
    }

    public List<TarotCard> getCards() {
        return cards;
    }

    public void setCards(List<TarotCard> cards) {
        this.cards = cards;
    }

    public List<Message> getHistory() {
        return history;
    }

    public void setHistory(List<Message> history) {
        this.history = history;
    }

    public void addMessage(String role, String content) {
        this.history.add(new Message(role, content));
    }

    public void addUserResponse(String response) {
        this.userResponses.add(response);
        addMessage("user", response);
    }

    public void drawCards(List<TarotCard> cards) {
        this.cards = cards;
        this.cardsDrawn = true;
    }
}


