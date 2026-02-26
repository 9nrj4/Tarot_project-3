package com.tarot.utils;

import com.tarot.model.TarotCard;
import java.util.Arrays;
import java.util.List;

public class CardRecognition {
    public static final List<TarotCard> TAROT_CARDS_DATA = Arrays.asList(
        // Старшие арканы (Major Arcana)
        new TarotCard("Шут", "0.png", "major", null),
        new TarotCard("Маг", "1.png", "major", null),
        new TarotCard("Верховная Жрица", "2.png", "major", null),
        new TarotCard("Императрица", "3.png", "major", null),
        new TarotCard("Император", "4.png", "major", null),
        new TarotCard("Иерофант", "5.png", "major", null),
        new TarotCard("Влюбленные", "6.png", "major", null),
        new TarotCard("Колесница", "7.png", "major", null),
        new TarotCard("Сила", "8.png", "major", null),
        new TarotCard("Отшельник", "9.png", "major", null),
        new TarotCard("Колесо Фортуны", "10.png", "major", null),
        new TarotCard("Справедливость", "11.png", "major", null),
        new TarotCard("Повешенный", "12.png", "major", null),
        new TarotCard("Смерть", "13.jpg", "major", null),
        new TarotCard("Умеренность", "14.png", "major", null),
        new TarotCard("Дьявол", "15.png", "major", null),
        new TarotCard("Башня", "16.png", "major", null),
        new TarotCard("Звезда", "17.png", "major", null),
        new TarotCard("Луна", "18.png", "major", null),
        new TarotCard("Солнце", "19.png", "major", null),
        new TarotCard("Суд", "20.png", "major", null),
        new TarotCard("Мир", "21.png", "major", null),
        
        // Младшие арканы - Жезлы (Wands)
        new TarotCard("Туз Жезлов", "ace_wand.png", "minor", "wands"),
        new TarotCard("Двойка Жезлов", "2_wand.png", "minor", "wands"),
        new TarotCard("Тройка Жезлов", "3_wand.png", "minor", "wands"),
        new TarotCard("Четверка Жезлов", "4_wand.png", "minor", "wands"),
        new TarotCard("Пятерка Жезлов", "5_wand.png", "minor", "wands"),
        new TarotCard("Шестерка Жезлов", "6_wand.png", "minor", "wands"),
        new TarotCard("Семерка Жезлов", "7_wand.png", "minor", "wands"),
        new TarotCard("Восьмерка Жезлов", "8_wand.png", "minor", "wands"),
        new TarotCard("Девятка Жезлов", "9_wand.png", "minor", "wands"),
        new TarotCard("Десятка Жезлов", "10_wand.png", "minor", "wands"),
        new TarotCard("Паж Жезлов", "page_wand.png", "minor", "wands"),
        new TarotCard("Рыцарь Жезлов", "kni_wands.png", "minor", "wands"),
        new TarotCard("Королева Жезлов", "q_wand.png", "minor", "wands"),
        new TarotCard("Король Жезлов", "k_wand.png", "minor", "wands"),
        
        // Младшие арканы - Кубки (Cups)
        new TarotCard("Туз Кубков", "ace_cup.png", "minor", "cups"),
        new TarotCard("Двойка Кубков", "2_cups.png", "minor", "cups"),
        new TarotCard("Тройка Кубков", "3_cup.png", "minor", "cups"),
        new TarotCard("Четверка Кубков", "4_cup.png", "minor", "cups"),
        new TarotCard("Пятерка Кубков", "5_cup.png", "minor", "cups"),
        new TarotCard("Шестерка Кубков", "6_cup.png", "minor", "cups"),
        new TarotCard("Семерка Кубков", "7_cup.png", "minor", "cups"),
        new TarotCard("Восьмерка Кубков", "8_cup.png", "minor", "cups"),
        new TarotCard("Девятка Кубков", "9_cup.png", "minor", "cups"),
        new TarotCard("Десятка Кубков", "10_cup.png", "minor", "cups"),
        new TarotCard("Паж Кубков", "page_cup.png", "minor", "cups"),
        new TarotCard("Рыцарь Кубков", "kni_cup.png", "minor", "cups"),
        new TarotCard("Королева Кубков", "q_cup.png", "minor", "cups"),
        new TarotCard("Король Кубков", "k_cups.png", "minor", "cups"),
        
        // Младшие арканы - Мечи (Swords)
        new TarotCard("Туз Мечей", "ace_swo.png", "minor", "swords"),
        new TarotCard("Двойка Мечей", "2_swo.png", "minor", "swords"),
        new TarotCard("Тройка Мечей", "3_swo.png", "minor", "swords"),
        new TarotCard("Четверка Мечей", "4_swo.png", "minor", "swords"),
        new TarotCard("Пятерка Мечей", "5_swo.png", "minor", "swords"),
        new TarotCard("Шестерка Мечей", "6_swo.png", "minor", "swords"),
        new TarotCard("Семерка Мечей", "7_swo.png", "minor", "swords"),
        new TarotCard("Восьмерка Мечей", "8_swo.png", "minor", "swords"),
        new TarotCard("Девятка Мечей", "9_swo.png", "minor", "swords"),
        new TarotCard("Десятка Мечей", "10_swo.png", "minor", "swords"),
        new TarotCard("Паж Мечей", "page_swo.png", "minor", "swords"),
        new TarotCard("Рыцарь Мечей", "kni_swo.png", "minor", "swords"),
        new TarotCard("Королева Мечей", "q_swo.png", "minor", "swords"),
        new TarotCard("Король Мечей", "k_swo.png", "minor", "swords"),
        
        // Младшие арканы - Пентакли (Pentacles)
        new TarotCard("Туз Пентаклей", "ace_pent.png", "minor", "pentacles"),
        new TarotCard("Двойка Пентаклей", "2_pent.png", "minor", "pentacles"),
        new TarotCard("Тройка Пентаклей", "3_pent.png", "minor", "pentacles"),
        new TarotCard("Четверка Пентаклей", "4_pent.png", "minor", "pentacles"),
        new TarotCard("Пятерка Пентаклей", "5_pent.png", "minor", "pentacles"),
        new TarotCard("Шестерка Пентаклей", "6_pent.png", "minor", "pentacles"),
        new TarotCard("Семерка Пентаклей", "7_pent.png", "minor", "pentacles"),
        new TarotCard("Восьмерка Пентаклей", "8_pent.png", "minor", "pentacles"),
        new TarotCard("Девятка Пентаклей", "9_pent.png", "minor", "pentacles"),
        new TarotCard("Десятка Пентаклей", "10_pent.png", "minor", "pentacles"),
        new TarotCard("Паж Пентаклей", "page_pent.png", "minor", "pentacles"),
        new TarotCard("Рыцарь Пентаклей", "kni_pent.png", "minor", "pentacles"),
        new TarotCard("Королева Пентаклей", "q_pent.png", "minor", "pentacles"),
        new TarotCard("Король Пентаклей", "k_pent.png", "minor", "pentacles")
    );

    public static TarotCard getCardByName(String name) {
        return TAROT_CARDS_DATA.stream()
                .filter(card -> card.getName().equals(name))
                .findFirst()
                .orElse(null);
    }
}


