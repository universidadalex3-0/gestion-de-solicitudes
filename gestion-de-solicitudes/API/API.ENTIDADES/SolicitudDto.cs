namespace API.ENTIDADES;
public class SolicitudDto
{
    public int IdSolicitud { get; set; }
    public string Solicitante { get; set; } = "";
    public string Asunto { get; set; } = "";
    public string Descripcion { get; set; } = "";
    public string Estado { get; set; } = "Pendiente";
    public DateTime FechaRegistro { get; set; }
}
public class ResumenDto
{
    public int Total { get; set; }
    public int Pendientes { get; set; }
    public int EnProceso { get; set; }
    public int Resueltas { get; set; }
}
