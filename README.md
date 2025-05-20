# GarmyShop 🛍️

**GarmyShop** es una tienda online de ropa desarrollada con un stack tecnológico moderno que incluye **React**, **Django**, **Spring Boot** y **Kotlin**. El proyecto está dividido en múltiples carpetas para organizar las distintas partes del sistema, incluyendo el frontend para usuarios, backend en Django, y servicios en Spring Boot.

## 📁 Estructura del Proyecto

GarmyShop/
├── user-frontend/
│ └── GarmyShopUser/ # Proyecto React (vista del usuario)
│ ├── public/
│ ├── src/
│ ├── package.json
│ └── ...
├── backend-django/ # API o administración en Django
├── backend-spring/ # Servicios en Spring Boot (Kotlin)
└── ...

python
Copiar
Editar

## 🚀 Vista de Usuario (Frontend en React)

La aplicación React que representa la vista del usuario está ubicada en:

user-frontend/GarmyShopUser

less
Copiar
Editar

### 🔧 Instalación

Asegúrate de tener instalado [Node.js](https://nodejs.org/).

Luego, sigue estos pasos para instalar las dependencias:

```bash
cd user-frontend/GarmyShopUser
npm install
npm install react-router-dom
▶️ Ejecutar en modo desarrollo
Para iniciar el servidor de desarrollo, ejecuta:

bash
Copiar
Editar
npm run dev
Esto levantará la aplicación en modo desarrollo. Normalmente estará disponible en http://localhost:5173