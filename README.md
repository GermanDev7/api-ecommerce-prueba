# E-Commerce Microservices API

Plataforma de e-commerce construida como prueba técnica con una arquitectura de microservicios usando **NestJS**, **Prisma**, **PostgreSQL**, **Docker** y **Nginx**.  
La solución está compuesta por tres microservicios principales: **auth-service**, **products-service** y **orders-service**.

## Objetivo

El proyecto busca demostrar:

- Diseño de arquitectura backend con microservicios.
- Separación por contexto de negocio: autenticación, productos y órdenes.
- Protección de endpoints mediante JWT.
- Aislamiento lógico de datos por usuario autenticado.
- Simulación de despliegue local con contenedores.
- Implementación de principios REST.
- Pipeline básico de integración continua.

---

## 1. Descripción general

La solución está compuesta por tres microservicios principales:

- **Auth Service**: administra el registro, login, cifrado hash de contraseñas y emisión/validación de JWT.
- **Products Service**: administra el catálogo de productos e inventario.
- **Orders Service**: administra la creación y consulta de órdenes asociadas al usuario autenticado.

Además, el entorno incluye:

- **Nginx** como *API Gateway* y punto único de entrada.
- **PostgreSQL**, con una base de datos independiente por servicio.
- **Docker Compose** para la ejecución local del entorno completo.
- **Swagger** y **Postman** para documentación y pruebas de API.

---

## 2. Arquitectura del sistema

El sistema sigue una arquitectura de microservicios con separación por contexto de negocio y persistencia aislada por servicio.

### `auth-service`
- Responsable del registro e inicio de sesión de usuarios.
- Gestiona el cifrado hash de contraseñas.
- Emite y valida **JSON Web Tokens (JWT)**.
- Tiene su propia base de datos **PostgreSQL**.

### `products-service`
- Responsable del catálogo de productos e inventario.
- Permite crear, listar y consultar productos con paginación.
- Tiene su propia base de datos **PostgreSQL**.

### `orders-service`
- Responsable del dominio de órdenes.
- Permite crear y consultar órdenes.
- Requiere autenticación para los endpoints protegidos.
- Asocia cada orden al usuario autenticado extraído desde el JWT.
- Consulta información del producto mediante comunicación HTTP con `products-service`.
- Tiene su propia base de datos **PostgreSQL**.

### API Gateway (`nginx`)
- Es el único punto de entrada al sistema.
- Expone el puerto `8080`.
- Enruta las solicitudes transparentemente hacia:
  - `/api/v1/auth`
  - `/api/v1/products`
  - `/api/v1/orders`

### Bases de datos separadas
- Cada microservicio gestiona su propia persistencia.
- Existen tres bases de datos PostgreSQL independientes:
  - una para autenticación,
  - una para productos,
  - una para órdenes.
- No existen consultas SQL cruzadas entre servicios.
- La integridad entre dominios se controla a nivel de aplicación mediante comunicación HTTP y referencias lógicas.

### Aislamiento de órdenes por usuario autenticado
Las órdenes se encuentran asociadas al usuario autenticado.  
Esto asegura aislamiento lógico entre clientes: un usuario no puede consultar ni modificar órdenes pertenecientes a otro usuario.  
La identidad del cliente se obtiene a partir del **JWT** enviado en la solicitud.

### Documentación adicional anexa
- **[Diagrama Entidad-Relación (MER)](/docs/diagrama-er.md)**

---

## 3. Escalabilidad, mantenibilidad y separación de responsabilidades

### Escalabilidad
Cada microservicio puede escalarse de forma horizontal e independiente según su volumen de carga particular.  
El cliente solo interactúa con el API Gateway, lo que abstrae la topología interna de la red de contenedores y simplifica la exposición del sistema.

### Mantenibilidad
Cada servicio se acota a una sola responsabilidad de negocio.  
La incorporación de un `auth-service` evita mezclar lógica de identidad y seguridad con los dominios de catálogo y órdenes.  
Esto mejora la mantenibilidad del sistema, ya que los cambios en autenticación no requieren modificar directamente la lógica interna de productos u órdenes.

A nivel de código, se aplican principios de **Clean Architecture** y **DDD** (*Domain-Driven Design*) para aislar capas de **Dominio, Aplicación, Infraestructura y Presentación**.

### Separación de responsabilidades
Los cambios en un servicio no impactan directamente la lógica ni la persistencia de los demás.  
Esto facilita el mantenimiento, las pruebas aisladas y los despliegues independientes.

