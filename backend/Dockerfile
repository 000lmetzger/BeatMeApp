# 1️⃣ Java Runtime-Image (LTS)
FROM eclipse-temurin:21-jdk AS build

# 2️⃣ Arbeitsverzeichnis im Container
WORKDIR /app

# 3️⃣ Projektdateien kopieren
COPY . .

# 4️⃣ Build mit Gradle (Wrapper nutzen)
RUN ./gradlew clean build -x test

# -------------------------------------------------------------

# 5️⃣ Neues leichtes Runtime-Image
FROM eclipse-temurin:21-jre

WORKDIR /app

# 6️⃣ Jar-Datei aus dem Build-Container kopieren
COPY --from=build /app/build/libs/*.jar app.jar

# 7️⃣ Port, den Spring Boot verwendet
EXPOSE 8080

# 8️⃣ Startbefehl
ENTRYPOINT ["java", "-jar", "app.jar"]
