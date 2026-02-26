# How to Run the Java Backend

## Prerequisites

You have Java 21 installed ✓

## Option 1: Install Maven (Recommended)

### On macOS (using Homebrew):
```bash
brew install maven
```

### Verify installation:
```bash
mvn -version
```

## Option 2: Use Maven Wrapper (No Installation Needed)

I'll create a Maven wrapper for you so you don't need to install Maven separately.

## Setup Steps

### 1. Set Environment Variable

You need to set your Google Gemini API key. You can do this in several ways:

**Option A: Export in terminal (temporary):**
```bash
export GOOGLE_API_KEY=your_api_key_here
```

**Option B: Create a `.env` file (recommended):**
Create a file called `.env` in the backend directory:
```
GOOGLE_API_KEY=your_api_key_here
```

Note: The Java backend doesn't automatically read `.env` files like Python does. You'll need to either:
- Use environment variables, or
- Modify `application.properties` to read from a file

### 2. Build the Project

```bash
cd "/Users/adinaadilova/Desktop/Tarot_project 3/backend"
mvn clean package
```

Or if using Maven wrapper:
```bash
./mvnw clean package
```

### 3. Run the Application

**Option A: Using Maven (development):**
```bash
mvn spring-boot:run
```

**Option B: Run the JAR file:**
```bash
java -jar target/tarot-backend-1.0.0.jar
```

**Option C: Using Maven wrapper:**
```bash
./mvnw spring-boot:run
```

### 4. Verify It's Running

The server will start on `http://localhost:5000`

Test it:
```bash
curl http://localhost:5000/api/tarot-cards
```

## Quick Start (All in One)

If Maven is installed:
```bash
cd "/Users/adinaadilova/Desktop/Tarot_project 3/backend"
export GOOGLE_API_KEY=your_api_key_here
mvn spring-boot:run
```

## Troubleshooting

### Maven not found?
- Install with: `brew install maven`
- Or use the Maven wrapper (I'll set it up for you)

### Port 5000 already in use?
- Change the port in `src/main/resources/application.properties`
- Or stop the process using port 5000

### API Key issues?
- Make sure GOOGLE_API_KEY is set
- Check that the API key is valid
- The key should be set before starting the application

