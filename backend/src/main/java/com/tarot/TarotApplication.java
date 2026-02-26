package com.tarot;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class TarotApplication {
    public static void main(String[] args) {
        // Load .env file if it exists
        Dotenv dotenv = Dotenv.configure()
                .directory("./")
                .ignoreIfMissing()
                .load();
        
        // Set system properties from .env file
        if (dotenv != null) {
            dotenv.entries().forEach(entry -> {
                String key = entry.getKey();
                String value = entry.getValue();
                if (!System.getProperties().containsKey(key)) {
                    System.setProperty(key, value);
                }
            });
        }
        
        SpringApplication.run(TarotApplication.class, args);
    }
}


