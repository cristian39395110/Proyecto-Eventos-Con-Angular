Backend con Node.js - Proyecto de Gestión de Eventos
Este proyecto es el backend para una aplicación de gestión de eventos, desarrollado en Node.js con Express y MySQL como base de datos, creado como parte del Bootcamp de la Universidad de La Punta (ULP).

🚀 Funcionalidades
Gestión de Usuarios:
Registro y autenticación de usuarios.
Roles (organizador, usuario regular) para gestionar permisos.
Gestión de Eventos:
Crear, actualizar, eliminar y listar eventos.
Asociar imágenes a eventos.
Inscripción a Eventos:
Registro de asistentes a los eventos.
Confirmación y control de asistencia.
Certificados:
Generación y consulta de certificados para usuarios asistentes.

🛠️ Tecnologías Utilizadas
Backend: Node.js con Express.
Base de Datos: MySQL.
ORM: Sequelize.
Autenticación: JSON Web Tokens (JWT).
Middleware:
Multer para la subida de imágenes.
CORS para habilitar peticiones desde el frontend.
Frontend: Repositorio del Frontend.

🔧 Instalación y Configuración
Clona este repositorio:git clone https://github.com/cristian39395110/Proyecto-Eventos-Con-Node.git
cd Proyecto-Eventos-Con-Node

Instala las dependencias:npm install

Configura la base de datos:
Crea una base de datos en MySQL llamada gestion_eventos (o ajusta el nombre en /src/config/database.js).

Ejecuta las migraciones y seeders con Sequelize:
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

Configura las variables de entorno: Crea un archivo .env en la raíz del proyecto con las siguientes variables:
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=eventos
JWT_SECRET=clave_secreta_para_jwt
PORT=3000

Ejecuta el servidor:npm start

Accede a la API:

El servidor estará disponible en http://localhost:3000.

📬 Contacto
Autor: Cristian
Email: cristian39395110@gmail.com





