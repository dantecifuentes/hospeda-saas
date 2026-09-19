# Arquitectura de Hospeda

## Principios
- SaaS multitenant: toda tabla de negocio incluye `organization_id`.
- Reserva y pago son entidades separadas: vender no significa cobrar.
- Los canales se normalizan como origen de una reserva: Web, WhatsApp, Airbnb, Booking y manual.
- Una salida genera una tarea de operación; las tareas tienen responsable, vencimiento, evidencia y estado.
- La web pública consulta disponibilidad mediante una API; nunca accede a datos administrativos.

## Capas
1. **Web pública:** fichas de cabañas, búsqueda por fecha, cotización, solicitud y pago.
2. **Backoffice:** calendario, reservas, huéspedes, pagos, limpieza, mantenimiento y reportes.
3. **API:** autenticación, permisos por rol, validación, reglas de disponibilidad, integración de canales y webhooks.
4. **Datos:** PostgreSQL, almacenamiento de fotos/documentos y cola de trabajos para mensajes e integraciones.

## Tecnología propuesta para producción
- Frontend: Next.js + TypeScript + Tailwind.
- API: Next.js route handlers o NestJS, según complejidad de integraciones.
- Datos: PostgreSQL + Prisma.
- Autenticación: sesiones seguras y roles Owner, Manager, Recepción, Operación y Contabilidad.
- Archivos: Cloudflare R2 o S3.
- Pagos: Mercado Pago; conciliación por webhook.
- Mensajes: WhatsApp Cloud API.
- Infraestructura: Cloudflare para web y CDN; PostgreSQL gestionado; workers para sincronización y recordatorios.

## Reglas críticas
- No permitir reservas cruzadas por cabaña y noche.
- Tratar checkout como fecha exclusiva y check-in como fecha inclusiva.
- Guardar cada pago como movimiento inmutable; las devoluciones son movimientos separados.
- Registrar autor y fecha para cambios de tarifa, estado, pago y reserva.
- Aislar datos con `organization_id` en cada consulta y validarlo desde la sesión.

## Fases
1. Reservas, calendario, huéspedes, pagos y dashboard.
2. Aseo, mantención, mensajes y web pública conectada.
3. Pagos online, sincronización iCal y luego APIs certificadas de canales.
4. Planes, facturación SaaS, analítica comparativa y soporte multimoneda.