- **Auth Service** concentra la identidad, autenticación y emisión de tokens.
- **Products Service** concentra exclusivamente la lógica de catálogo e inventario.
- **Orders Service** concentra la lógica de compra y persistencia de órdenes.
---

## 4. Diseño Cloud y simulación local con Docker

Para este entregable se optó por una simulación local basada en contenedores Docker, que representa de forma práctica un entorno de despliegue distribuido.

La plataforma se compone de los siguientes elementos:

- Un contenedor para `auth-service`.
- Un contenedor para `products-service`.
- Un contenedor para `orders-service`.
- Un contenedor para `nginx` como API Gateway.
- Tres contenedores PostgreSQL, uno por cada microservicio.

---

## 5. Comunicación entre microservicios

El sistema ha sido orquestado bajo un modelo de comunicación **HTTP REST**, protección mediante **JWT** y aislamiento lógico por usuario autenticado.

El ciclo de vida de una operación protegida, como la creación de una orden, funciona así:

1. **Autenticación (emisión del JWT):**  
   El cliente inicia sesión en `auth-service` y recibe un **JWT** firmado criptográficamente, confirmando su identidad dentro del sistema.

2. **Consumo seguro de rutas protegidas:**  
   Para crear o consultar órdenes, el cliente debe enviar el token en la solicitud.  
   El sistema valida el JWT antes de permitir el acceso al flujo interno del dominio.

3. **Validación síncrona del producto:**  
   Al crear una orden, `orders-service` consulta en tiempo real a `products-service` para validar:
   - existencia del producto,
   - precio vigente,
   - disponibilidad de stock.

4. **Registro transaccional de la orden:**  
   Si la validación es exitosa, `orders-service` calcula el total y registra la orden en su propia base de datos, asociándola al usuario autenticado.

5. **Descuento de inventario desacoplado (*fire-and-forget*):**  
   Una vez registrada la orden, el sistema dispara la actualización de inventario hacia `products-service` de forma desacoplada.  
   Esto permite desacoplar parcialmente la confirmación de la compra respecto a la actualización del inventario y mejora el tiempo de respuesta percibido por el cliente.
---

## 6. Persistencia y modelo de datos

- `auth-service` utiliza una base de datos PostgreSQL propia para usuarios y credenciales.
- `products-service` utiliza una base de datos PostgreSQL propia para el catálogo e inventario.
- `orders-service` utiliza una base de datos PostgreSQL propia para órdenes e ítems de orden.

No existen claves foráneas físicas entre bases de datos.  
Las relaciones entre dominios se manejan mediante referencias lógicas y validaciones a nivel de aplicación.

---

## 7. Configuración por ambientes

El proyecto puede ejecutarse de dos formas:

### Ejecución orquestada con Docker
Cuando el sistema se levanta mediante `docker-compose` o `npm start`, **no es necesario crear manualmente archivos `.env`**.  
Las variables de entorno ya se encuentran definidas dentro de la orquestación, permitiendo que el evaluador pueda clonar, levantar y probar la plataforma sin configuración adicional.

### Ejecución nativa por servicio
Si se desea correr un microservicio de forma individual fuera de Docker, sí es necesario contar con el archivo `.env` físico dentro de la carpeta correspondiente del servicio.

Cada microservicio incluye su archivo de ejemplo:

- `services/auth-service/.env.example`
- `services/products-service/.env.example`
- `services/orders-service/.env.example`

Entre las variables más importantes se encuentran:

- Puerto de ejecución del servicio.
- `DATABASE_URL` para la conexión a la base de datos.
- Secret de firma para JWT.
- URLs internas para comunicación entre microservicios.

---

## 8. Instalación y ejecución local

### Pre-requisitos indispensables
- Docker instalado y funcionando.
- Docker Compose disponible en terminal.
- Puerto `8080` libre.

### Pasos de Arranque 

1. **Clonar e Ingresar al Repositorio de trabajo:**
   ```bash
   git clone https://github.com/GermanDev7/api-ecommerce-prueba
   cd api-ecommerce-prueba
   ```

2. **Levantar el entorno  :**
   ```bash
  npm start
   ```

3. **Verificar contenedores:**
   ```bash
   docker-compose ps
   ```

 - Una vez finalizado el proceso, la API estará disponible en:

http://localhost:8080

### Scripts disponibles

- `npm start`: levanta toda la plataforma con Docker.
- `npm stop`: detiene el entorno local.
- `npm run start:fresh`: reinicia completamente el entorno eliminando volúmenes.
- `npm run test:all`: ejecuta las pruebas de todos los workspaces.
- `npm run build:all`: compila todos los módulos del monorepo.
- `npm run lint:all`: ejecuta lint sobre todos los workspaces.
- `npm run postinstall`: genera los clientes de Prisma de todos los servicios.



