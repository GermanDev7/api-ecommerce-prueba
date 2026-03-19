# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.3.3](https://github.com/GermanDev7/api-ecommerce-prueba/compare/v1.3.2...v1.3.3) (2026-03-19)


### Bug Fixes

* **docs:** aggregate unified Swagger UI dropdown ([56e9d60](https://github.com/GermanDev7/api-ecommerce-prueba/commit/56e9d600f916ee078f6c7669dfe5cd42e35f3a43))

## [1.3.2](https://github.com/GermanDev7/api-ecommerce-prueba/compare/v1.3.1...v1.3.2) (2026-03-19)


### Bug Fixes

* fix links and enhance aditional documentation ([4db8b1d](https://github.com/GermanDev7/api-ecommerce-prueba/commit/4db8b1da9041c346db4cb0bf548eb647fc217b29))

## [1.3.1](https://github.com/GermanDev7/api-ecommerce-prueba/compare/v1.3.0...v1.3.1) (2026-03-19)

## [1.3.0](https://github.com/GermanDev7/api-ecommerce-prueba/compare/v1.2.0...v1.3.0) (2026-03-19)


### Features

* **core:** implement  refactoring- Fix Jest unit tests by virtualizing module mappings and decoupling use cases- Standardize business domain exceptions mapped to HTTP 422 Unprocessable Entity- Enhance Postman configurations - Adapt production databases to Prisma migrate deploy replacing db push- Enforce strict Order tenant isolation using stateless JWT properties- Bootstrap default environments via Prisma seeding - Expand NPM workspace definitions enforcing 'start:fresh' evaluation macro- Finalize localized error string mappings mirroring strictly typed domain errors ([fd5d81b](https://github.com/GermanDev7/api-ecommerce-prueba/commit/fd5d81b3cf616f9baeb256bdad34457933d91d5e))
* **core:** implement shared pagination, env templates, and automated docker database migrations ([81291ea](https://github.com/GermanDev7/api-ecommerce-prueba/commit/81291ea7db83fc788dd4c23d96dd327d1dc85efb))
* **core:** implement shared pagination, env templates, and automated docker database migrations ([d534209](https://github.com/GermanDev7/api-ecommerce-prueba/commit/d534209b7dd54351a203261e9eec67dffefee5be))


### Bug Fixes

* **ci:** switch from npm ci to npm install and update package lock ([d2d8c90](https://github.com/GermanDev7/api-ecommerce-prueba/commit/d2d8c9008379840ecc9ed8d4b33947b4ddb88819))
* **core:** export PrismaService to resolve DI failures in HealthController ([ae42ac6](https://github.com/GermanDev7/api-ecommerce-prueba/commit/ae42ac62540b2aaa8cb0026b1a9e96fc3434dded))
* **prisma:** scope generated client paths to resolve module not found errors ([7412794](https://github.com/GermanDev7/api-ecommerce-prueba/commit/7412794e8fa5328235a56ae4c720668b6852afdd))

## 1.2.0 (2026-03-18)


### Features

* **backends:** implement Domain, Application, and Persistence logic for Orders and Products services ([adab5c8](https://github.com/GermanDev7/api-ecommerce-prueba/commit/adab5c8caeb470704e8d5debb15f462f1cb8c474))
* **orders:** add application layer (use cases and ports) ([ced47c7](https://github.com/GermanDev7/api-ecommerce-prueba/commit/ced47c718594004b48f3ca9c979ee50a02f2a903))
* **orders:** add domain layer ([55257bc](https://github.com/GermanDev7/api-ecommerce-prueba/commit/55257bcf89436911944d2794df2c3ca1670738e4))
* **orders:** add infrastructure, presentation, config and health checks ([09e6b18](https://github.com/GermanDev7/api-ecommerce-prueba/commit/09e6b18de6d17436fce3db5cd3e851c348e879ff))
* **products:** add config validation, health checks, interceptors and test structure ([b501663](https://github.com/GermanDev7/api-ecommerce-prueba/commit/b501663cdb0b1b5b2f81a1b6be127947e65198ef))
* **products:** add domain, application, infrastructure and presentation layers ([0e6382e](https://github.com/GermanDev7/api-ecommerce-prueba/commit/0e6382e147f2324e12e3ada072a7819387b00586))
* **shared:** add technical utilities (prisma service, http exception filter) ([71df935](https://github.com/GermanDev7/api-ecommerce-prueba/commit/71df9353a4e5d2be9e24508a732409ad7c198882))


### Bug Fixes

* **ci:** add --yes flag to npx prisma for cloud runner environments ([b71c916](https://github.com/GermanDev7/api-ecommerce-prueba/commit/b71c9166eee237120b087aa39ba7e605968698b5))
* **ci:** replace hardcoded workspace iterations with strict if-present root aliases ([c54f298](https://github.com/GermanDev7/api-ecommerce-prueba/commit/c54f29817e16d35686a94af4dd5d0b04046addab))
* **lint:** resolve  strict typescript violations and ignore prisma generated bin ([ffe5d7f](https://github.com/GermanDev7/api-ecommerce-prueba/commit/ffe5d7f358685fe880a391085dc7a7acb14d9bfa))
* **tests:** resolve failing assertions on create-order  validations ([c07e8cf](https://github.com/GermanDev7/api-ecommerce-prueba/commit/c07e8cf4002a036a719066db4e37ea510f18e9a2))

## 1.1.0 (2026-03-18)


### Features

* **backends:** implement Domain, Application, and Persistence logic for Orders and Products services ([adab5c8](https://github.com/GermanDev7/api-ecommerce-prueba/commit/adab5c8caeb470704e8d5debb15f462f1cb8c474))
* **orders:** add application layer (use cases and ports) ([ced47c7](https://github.com/GermanDev7/api-ecommerce-prueba/commit/ced47c718594004b48f3ca9c979ee50a02f2a903))
* **orders:** add domain layer ([55257bc](https://github.com/GermanDev7/api-ecommerce-prueba/commit/55257bcf89436911944d2794df2c3ca1670738e4))
* **orders:** add infrastructure, presentation, config and health checks ([09e6b18](https://github.com/GermanDev7/api-ecommerce-prueba/commit/09e6b18de6d17436fce3db5cd3e851c348e879ff))
* **products:** add config validation, health checks, interceptors and test structure ([b501663](https://github.com/GermanDev7/api-ecommerce-prueba/commit/b501663cdb0b1b5b2f81a1b6be127947e65198ef))
* **products:** add domain, application, infrastructure and presentation layers ([0e6382e](https://github.com/GermanDev7/api-ecommerce-prueba/commit/0e6382e147f2324e12e3ada072a7819387b00586))
* **shared:** add technical utilities (prisma service, http exception filter) ([71df935](https://github.com/GermanDev7/api-ecommerce-prueba/commit/71df9353a4e5d2be9e24508a732409ad7c198882))


### Bug Fixes

* **ci:** add --yes flag to npx prisma for cloud runner environments ([b71c916](https://github.com/GermanDev7/api-ecommerce-prueba/commit/b71c9166eee237120b087aa39ba7e605968698b5))
* **ci:** replace hardcoded workspace iterations with strict if-present root aliases ([c54f298](https://github.com/GermanDev7/api-ecommerce-prueba/commit/c54f29817e16d35686a94af4dd5d0b04046addab))
* **lint:** resolve  strict typescript violations and ignore prisma generated bin ([ffe5d7f](https://github.com/GermanDev7/api-ecommerce-prueba/commit/ffe5d7f358685fe880a391085dc7a7acb14d9bfa))
* **tests:** resolve failing assertions on create-order  validations ([c07e8cf](https://github.com/GermanDev7/api-ecommerce-prueba/commit/c07e8cf4002a036a719066db4e37ea510f18e9a2))
