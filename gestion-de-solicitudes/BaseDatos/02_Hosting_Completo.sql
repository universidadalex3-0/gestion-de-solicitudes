-- Ejecutar en SSMS conectado a la base de MonsterASP ya creada. No cambia de base.
IF OBJECT_ID(N'dbo.Solicitudes', N'U') IS NULL
BEGIN
 CREATE TABLE dbo.Solicitudes (
  IdSolicitud INT IDENTITY(1,1) PRIMARY KEY,
  Solicitante NVARCHAR(100) NOT NULL CHECK (LEN(LTRIM(RTRIM(Solicitante))) > 0),
  Asunto NVARCHAR(120) NOT NULL CHECK (LEN(LTRIM(RTRIM(Asunto))) > 0),
  Descripcion NVARCHAR(1000) NOT NULL CHECK (LEN(LTRIM(RTRIM(Descripcion))) > 0),
  Estado NVARCHAR(20) NOT NULL DEFAULT N'Pendiente'
    CHECK (Estado IN (N'Pendiente', N'En proceso', N'Resuelta')),
  FechaRegistro DATETIME2 NOT NULL DEFAULT SYSDATETIME()
 );
END;
GO
-- Los ejemplos solo se insertan si la tabla está vacía.
IF NOT EXISTS (SELECT 1 FROM dbo.Solicitudes)
BEGIN
 INSERT dbo.Solicitudes (Solicitante, Asunto, Descripcion, Estado) VALUES
 (N'Ana Pérez',N'Constancia de estudio',N'Solicito una constancia del periodo actual.',N'Pendiente'),
 (N'Luis Mora',N'Acceso al aula virtual',N'No puedo ingresar al curso de programación.',N'En proceso'),
 (N'María Rojas',N'Actualización de correo',N'Solicito actualizar mi correo de contacto.',N'Resuelta'),
 (N'Carlos Soto',N'Revisión de matrícula',N'Necesito confirmar las materias matriculadas.',N'Pendiente'),
 (N'Sofía Vargas',N'Préstamo de equipo',N'Solicito un proyector para una exposición.',N'En proceso'),
 (N'Diego Castro',N'Horario de biblioteca',N'Consulta del horario de atención de biblioteca.',N'Resuelta'),
 (N'Valeria Solís',N'Certificación de notas',N'Solicito una certificación de notas.',N'Pendiente'),
 (N'José Arias',N'Reserva de laboratorio',N'Solicito reservar el laboratorio para una práctica.',N'En proceso'),
 (N'Camila León',N'Información de beca',N'Consulta sobre documentos para solicitar beca.',N'Pendiente'),
 (N'Andrés Ruiz',N'Corrección de nombre',N'Solicito corregir mi segundo apellido.',N'Resuelta');
END;
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
