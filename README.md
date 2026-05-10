[![CI Tests](https://github.com/ULL-ESIT-INF-DSI-2526/grp02-medcore-api-groupg/actions/workflows/ci.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2526/grp02-medcore-api-groupg/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2526/grp02-medcore-api-groupg/badge.svg?branch=develop)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2526/grp02-medcore-api-groupg?branch=develop)

# MedCore API

## Descripción

MedCore API es una API REST para gestionar pacientes, personal sanitario, medicamentos y registros médicos.
Incluye operaciones CRUD completas y validaciones clínicas básicas.

## API desplegada en Render

https://grp02-medcore-api-groupg.onrender.com

## Instalación

### 1. Clonar repositorio

```bash
git clone https://github.com/ULL-ESIT-INF-DSI-2526/grp02-medcore-api-groupg.git
cd grp02-medcore-api-groupg
```

### 2. Instalar dependencias

```bash
npm install
```

## Modo de empleo

### Asegurarse de tener Mongodb corriendo en su máquina local

```bash
sudo /home/usuario/mongodb/bin/mongod --dbpath /home/usuario/mongo-data/
```

### Iniciar la API en modo desarrollo

```bash
npm run dev
```
Tras esto se realizaran las consultas sobre http://localhost:3000

### Ejecutar tests

(También asegurarse de tener Mongodb corriendo en su máquina local)

```bash
npm test
```
