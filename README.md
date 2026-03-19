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
- Pipeline básico de CI/CD.

---

## 1. Descripción general

- **Auth Service**: administra registro, login, hash de contraseñas y emisión/validación de JWT.
- **Products Service**: administra el catálogo de productos.
- **Orders Service**: administra la creación y consulta de órdenes.

Además, el entorno incluye:

- **Nginx** como *API Gateway*.
- **PostgreSQL**, con una base de datos independiente por servicio.
- **Docker Compose** para la ejecución local.
- **Swagger** y **Postman** para documentación y pruebas de API.

---

## 2. Arquitectura del sistema

El sistema sigue una arquitectura de microservicios con separación por contexto de negocio.

### `products-service`
- Responsable del catálogo de productos.
- Permite crear, listar y consultar productos con paginación.
- Tiene su propia base de datos **PostgreSQL**.

### `orders-service`
- Responsable del dominio de órdenes.
- Permite crear órdenes validando información mediante consultas HTTP síncronas hacia el servicio de catálogo.
- Tiene su propia base de datos **PostgreSQL**.

### `auth-service`
- Responsable del registro e inicio de sesión de usuarios.
- Gestiona el cifrado hash de contraseñas.
- Emite y valida **JSON Web Tokens (JWT)**.
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
- No existen consultas SQL cruzadas entre servicios.
- La integridad entre órdenes y productos se controla a nivel de aplicación mediante el enlace lógico `productId`.

### Aislamiento de órdenes por usuario autenticado
Las órdenes se encuentran asociadas al usuario autenticado.  
Esto asegura aislamiento lógico entre clientes: un usuario no puede consultar ni modificar órdenes pertenecientes a otro usuario.  
La identidad del cliente se obtiene a partir del **JWT** enviado en la solicitud.

### Documentación adicional anexa
- **[Diagrama Entidad-Relación (MER)](/docs/diagrama-er.md)**

---

## 3. Escalabilidad, mantenibilidad y separación de responsabilidades

### Escalabilidad
Cada microservicio puede escalarse de forma horizontal independiente según su volumen de carga particular.  
El cliente solo interactúa con el API Gateway, lo que abstrae completamente y protege la topología oculta interna de la red de contenedores.

### Mantenibilidad
Cada servicio se acota en responsabilidades de dominio limitadas a una sola unidad de negocio.  
A nivel de código, se implementan principios de **Clean Architecture** y **DDD** (*Domain-Driven Design*) para aislar capas de: *Dominio, Aplicación, Infraestructura y Presentación*.

### Separación de responsabilidades
Los cambios en Products no afectan directamente la lógica ni la persistencia de Orders.
Esto facilita el mantenimiento, las pruebas aisladas y los despliegues independientes.

---

## 4. Diseño Cloud y simulación local con Docker

Para este entregable se optó por una simulación local basada en contenedores Docker, que representa de forma práctica un entorno de despliegue distribuido.

- La plataforma se compone de los siguientes elementos:

- Un contenedor para products-service.

- Un contenedor para orders-service.

- Un contenedor para nginx como gateway.

- Dos contenedores PostgreSQL, uno por servicio.

---

## 5. Comunicación entre microservicios

El flujo de la petición es así:

1. El cliente envía la solicitud al API Gateway por el puerto 8080.

2. Nginx enruta la petición al microservicio correspondiente.

3. Cuando se crea una orden, orders-service consulta a products-service para validar la información del producto.

4. products-service responde con los datos necesarios para la validación.

5. Si la validación es exitosa, orders-service calcula el total y registra la orden en su base de datos.
---

## 6. Persistencia y modelo de datos

- products-service utiliza una base de datos PostgreSQL propia.

- orders-service utiliza una base de datos PostgreSQL independiente.

 No existen claves foráneas físicas entre ambas bases de datos. La relación entre dominios se maneja mediante una referencia lógica (productId) validada a nivel de aplicación.

---

## 7. Configuración por ambientes

Las variables de entorno de cada microservicio se encuentran en archivos .env.

Cada servicio incluye su archivo de ejemplo:

- services/products-service/.env.example

