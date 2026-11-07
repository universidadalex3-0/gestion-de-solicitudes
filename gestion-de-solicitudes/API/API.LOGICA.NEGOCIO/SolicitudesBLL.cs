using API.DAPPER;
using API.ENTIDADES;
namespace API.LOGICA.NEGOCIO;
public class SolicitudesBLL(SolicitudesDAL dal)
{
    public static bool EstadoValido(string estado) => estado is "Pendiente" or "En proceso" or "Resuelta";
    public List<SolicitudDto> Obtener(string? estado)
    {
        if (estado != null && !EstadoValido(estado)) throw new ArgumentException("Selecciona un estado válido.");
        return dal.Obtener(estado);
    }
    public SolicitudDto Guardar(SolicitudDto s, bool editar)
    {
        s.Solicitante = (s.Solicitante ?? "").Trim();
        s.Asunto = (s.Asunto ?? "").Trim();
        s.Descripcion = (s.Descripcion ?? "").Trim();
        if (editar && s.IdSolicitud <= 0) throw new ArgumentException("El identificador debe ser positivo.");
        if (s.Solicitante.Length is < 1 or > 100) throw new ArgumentException("El solicitante es obligatorio y admite hasta 100 caracteres.");
        if (s.Asunto.Length is < 1 or > 120) throw new ArgumentException("El asunto es obligatorio y admite hasta 120 caracteres.");
        if (s.Descripcion.Length is < 1 or > 1000) throw new ArgumentException("La descripción es obligatoria y admite hasta 1000 caracteres.");
        if (!EstadoValido(s.Estado)) throw new ArgumentException("Selecciona un estado válido.");
        return dal.Guardar(s, editar);
    }
    public bool Eliminar(int id)
    {
        if (id <= 0) throw new ArgumentException("El identificador debe ser positivo.");
        return dal.Eliminar(id);
    }
    public ResumenDto Resumen() => dal.Resumen();
}
