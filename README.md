# Document Vault Frontend

Modern React application for the Digital Document Vault System.

## Setup & Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

3. **Access**: http://localhost:3000

## Features

- **Modern UI**: Clean design with gradient themes
- **Responsive**: Works on desktop and mobile
- **File Upload**: Drag & drop file upload interface
- **Document Grid**: Card-based document display
- **Search**: Real-time document search
- **File Management**: Download and delete operations

## Dependencies

- **React 18**: Core framework
- **Axios**: HTTP client for API calls
- **Lucide React**: Modern icon library

## Build

```bash
npm run build
```

Creates optimized production build in `build/` folder.

## Configuration

Backend API URL is configured in `src/App.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```