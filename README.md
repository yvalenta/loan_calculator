# Simulador de Abonos a Capital - Crédito Hipotecario

Un simulador financiero interactivo y premium diseñado para evaluar de manera visual e intuitiva el impacto de los abonos extraordinarios (únicos y mensuales recurrentes) en los créditos de vivienda. Permite proyectar el ahorro total en intereses y la reducción de tiempo o cuota mensual.

---

## Características Principales

*   **Parámetros Dinámicos**: Configuración del saldo restante, tasa Efectiva Anual (EA), cuota mensual regular, costo de seguros y aportes extra con controles deslizantes (*sliders*) integrados.
*   **Doble Escenario de Simulación**:
    *   **Reducción de Plazo (Recomendado)**: Recorta la duración total del crédito manteniendo la cuota estable.
    *   **Reducción de Cuota**: Recalcula y disminuye el pago mensual obligatorio manteniendo el plazo original.
*   **Simulación de Abonos Extra**:
    *   **Abono Único Inmediato**: Pago extraordinario a capital aplicado en el mes 0.
    *   **Abono Mensual Recurrente**: Aporte adicional constante realizado mes a mes (ej: $50,000 COP) para acelerar la amortización.
*   **Visualización de Métricas Innovadora**:
    *   **Barra de Progreso Temporal**: Muestra visualmente la porción de meses recortados en color verde esmeralda.
    *   **Distribuidor de Intereses**: Visualiza la proporción de intereses que el usuario evita pagar frente al escenario base.
*   **Gráfico de Áreas Comparativo**: Superpone el saldo proyectado del *Escenario Base* (sin abonos extra) contra el *Escenario Acelerado* (con abonos) a lo largo del tiempo, acompañado de un tooltip interactivo para comparar la diferencia de capital liberado mes a mes.
*   **Tabla de Amortización Detallada**: Historial cuota a cuota que detalla: Mes, Pago Total, Intereses, Abono Capital Regular, Abono Extra, Seguros y Saldo Restante.

---

## Tecnologías y Versiones

La aplicación está construida sobre una pila moderna y optimizada:

| Tecnología | Versión | Descripción |
| :--- | :--- | :--- |
| **React** | `^19.2.7` | Biblioteca para la interfaz de usuario (React 19) |
| **Vite** | `^8.1.0` | Herramienta de compilación rápida (*bundler*) |
| **TypeScript** | `~6.0.2` | Tipado estático y robustez del código |
| **Tailwind CSS** | `^3.4.19` | Framework de diseño utilitario para estilos |
| **Recharts** | `^3.9.0` | Biblioteca de gráficos interactivos y reactivos |
| **Lucide React** | `^1.21.0` | Iconografía fina y moderna |
| **pnpm** | `-` | Gestor de paquetes ultrarrápido |

---

## Requisitos Previos

Asegúrate de tener instalado:
*   [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
*   [pnpm](https://pnpm.io/) (instalable globalmente con `npm install -g pnpm`)
*   *(Opcional)* [Docker](https://www.docker.com/) si deseas ejecutarlo en contenedores

---

## Instalación y Ejecución Local

1.  **Instalar dependencias**:
    ```bash
    pnpm install
    ```

2.  **Iniciar el servidor de desarrollo**:
    ```bash
    pnpm dev
    ```
    La aplicación estará disponible por defecto en `http://localhost:5173/`.

3.  **Compilar para producción**:
    ```bash
    pnpm build
    ```
    Esto empaquetará la aplicación optimizada dentro de la carpeta `/dist`.

4.  **Previsualizar producción**:
    ```bash
    pnpm preview
    ```

---

## Ejecución con Docker

El proyecto incluye un entorno preconfigurado con Nginx para servir el build estático.

1.  **Compilar y levantar con Docker Compose**:
    ```bash
    docker-compose up --build
    ```
    La aplicación se servirá en el puerto `8080` (ej: `http://localhost:8080/`).

2.  **Detener contenedores**:
    ```bash
    docker-compose down
    ```
