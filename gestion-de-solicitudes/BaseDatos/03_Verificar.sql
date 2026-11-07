SELECT DB_NAME() AS BaseActual;
SELECT COUNT(*) AS TotalSolicitudes FROM dbo.Solicitudes;
SELECT name AS Procedimiento FROM sys.procedures
WHERE name IN ('ObtenerSolicitudes','InsertarSolicitud','ActualizarSolicitud','EliminarSolicitud','ResumenSolicitudes');
EXEC dbo.ResumenSolicitudes;
