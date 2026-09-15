# Enlace B2B Local — Marketplace Industrial Metropolitano

Proyecto integrador de **Programación Web II — Grupo 053**

## Descripción

Enlace B2B Local es una plataforma web tipo marketplace que conecta a distribuidores de
insumos industriales con empresas compradoras **dentro del área metropolitana de Monterrey**.
Una fábrica o taller que se queda sin material puede encontrar en minutos quién lo tiene
disponible cerca y cerrar la compra desde el mismo sistema.

- **Búsqueda por cercanía:** los resultados se ordenan por distancia, no por precio.
- **Pensada para personal sin experiencia técnica:** tan sencilla como una app de entrega a domicilio.
- **Modelo de ingreso:** comisión configurable (2 % a 10 %) sobre cada venta concluida.

La plataforma tiene tres roles, cada uno con sus propias pantallas:

- **Comprador:** busca insumos, arma su carrito, genera pedidos y les da seguimiento.
- **Distribuidor:** administra catálogo e inventario, acepta pedidos y actualiza entregas.
- **Administrador:** verifica empresas, configura la comisión, supervisa transacciones y consulta reportes.

**Cuentas de prueba** (contraseña de todas: `demo1234`):

| Rol | Correo |
|---|---|
| Comprador | `compras@aceros-delnorte.mx` |
| Distribuidor | `ventas@refacciones-gm.mx` |
| Administrador | `admin@enlaceb2b.mx` |
| Empresa pendiente de verificación | `ventas@bvpacifico.mx` |

## Carpetas

| Carpeta / archivo | Contenido |
|---|---|
| `index.html` | Punto de entrada; redirige a la pantalla de inicio de sesión |
| `pantallas/` | Las pantallas del sistema, numeradas en el orden del mapa de navegación (`01`–`21`) y el mapa de navegación (`22`) |
| `css/base.css` | Estilos compartidos por todas las pantallas |
| `js/datos.js` | Datos de ejemplo que sustituyen temporalmente al backend |
| `js/sesion.js` | Sesión simulada: inicio y cierre de sesión, protección de pantallas por rol |
| `js/comun.js` | Comportamiento compartido: encabezado, navegación y avisos |
| `js/formularios.js` | Validaciones y mensajes de error de los formularios |
| `js/pantallas/` | Código propio de cada pantalla, con el mismo número que su archivo HTML |
| `.nojekyll` | Indica a GitHub Pages que publique los archivos tal cual |
