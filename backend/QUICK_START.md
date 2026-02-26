# Quick Start Guide

✅ **Good news!** Your API key is already configured in the `.env` file. The application will automatically load it.

## Step 1: Navigate to Backend Directory

```bash
cd "/Users/adinaadilova/Desktop/Tarot_project 3/backend"
```

## Step 2: Run the Application

**Option A: Use the startup script (easiest):**
```bash
./start.sh
```

**Option B: Run with Maven directly:**
```bash
mvn spring-boot:run
```

**Note:** The `.env` file is automatically loaded, so you don't need to manually set environment variables!

## That's it! 

The server will start on **http://localhost:5000**

You'll see output like:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v3.2.0)
...
Started TarotApplication in X.XXX seconds
```

## Test It

Open another terminal and test:
```bash
curl http://localhost:5000/api/tarot-cards
```

## Alternative: Run as JAR

If you want to build and run as a JAR file:

```bash
# Build
mvn clean package

# Run
java -jar target/tarot-backend-1.0.0.jar
```

## To Stop

Press `Ctrl+C` in the terminal where the server is running.

