# Demo aislada de 10 cabañas

La demo se crea en una empresa nueva, sin alterar las empresas existentes. Solo se ejecuta contra una API local en localhost o 127.0.0.1. Ejecutar `node scripts/demo-ten-cabins.mjs` con Hospeda local activo; cada ejecución crea una empresa de prueba independiente.

Genera 10 cabañas ficticias, 20 reservas confirmadas en febrero de 2027, 20 anticipos manuales, 10 gastos operativos y comisiones manuales en algunas reservas. La primera cabaña tiene estadía mínima de dos noches y tarifa especial de verano. Las reservas representan distintos canales, pero no hay sincronización con plataformas externas ni transferencias reales.

Las credenciales generadas se guardan exclusivamente en `~/.config/hospeda/demo-ten-cabins-<id>.json` con permisos de lectura del propietario (0600). No se suben a Git. Abrir la URL local y entrar con las credenciales de ese archivo. No usar la demo como datos de producción ni registrar huéspedes reales.

Verificación: en Reservas deben aparecer 20 reservas; en Calendario, 10 alojamientos; en Finanzas, 10 gastos y el desglose por cabaña y canal. La demo es un conjunto de datos operativos, no reemplaza las pruebas integrales de interacción del usuario.
