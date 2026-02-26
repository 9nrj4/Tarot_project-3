# Tarot Backend - Java Spring Boot

This is the Java Spring Boot backend for the Tarot Reading Application, converted from Python Flask.

## Requirements

- Java 17 or higher
- Maven 3.6+

## Configuration

Create a `.env` file in the backend directory (or set environment variables):

```
GOOGLE_API_KEY=your_google_gemini_api_key_here
SESSION_DIR=./data/sessions
CARDS_IMAGES_DIR=./static/images/tarot
```

Alternatively, you can set these as environment variables before running the application.

## Building and Running

### Build the project:
```bash
mvn clean package
```

### Run the application:
```bash
mvn spring-boot:run
```

Or run the JAR file:
```bash
java -jar target/tarot-backend-1.0.0.jar
```

The application will start on port 8080 by default (configured in `application.properties`).

## API Endpoints

- `GET /api/tarot-cards` - Get all tarot cards
- `GET /api/random-subset-cards?count=20` - Get random subset of cards
- `POST /api/new-session` - Create a new tarot reading session
- `POST /api/submit-questions` - Submit user responses to questions
- `POST /api/draw-cards` - Submit drawn cards and get interpretation
- `POST /api/message` - Send a message to the AI tarot reader
- `GET /api/message?session_id=...` - Get AI response for a session
- `GET /api/history?session_id=...` - Get session history
- `GET /api/cards` - Get cards list
- `GET /static/images/tarot/{filename}` - Get tarot card images

### Auth / Roles (for defence/demo)

- `POST /api/auth/register` - register user
- `POST /api/auth/login` - login (checks credentials and returns user DTO)
- `GET /api/users/me` - current user profile (**requires HTTP Basic auth**)
- `PUT /api/users/me` - update profile name (**requires HTTP Basic auth**)
- `GET /api/readings` - CRUD demo entity (**requires HTTP Basic auth**)
- `GET /api/admin/users` - list users (**ADMIN only, requires HTTP Basic auth**)

Default admin (created on startup):
- email: `admin@example.com`
- password: `admin`

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/tarot/
│   │   │   ├── TarotApplication.java          # Main Spring Boot application
│   │   │   ├── config/
│   │   │   │   └── WebConfig.java             # CORS and static resource configuration
│   │   │   ├── controller/
│   │   │   │   ├── TarotController.java       # REST API endpoints
│   │   │   │   └── FrontendController.java    # Frontend serving routes
│   │   │   ├── model/
│   │   │   │   ├── TarotCard.java             # Card model
│   │   │   │   ├── TarotSession.java          # Session model
│   │   │   │   └── Message.java               # Message model
│   │   │   ├── service/
│   │   │   │   ├── TarotSessionService.java   # Session management
│   │   │   │   └── AIService.java             # Google Gemini AI integration
│   │   │   └── utils/
│   │   │       ├── CardRecognition.java       # Tarot card data
│   │   │       └── Prompts.java               # AI prompts
│   │   └── resources/
│   │       └── application.properties          # Application configuration
└── pom.xml                                     # Maven configuration
```

## Features

- **RESTful API**: All endpoints from the original Python Flask backend
- **Session Management**: JSON-based session persistence
- **AI Integration**: Google Gemini API integration for tarot readings
- **CORS Support**: Configured for frontend communication
- **Static File Serving**: Serves tarot card images and frontend assets

## Notes

- The backend uses Google Gemini API for AI responses
- Sessions are stored as JSON files in the `data/sessions` directory
- Card images are served from the `static/images/tarot` directory


