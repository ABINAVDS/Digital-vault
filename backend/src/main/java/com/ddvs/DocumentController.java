package com.ddvs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:3000")
public class DocumentController {
    
    @Autowired
    private DocumentRepository documentRepository;
    
    private final String uploadDir = "uploads/";
    
    @GetMapping
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocument(@PathVariable Long id) {
        return documentRepository.findById(id)
                .map(document -> ResponseEntity.ok().body(document))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description) {
        
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.createDirectories(filePath.getParent());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            Document document = new Document();
            document.setName(name);
            document.setFileName(file.getOriginalFilename());
            document.setDescription(description);
            document.setFileType(file.getContentType());
            document.setFileSize(file.getSize());
            document.setFilePath(fileName);
            
            Document savedDocument = documentRepository.save(document);
            return ResponseEntity.ok(savedDocument);
            
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        return documentRepository.findById(id)
                .map(document -> {
                    try {
                        Path filePath = Paths.get(uploadDir + document.getFilePath());
                        Resource resource = new UrlResource(filePath.toUri());
                        
                        return ResponseEntity.ok()
                                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                                .header(HttpHeaders.CONTENT_DISPOSITION, 
                                       "attachment; filename=\"" + document.getFileName() + "\"")
                                .body(resource);
                    } catch (Exception e) {
                        return ResponseEntity.notFound().<Resource>build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        return documentRepository.findById(id)
                .map(document -> {
                    try {
                        Path filePath = Paths.get(uploadDir + document.getFilePath());
                        Files.deleteIfExists(filePath);
                        documentRepository.delete(document);
                        return ResponseEntity.ok().build();
                    } catch (IOException e) {
                        return ResponseEntity.badRequest().build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    public List<Document> searchDocuments(@RequestParam String query) {
        return documentRepository.findByNameContainingIgnoreCase(query);
    }
}