- services/orders-service/.env.example

Entre las variables más importantes se encuentran:

- Puerto de ejecución del servicio.

- DATABASE_URL para la conexión a la base de datos.

- URL de otros microservicios para la comunicación interna.

---

## 8. Instalación y ejecución local

### Pre-requisitos indispensables
- Docker instalado y funcionando.

- Docker Compose disponible en terminal.

- Puerto   8080 libre.

### Pasos de Arranque 

1. **Clonar e Ingresar al Repositorio de trabajo:**
   ```bash
   git clone https://github.com/GermanDev7/api-ecommerce-prueba
   cd api-ecommerce-prueba
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp services/products-service/.env.example services/products-service/.env
   cp services/orders-service/.env.example services/orders-service/.env
   ```

3. **Levantar el entorno  :**
   ```bash
   docker-compose up -d --build
   ```

4. **Verificar contenedores:**
   ```bash
   docker-compose ps
   ```

 - Una vez finalizado el proceso, la API estará disponible en:

http://localhost:8080



---

## 9. Documentación y pruebas de API

### Swagger
La documentación OpenAPI está disponible en:
- **[http://localhost:8080/api/docs](http://localhost:8080/api/docs)**

### Colección de Postman Genérica
Se incluye una colección de Postman para probar los endpoints del sistema:
- **`postman/ecommerce-api-collection.json`**

---

## 10. Pipeline automatizado de Verificación y de CI/CD

El pipeline de CI está definido en:
- Ruta Raíz: **`.github/workflows/ci.yml`**

### Etapas del flujo
El flujo automatizado ejecuta las siguientes etapas para validar la calidad del proyecto antes de un posible despliegue:

- Inicializa el entorno de ejecución.

- Descarga el código del repositorio.

- Configura la versión de Node.js requerida.

- Instala las dependencias del proyecto.

- Genera los clientes de Prisma.

- Ejecuta el linter.

- Compila los módulos del sistema.

- Ejecuta las pruebas unitarias.

- Construye la imagen Docker para simular el despliegue.

- Ejecuta tareas finales de cierre del job.

---

## 11. Decisiones técnicas de ingeniería 

### DDD 
Se utilizo DDD para dividir el proyecto en modulos de negocio.

### Clean Architecture
Dividi el proyecto en capas:
- `domain` 
- `application` 
- `infrastructure` 
- `presentation`

Esto permite una mejor separación de responsabilidades y menor acoplamiento entre capas.

### Módulo compartido transversal (@ecommerce/shared)
Se creó un módulo compartido para centralizar elementos reutilizables entre servicios, como manejo de excepciones, filtros HTTP globales y utilidades comunes como paginación. Esto evitó duplicación de código y mejoró la consistencia del sistema.

### Manejo de Prisma en el monorepo
Cada servicio del monorepo maneja su propia configuración y su propio cliente de Prisma. Esto evita conflictos entre módulos y mejora el aislamiento entre servicios y sus respectivas bases de datos.

---

## 12. Estructura Exacta de Enrutamientos (FileSystem Root General)

```text
.
├── api-gateway/            # Configuración de Nginx como API Gateway
├── docs/                   # Diagramas y documentación adicional
├── postman/                # Colección de Postman
├── libs/                   
│   └── shared/             # Código compartido entre servicios
├── services/               
│   ├── orders-service/     # Microservicio de órdenes
│   └── products-service/   # Microservicio de productos
├── docker-compose.yml      # Orquestación local de contenedores
├── package.json            # Configuración raíz del monorepo
└── .github/
    └── workflows/          # Pipeline de CI con GitHub Actions.
```

---

## 13. Entregables Base de Desarrollo Adicionalmente Cubiertos

- **Aplicación Frontend Local:** cliente en React para consumir la API a través del gateway.
Repositorio: **[React E-Commerce Client](https://github.com/GermanDev7/front-ecommerce-2026)**
- Colecciones para pruebas en postman  hacia el API Gateway `8080`).
- Diagrama entidad-relación del modelo de datos.
- Uso de Git y convenciones de commits durante el desarrollo.
