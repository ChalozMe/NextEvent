# ── ETAPA 1: build ──────────────────────────────────────────────
# Imagen completa con JDK 21 + Maven, usada solo para compilar.
# Nunca llega a producción; se descarta al final del build.
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

# Copiamos primero solo el pom.xml para aprovechar el cache de capas
# de Docker: si el código cambia pero las dependencias no, esta capa
# de descarga no se vuelve a ejecutar.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Ahora sí copiamos el código fuente y compilamos el .jar
COPY src ./src
RUN mvn package -DskipTests -B

# ── ETAPA 2: runtime ────────────────────────────────────────────
# Imagen mínima: solo JRE (sin Maven, sin JDK de compilación).
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copiamos únicamente el .jar ya construido desde la etapa builder.
COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
