# =================================================================================
# FASE 1: Construcción (Build Stage)
#
# En esta etapa, usamos una imagen completa con JDK y Maven para compilar
# nuestro proyecto y generar el archivo .jar ejecutable.
# =================================================================================
FROM eclipse-temurin:17-jdk AS build

# Establecemos el directorio de trabajo dentro del contenedor.
# Todos los comandos siguientes se ejecutarán desde /app.
WORKDIR /app

# --- Optimización de Caché de Docker ---
# 1. Copiamos solo los archivos necesarios para descargar dependencias.
# Si el pom.xml no cambia, Docker reutilizará esta capa en futuras construcciones,
# haciendo el proceso mucho más rápido.
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# 2. Damos permisos de ejecución al Maven Wrapper.
# Esencial para poder ejecutarlo en un entorno Linux como el de Docker.
RUN chmod +x mvnw

# 3. Descargamos todas las dependencias del proyecto.
# Usamos el wrapper en lugar de 'mvn'.
RUN ./mvnw dependency:go-offline

# 4. Ahora copiamos el resto del código fuente.
# Si solo cambias el código Java, Docker solo re-ejecutará desde aquí.
COPY src ./src

# 5. Compilamos el proyecto, empaquetamos el .jar y saltamos los tests.
# Usamos el wrapper. Como las dependencias ya están descargadas, este paso es rápido.
RUN ./mvnw clean package -DskipTests


# =================================================================================
# FASE 2: Ejecución (Execution Stage)
#
# En esta etapa, usamos una imagen mucho más ligera que solo contiene
# el entorno de ejecución de Java (JRE), ya que no necesitamos compilar nada más.
# Esto hace que nuestra imagen final sea segura y pequeña.
# =================================================================================
FROM eclipse-temurin:17-jre-jammy

# Establecemos el directorio de trabajo.
WORKDIR /app

# Copiamos ÚNICAMENTE el archivo .jar que se generó en la etapa de 'build'.
# El `*` es un comodín que funciona aunque el nombre o la versión del .jar cambie.
COPY --from=build /app/target/*.jar app.jar

# Exponemos el puerto en el que corre nuestra aplicación Spring Boot.
# Asegúrate de que este número coincida con el `server.port` de tu `application.properties`.
# Si no especificas ninguno, por defecto es 8080.
EXPOSE 8085

# El comando que se ejecutará cuando el contenedor se inicie.
# Esto arranca la aplicación Spring Boot.
ENTRYPOINT ["java", "-jar", "app.jar"]