---

## 9. Credenciales y datos de prueba

El proyecto incluye datos base para facilitar la validación funcional del sistema.

### Usuarios preconfigurados
- `admin@ecommerce.com` / `admin123`
- `customer@ecommerce.com` / `customer123`

### Productos semilla
Se cargan automáticamente productos de ejemplo para realizar pruebas de consulta y creación de órdenes.

---

## 10. Documentación y pruebas de API

### Swagger

La documentación OpenAPI está disponible en:

- **[http://localhost:8080/api/docs](http://localhost:8080/api/docs)**

La documentación Swagger se expone a través del API Gateway y cubre los módulos de:

- autenticación,
- productos,
- órdenes.

Los endpoints protegidos requieren autenticación mediante **Bearer Token**.

### Colección de Postman
Se incluye una colección de Postman para probar los endpoints del sistema:

- **`postman/ecommerce-api-collection.json`**
---

## 11. Pipeline automatizado de CI/CD

El pipeline de integracion continua está definido en:

- **`.github/workflows/ci.yml`**

### Alcance del pipeline
El pipeline valida la calidad del código del monorepo, incluyendo los tres microservicios del sistema:

- `auth-service`
- `products-service`
- `orders-service`

El flujo automatizado contempla tareas de linting, compilación y pruebas unitarias.  
Las migraciones y el aprovisionamiento real de bases de datos se delegan al arranque del entorno containerizado mediante Docker.

### Etapas del flujo
El pipeline ejecuta las siguientes tareas:

- Inicializa el entorno de ejecución.
- Descarga el código del repositorio.
- Configura la versión de Node.js requerida.
- Instala las dependencias del proyecto.
- Genera los clientes de Prisma.
- Ejecuta el linter.
- Compila los servicios del sistema.
- Ejecuta las pruebas unitarias.
- Construye la imagen Docker para validar el empaquetado del entorno.

---

## 12. Decisiones técnicas de ingeniería 

### DDD
Se utilizó **DDD** para dividir el proyecto en módulos alineados a contextos de negocio: autenticación, productos y órdenes.

### Clean Architecture
El proyecto se estructuró en capas:

- `domain`
- `application`
- `infrastructure`
- `presentation`

Esto permite una mejor separación de responsabilidades, menor acoplamiento entre capas y mayor facilidad de mantenimiento.

### Autenticación y autorización
Se incorporó un `auth-service` dedicado para centralizar el registro, login, hash de contraseñas y emisión de **JWT**.  
Esto evita acoplar lógica de seguridad dentro de los servicios de negocio y permite proteger endpoints de forma consistente.

### Aislamiento por identidad
Las órdenes quedan asociadas al usuario autenticado, lo que permite restringir el acceso a los recursos según la identidad extraída desde el token.  
Esto mejora la seguridad y refleja un escenario más cercano a un e-commerce real.

### Módulo compartido transversal (`@ecommerce/shared`)
Se creó un módulo compartido para centralizar elementos reutilizables entre servicios, como manejo de excepciones, filtros HTTP globales y utilidades comunes.  
Esto evitó duplicación de código y mejoró la consistencia del sistema.

### Manejo de Prisma en el monorepo
Cada servicio del monorepo maneja su propia configuración y su propio cliente de Prisma.  
Esto evita conflictos entre módulos y mejora el aislamiento entre servicios y sus respectivas bases de datos.

---

## 13. Estructura Exacta de Enrutamientos

```text
.
├── api-gateway/            # Configuración de Nginx como API Gateway
├── docs/                   # Diagramas 
├── postman/                # Colección de Postman
├── libs/
│   └── shared/             # Código compartido entre servicios
├── services/
│   ├── auth-service/       # Microservicio de autenticación
│   ├── orders-service/     # Microservicio de órdenes
│   └── products-service/   # Microservicio de productos
├── docker-compose.yml      # Orquestación local de contenedores
├── package.json            # Configuración raíz del monorepo
└── .github/
    └── workflows/          # Pipeline de CI con GitHub Actions
```

---

## 14. Entregables Adicionales

- **Aplicación Frontend Local:** cliente en React para consumir la API a través del gateway.  
  Repositorio: **[React E-Commerce Client](https://github.com/GermanDev7/front-ecommerce-2026)**

- Colección Postman para consumir endpoints públicos y protegidos.
- Diagrama entidad-relación del modelo de datos.
- Datos semilla para pruebas funcionales.
- Uso de Git y convenciones de commits durante el desarrollo.
