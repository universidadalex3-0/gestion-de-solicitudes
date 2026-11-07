using API.ENTIDADES;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace API.DAPPER;
// Como en el ejemplo, esta capa usa SqlConnection y procedimientos almacenados.
public class SolicitudesDAL(IConfiguration config)
{
    private SqlConnection Conexion() => new(config.GetConnectionString("Conexion"));
    private static SolicitudDto Leer(SqlDataReader r) => new()
    {
        IdSolicitud = (int)r["IdSolicitud"], Solicitante = (string)r["Solicitante"],
        Asunto = (string)r["Asunto"], Descripcion = (string)r["Descripcion"],
        Estado = (string)r["Estado"], FechaRegistro = (DateTime)r["FechaRegistro"]
    };
    public List<SolicitudDto> Obtener(string? estado)
    {
        using var cn = Conexion();
        using var cmd = new SqlCommand("dbo.ObtenerSolicitudes", cn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.Add("@Estado", SqlDbType.NVarChar, 20).Value = (object?)estado ?? DBNull.Value;
        cn.Open(); using var reader = cmd.ExecuteReader();
        var lista = new List<SolicitudDto>();
        while (reader.Read()) lista.Add(Leer(reader));
        return lista;
    }
    public SolicitudDto Guardar(SolicitudDto s, bool editar)
    {
        using var cn = Conexion();
        using var cmd = new SqlCommand(editar ? "dbo.ActualizarSolicitud" : "dbo.InsertarSolicitud", cn) { CommandType = CommandType.StoredProcedure };
        if (editar) cmd.Parameters.Add("@IdSolicitud", SqlDbType.Int).Value = s.IdSolicitud;
        cmd.Parameters.Add("@Solicitante", SqlDbType.NVarChar, 100).Value = s.Solicitante;
        cmd.Parameters.Add("@Asunto", SqlDbType.NVarChar, 120).Value = s.Asunto;
        cmd.Parameters.Add("@Descripcion", SqlDbType.NVarChar, 1000).Value = s.Descripcion;
        cmd.Parameters.Add("@Estado", SqlDbType.NVarChar, 20).Value = s.Estado;
        cn.Open(); using var reader = cmd.ExecuteReader();
        if (!reader.Read()) throw new KeyNotFoundException("La solicitud ya no existe. Actualiza la lista.");
        return Leer(reader);
    }
    public bool Eliminar(int id)
    {
        using var cn = Conexion();
        using var cmd = new SqlCommand("dbo.EliminarSolicitud", cn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.Add("@IdSolicitud", SqlDbType.Int).Value = id;
        cn.Open(); return Convert.ToInt32(cmd.ExecuteScalar()) > 0;
    }
    public ResumenDto Resumen()
    {
        using var cn = Conexion();
        using var cmd = new SqlCommand("dbo.ResumenSolicitudes", cn) { CommandType = CommandType.StoredProcedure };
        cn.Open(); using var r = cmd.ExecuteReader(); r.Read();
        return new() { Total = (int)r["Total"], Pendientes = (int)r["Pendientes"], EnProceso = (int)r["EnProceso"], Resueltas = (int)r["Resueltas"] };
    }
}
