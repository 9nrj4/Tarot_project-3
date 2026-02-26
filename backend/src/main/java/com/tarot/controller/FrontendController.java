package com.tarot.controller;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class FrontendController {
    private final String frontendBuildDir;

    public FrontendController() {
        // Get the project root directory (two levels up from backend)
        File currentFile = new File(System.getProperty("user.dir"));
        this.frontendBuildDir = new File(currentFile.getParentFile(), "frontend/build").getAbsolutePath();
        System.out.println("Frontend build directory: " + this.frontendBuildDir);
        File buildDir = new File(this.frontendBuildDir);
        System.out.println("Build directory exists: " + buildDir.exists());
        if (buildDir.exists()) {
            File indexHtml = new File(buildDir, "index.html");
            System.out.println("index.html exists: " + indexHtml.exists());
        }
    }

    @GetMapping(value = {"/", "/{path:[^\\.]*}"})
    public ResponseEntity<Resource> serveReactApp(@PathVariable(required = false) String path) {
        try {
            // Don't serve API routes or static files (handled by WebConfig)
            if (path != null && (path.startsWith("api/") || path.startsWith("static/"))) {
                return ResponseEntity.notFound().build();
            }

            Path filePath;
            if (path == null || path.isEmpty()) {
                filePath = Paths.get(frontendBuildDir, "index.html");
            } else {
                filePath = Paths.get(frontendBuildDir, path);
                if (!filePath.toFile().exists() || !filePath.toFile().isFile()) {
                    // If file doesn't exist, serve index.html for SPA routing
                    filePath = Paths.get(frontendBuildDir, "index.html");
                }
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .header("Content-Type", "text/html; charset=utf-8")
                    .body(resource);
            } else {
                System.err.println("Frontend file not found: " + filePath);
                System.err.println("Frontend build directory: " + frontendBuildDir);
                // Return a simple message if build is missing
                String errorHtml = "<!DOCTYPE html><html><head><title>Frontend Not Built</title></head><body>" +
                    "<h1>Frontend build not found or incomplete</h1>" +
                    "<p>The JavaScript bundle is missing. Please rebuild the frontend:</p>" +
                    "<pre>cd frontend && npm run build</pre>" +
                    "<p>Or use the dev server instead:</p>" +
                    "<pre>cd frontend && npm start</pre>" +
                    "<p>(Dev server runs on localhost:3000)</p>" +
                    "<p><strong>Backend API is running</strong> - test it: <a href='/api/tarot-cards'>/api/tarot-cards</a></p>" +
                    "</body></html>";
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .contentType(MediaType.TEXT_HTML)
                    .body(new ByteArrayResource(errorHtml.getBytes()));
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/manifest.json")
    public ResponseEntity<Resource> serveManifest() {
        return serveFile("manifest.json");
    }

    @GetMapping("/favicon.ico")
    public ResponseEntity<Resource> serveFavicon() {
        return serveFile("favicon.ico");
    }

    private ResponseEntity<Resource> serveFile(String filename) {
        try {
            Path filePath = Paths.get(frontendBuildDir, filename);
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}


