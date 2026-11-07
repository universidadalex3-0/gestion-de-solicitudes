-- Ejecutar primero en SQL Server Management Studio (SSMS).
IF DB_ID(N'GestionSolicitudes') IS NULL CREATE DATABASE GestionSolicitudes;
GO
USE GestionSolicitudes;
GO
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
