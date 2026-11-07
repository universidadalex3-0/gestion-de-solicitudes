# Gestión de Solicitudes

Aplicación académica de Alexis Fallas para registrar solicitudes y filtrarlas por estado.

**Aplicación publicada:** https://solicitudes-alex.runasp.net/

## Tecnologías

React, TypeScript y Vite en la interfaz; API ASP.NET Core con C# y .NET 10;
SQL Server con Microsoft.Data.SqlClient y procedimientos almacenados.
Página, API y base alojadas en MonsterASP.NET.

## Funciones

- Registrar, consultar, editar y eliminar solicitudes.
- Filtrar por Pendiente, En proceso o Resuelta.
- Consultar cantidades totales y por estado desde SQL.
- Validar campos obligatorios y mostrar mensajes claros.
- Conservar los datos al recargar y adaptar la interfaz al teléfono.

## Ejecutar localmente

1. En SSMS conecta a `(localdb)\MSSQLLocalDB` con autenticación Windows.
2. Ejecuta `BaseDatos/01_Tablas_y_Datos.sql` y `BaseDatos/02_Procedimientos.sql`.
3. Abre `API/API.SOLICITUDES.slnx` en Visual Studio compatible con .NET 10.
4. Establece API.SOLICITUDES como proyecto de inicio, selecciona `http` y ejecuta.
5. Abre http://localhost:5007. La interfaz construida está en `wwwroot`.

Alternativa desde terminal en la raíz:

```powershell
dotnet run --project API/API.SOLICITUDES
```

Si usas otra instancia SQL, ajusta `ConnectionStrings:Conexion` en
`API/API.SOLICITUDES/appsettings.Development.json`.

## Editar la interfaz

Abre `Frontend` en VS Code y ejecuta:

```powershell
npm.cmd install
npm.cmd run dev
```

Mantén la API iniciada en el puerto 5007. Vite reenvía `/api` hacia esa API.
Para actualizar la interfaz integrada ejecuta `npm.cmd run build` y copia
el contenido de `Frontend/dist` a `API/API.SOLICITUDES/wwwroot`.
`PrepararPublicacion.ps1` automatiza la construcción y la publicación Windows x64.

## Organización

- `Frontend/src`: interfaz, servicio Axios y hook de solicitudes.
- `API/API.SOLICITUDES`: controladores y configuración HTTP.
- `API/API.LOGICA.NEGOCIO`: validaciones.
- `API/API.DAPPER`: acceso a SQL mediante SqlConnection y SqlCommand.
- `API/API.ENTIDADES`: objetos de datos y respuesta.
- `BaseDatos`: tabla, ejemplos, procedimientos y verificación.

API.DAPPER conserva el nombre de la capa del ejemplo del curso; no utiliza
la biblioteca Dapper. El acceso real se hace con Microsoft.Data.SqlClient.

## Publicación

La versión publicada sirve React y la API desde el mismo dominio.
En el alojamiento se configura .NET 10 x64 y estas variables de entorno:

```text
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__Conexion=CADENA_PRIVADA_DEL_ALOJAMIENTO
```

Para una base nueva creada por el alojamiento, ejecuta
`BaseDatos/02_Hosting_Completo.sql` y verifica con `BaseDatos/03_Verificar.sql`.
No uses los scripts locales para crear otra base dentro del alojamiento.

Las contraseñas de producción no están en este repositorio. Configura la cadena
desde las variables de entorno del servidor. No publiques perfiles de despliegue
con credenciales ni archivos JSON con contraseñas.

## Consultas de comprobación

```sql
EXEC dbo.ObtenerSolicitudes @Estado = N'Pendiente';
EXEC dbo.ResumenSolicitudes;
```

Con los diez ejemplos iniciales, el resumen muestra 10 en total, 4 pendientes,
3 en proceso y 3 resueltas. Los valores cambian al modificar los registros.
