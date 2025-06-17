# ====== Build Stage ======
FROM maven:3.9-eclipse-temurin-17 AS builder

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Package the application (skip tests)
RUN mvn clean package -DskipTests

# ====== Runtime Stage ======
FROM eclipse-temurin:17-jre-alpine

# Add curl for health check
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Create a non-root user
RUN addgroup -g 1001 -S spring && \
    adduser -S spring -u 1001

# Copy the built JAR from builder
COPY --from=builder /app/target/*.jar app.jar

# Change ownership
RUN chown -R spring:spring /app

# Switch to non-root user
USER spring

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Start app
ENTRYPOINT ["java", "-jar", "app.jar"]
