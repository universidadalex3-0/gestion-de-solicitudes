using API.ENTIDADES;
using API.LOGICA.NEGOCIO;
using Microsoft.AspNetCore.Mvc;
namespace API.SOLICITUDES.Controllers;
[ApiController]
[Route("api/[controller]")]
public class SolicitudesController(SolicitudesBLL bll, ILogger<SolicitudesController> logger) : ControllerBase
{
    private ActionResult<Respuesta<T>> Ejecutar<T>(Func<T> accion, string mensaje)
    {
        try { return Ok(new Respuesta<T> { Ok = true, Mensaje = mensaje, ValorRetorno = accion() }); }
        catch (ArgumentException ex) { return BadRequest(new Respuesta<T> { Mensaje = ex.Message }); }
        catch (KeyNotFoundException ex) { return NotFound(new Respuesta<T> { Mensaje = ex.Message }); }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error al procesar solicitudes");
            return StatusCode(500, new Respuesta<T> { Mensaje = "No se pudo completar la operación. Revisa la conexión de la API con SQL Server." });
        }
    }
    [HttpGet]
    public ActionResult<Respuesta<List<SolicitudDto>>> Obtener([FromQuery] string? estado) =>
        Ejecutar(() => bll.Obtener(estado), "Consulta completada.");
    [HttpGet("resumen")]
    public ActionResult<Respuesta<ResumenDto>> Resumen() => Ejecutar(bll.Resumen, "Resumen consultado.");
    [HttpPost]
    public ActionResult<Respuesta<SolicitudDto>> Insertar(SolicitudDto solicitud) =>
        Ejecutar(() => bll.Guardar(solicitud, false), "Solicitud registrada correctamente.");
    [HttpPut("{id:int}")]
    public ActionResult<Respuesta<SolicitudDto>> Actualizar(int id, SolicitudDto solicitud)
    {
        solicitud.IdSolicitud = id;
        return Ejecutar(() => bll.Guardar(solicitud, true), "Solicitud actualizada correctamente.");
    }
    [HttpDelete("{id:int}")]
    public ActionResult<Respuesta<bool>> Eliminar(int id) => Ejecutar(() =>
    {
        if (!bll.Eliminar(id)) throw new KeyNotFoundException("La solicitud ya no existe.");
        return true;
    }, "Solicitud eliminada correctamente.");
}
