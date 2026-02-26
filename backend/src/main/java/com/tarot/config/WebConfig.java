package com.tarot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static files from frontend build directory
        String frontendBuildPath = new File("../frontend/build").getAbsolutePath();
        registry.addResourceHandler("/static/**")
                .addResourceLocations("file:" + frontendBuildPath + "/static/");
        
        // Serve other static files (images, manifest, etc.)
        registry.addResourceHandler("/**")
                .addResourceLocations("file:" + frontendBuildPath + "/");
        
        // Also serve backend static files
        registry.addResourceHandler("/backend-static/**")
                .addResourceLocations("classpath:/static/", "file:./static/");
    }
}


