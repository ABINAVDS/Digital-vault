# Document Vault Backend

Spring Boot REST API for the Digital Document Vault System.

## Setup & Run

1. **Prerequisites**: Java 17+, Maven 3.6+

2. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

3. **Access**:
   - API: http://localhost:8080/api/documents
   - H2 Console: http://localhost:8080/h2-console

## Configuration

- **Database**: H2 in-memory (development)
- **File Upload**: Max 10MB per file
- **CORS**: Enabled for http://localhost:3000
- **Port**: 8080

## API Documentation

### Upload Document
```
POST /api/documents/upload
Content-Type: multipart/form-data

Parameters:
- file: MultipartFile (required)
- name: String (required)
- description: String (optional)
```

### Get All Documents
```
GET /api/documents
Response: List<Document>
```

### Download Document
```
GET /api/documents/download/{id}
Response: File download
```

### Delete Document
```
DELETE /api/documents/{id}
Response: 200 OK or 404 Not Found
```

### Search Documents
```
GET /api/documents/search?query={searchTerm}
Response: List<Document>
```