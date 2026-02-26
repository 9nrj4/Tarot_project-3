package com.tarot.config;

import com.tarot.model.Reading;
import com.tarot.model.Role;
import com.tarot.model.User;
import com.tarot.repository.ReadingRepository;
import com.tarot.repository.UserRepository;
import com.tarot.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(UserRepository userRepository,
                               UserService userService,
                               ReadingRepository readingRepository) {
        return args -> {
            // Админ по умолчанию
            userRepository.findByEmail("admin@example.com").orElseGet(() -> {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@example.com");
                admin.setPasswordHash(userService.encodePassword("admin"));
                admin.setRole(Role.ADMIN);
                return userRepository.save(admin);
            });

            // Пара демо-раскладов
            if (readingRepository.count() == 0) {
                Reading r1 = new Reading();
                r1.setTitle("Кельтский крест (демо)");
                r1.setDescription("Демонстрационный расклад для презентации проекта.");
                readingRepository.save(r1);

                Reading r2 = new Reading();
                r2.setTitle("Расклад на любовь (демо)");
                r2.setDescription("Демо-расклад на тему отношений.");
                readingRepository.save(r2);
            }
        };
    }
}




