USE GestionSolicitudes;
GO
CREATE OR ALTER PROCEDURE dbo.ObtenerSolicitudes @Estado NVARCHAR(20) = NULL
AS
BEGIN
 SET NOCOUNT ON;
 SELECT IdSolicitud, Solicitante, Asunto, Descripcion, Estado, FechaRegistro
 FROM dbo.Solicitudes WHERE @Estado IS NULL OR Estado = @Estado
 ORDER BY FechaRegistro DESC, IdSolicitud DESC;
END;
GO
CREATE OR ALTER PROCEDURE dbo.InsertarSolicitud
 @Solicitante NVARCHAR(100), @Asunto NVARCHAR(120), @Descripcion NVARCHAR(1000), @Estado NVARCHAR(20)
AS
BEGIN
 SET NOCOUNT ON;
 INSERT dbo.Solicitudes (Solicitante, Asunto, Descripcion, Estado)
 OUTPUT inserted.* VALUES (@Solicitante, @Asunto, @Descripcion, @Estado);
END;
GO
CREATE OR ALTER PROCEDURE dbo.ActualizarSolicitud
 @IdSolicitud INT, @Solicitante NVARCHAR(100), @Asunto NVARCHAR(120), @Descripcion NVARCHAR(1000), @Estado NVARCHAR(20)
AS
BEGIN
 SET NOCOUNT ON;
 UPDATE dbo.Solicitudes SET Solicitante=@Solicitante, Asunto=@Asunto,
 Descripcion=@Descripcion, Estado=@Estado OUTPUT inserted.* WHERE IdSolicitud=@IdSolicitud;
END;
GO
CREATE OR ALTER PROCEDURE dbo.EliminarSolicitud @IdSolicitud INT
AS
BEGIN
 SET NOCOUNT ON;
 DELETE dbo.Solicitudes WHERE IdSolicitud=@IdSolicitud;
 SELECT @@ROWCOUNT AS Filas;
END;
GO
CREATE OR ALTER PROCEDURE dbo.ResumenSolicitudes
AS
BEGIN
 SET NOCOUNT ON;
 SELECT COUNT(*) AS Total,
 COUNT(CASE WHEN Estado=N'Pendiente' THEN 1 END) AS Pendientes,
 COUNT(CASE WHEN Estado=N'En proceso' THEN 1 END) AS EnProceso,
 COUNT(CASE WHEN Estado=N'Resuelta' THEN 1 END) AS Resueltas
 FROM dbo.Solicitudes;
END;
GO
