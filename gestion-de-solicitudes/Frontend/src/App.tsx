import { useState, type FormEvent } from 'react';
import { useSolicitudes } from './Features/Solicitudes/hooks/useSolicitudes';
import { estados, type Formulario, type Solicitud } from './Features/Solicitudes/services/SolicitudesAPI';
const vacio: Formulario = {solicitante: '', asunto: '', descripcion: '', estado: 'Pendiente'};
function App() {
 const datos = useSolicitudes();
 const [form, setForm] = useState<Formulario>(vacio);
 const [editando, setEditando] = useState<number>();
 const [eliminando, setEliminando] = useState<Solicitud | null>(null);
 const [validacion, setValidacion] = useState('');
 function cancelar() {setForm({...vacio}); setEditando(undefined); setValidacion('');}
 function editar(s: Solicitud) {setForm({solicitante:s.solicitante, asunto:s.asunto, descripcion:s.descripcion, estado:s.estado}); setEditando(s.idSolicitud); setValidacion(''); document.getElementById('formulario')?.scrollIntoView({behavior:'smooth'});}
 async function enviar(e: FormEvent) {
  e.preventDefault();
  if (![form.solicitante, form.asunto, form.descripcion].every(v => v.trim())) {setValidacion('Completa los campos obligatorios sin usar solamente espacios.'); return;}
  setValidacion(''); if (await datos.guardar(form, editando)) cancelar();
 }
 return <>
  <header className="barra"><a href="#inicio" className="marca"><span className="logo">S</span> Gestión <span className="submarca">SOLICITUDES</span></a><a className="enlace" href="#registro">Ver registro <span aria-hidden="true">↗</span></a></header>
  <main id="inicio">
   <section className="hero"><div><p className="etiqueta">REGISTRO Y SEGUIMIENTO</p><h1>Cada solicitud,<br/><span>en su lugar.</span></h1><p className="introduccion">Registra las solicitudes y consulta su avance en un solo espacio. Filtra por estado para encontrar lo que necesitas.</p><a className="boton principal" href="#formulario">+ Nueva solicitud</a></div><aside className="nota"><span className="circulo" aria-hidden="true">✓</span><h2>Un seguimiento sencillo</h2><p>De pendiente a resuelta: mantén la información organizada y al día.</p><div className="ruta">Pendiente <span>→</span> En proceso <span>→</span> Resuelta</div></aside></section>
   <section className="estadisticas" aria-label="Resumen de todas las solicitudes">
    {[['Total de solicitudes',datos.resumen?.total,'total'],['Pendientes',datos.resumen?.pendientes,'pendiente'],['En proceso',datos.resumen?.enProceso,'proceso'],['Resueltas',datos.resumen?.resueltas,'resuelta']].map(([nombre,valor,clase]) => <article key={nombre} className={`estadistica ${clase}`}><span>{nombre}</span><strong>{datos.cargando ? '…' : valor ?? '—'}</strong></article>)}
   </section>
   <div aria-live="polite">{datos.mensaje && <p className="aviso exito">{datos.mensaje}</p>}</div>
   {datos.error && <div role="alert" className="aviso error">{datos.error} <button onClick={() => void datos.cargar()} disabled={datos.cargando || datos.guardando}>Reintentar</button></div>}
   <div className="contenido">
    <section className="panel formulario" id="formulario"><p className="etiqueta">01 / REGISTRAR</p><h2>{editando ? `Editar solicitud #${editando}` : 'Nueva solicitud'}</h2><p className="ayuda">Todos los campos son obligatorios.</p>
     <form onSubmit={e => void enviar(e)}><fieldset disabled={datos.guardando}>
      <label htmlFor="solicitante">Solicitante</label><input id="solicitante" required maxLength={100} value={form.solicitante} onChange={e=>setForm({...form,solicitante:e.target.value})} placeholder="Nombre completo" autoComplete="name"/>
      <label htmlFor="asunto">Asunto</label><input id="asunto" required maxLength={120} value={form.asunto} onChange={e=>setForm({...form,asunto:e.target.value})} placeholder="¿Qué necesitas solicitar?"/>
      <label htmlFor="descripcion">Descripción</label><textarea id="descripcion" required maxLength={1000} rows={4} value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} placeholder="Agrega los detalles de la solicitud"/>
      <label htmlFor="estado">Estado</label><select id="estado" value={form.estado} onChange={e=>setForm({...form,estado:e.target.value as Formulario['estado']})}>{estados.map(s=><option key={s}>{s}</option>)}</select>
      {validacion && <p role="alert" className="error aviso">{validacion}</p>}
      <button className="boton principal guardar" type="submit">{datos.guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Registrar solicitud'}</button>
      {editando && <button type="button" className="boton secundaria guardar" onClick={cancelar}>Cancelar edición</button>}
     </fieldset></form>
    </section>
    <section className="panel registro" id="registro"><div className="titulo-registro"><div><p className="etiqueta">02 / CONSULTAR</p><h2>Registro de solicitudes</h2></div><button className="boton secundaria" disabled={datos.cargando || datos.guardando} onClick={()=>void datos.cargar()}>Actualizar</button></div>
     <div className="filtros"><label htmlFor="filtro">Filtrar por estado</label><select id="filtro" value={datos.estado} disabled={datos.guardando} onChange={e=>datos.setEstado(e.target.value)}><option value="">Todos los estados</option>{estados.map(s=><option key={s}>{s}</option>)}</select><span>{!datos.cargando && !datos.error && `${datos.lista.length} resultado(s)`}</span></div>
     {datos.cargando ? <p className="vacio" role="status">Consultando solicitudes…</p> : datos.error ? <p className="vacio">La consulta no está disponible. Usa Reintentar.</p> : !datos.lista.length ? <div className="vacio"><h3>No hay solicitudes{datos.estado ? ` en estado ${datos.estado.toLowerCase()}` : ''}.</h3><p>{datos.estado ? 'Prueba otro estado o registra una nueva solicitud.' : 'Completa el formulario para agregar la primera.'}</p></div> : <div className="lista">{datos.lista.map(s=><article className="solicitud" key={s.idSolicitud}><div className="fila"><span className="folio">#{String(s.idSolicitud).padStart(3,'0')}</span><span className={`estado ${s.estado === 'Pendiente' ? 'pendiente' : s.estado === 'En proceso' ? 'proceso' : 'resuelta'}`}>{s.estado}</span></div><h3>{s.asunto}</h3><p className="descripcion">{s.descripcion}</p><div className="pie-solicitud"><div className="persona"><strong>{s.solicitante}</strong><span>{new Intl.DateTimeFormat('es-CR',{dateStyle:'medium'}).format(new Date(s.fechaRegistro))}</span></div><div className="acciones"><button disabled={datos.guardando} onClick={()=>editar(s)} aria-label={`Editar solicitud ${s.idSolicitud}`}>Editar</button><button disabled={datos.guardando} className="eliminar" onClick={()=>setEliminando(s)} aria-label={`Eliminar solicitud ${s.idSolicitud}`}>Eliminar</button></div></div></article>)}</div>}
    </section>
   </div>
  </main><footer>Registro de solicitudes <span>Registro y seguimiento por estado</span></footer>
  {eliminando && <div className="fondo-modal"><section role="dialog" aria-modal="true" aria-labelledby="titulo-eliminar" className="modal" onKeyDown={e=>{if(e.key==='Escape'&&!datos.guardando)setEliminando(null);}}><h2 id="titulo-eliminar">¿Eliminar solicitud #{eliminando.idSolicitud}?</h2><p>Se eliminará «{eliminando.asunto}». Esta acción no se puede deshacer.</p><div className="acciones"><button autoFocus disabled={datos.guardando} className="boton secundaria" onClick={()=>setEliminando(null)}>Cancelar</button><button disabled={datos.guardando} className="boton peligro" onClick={async()=>{if(await datos.eliminar(eliminando.idSolicitud)){if(editando===eliminando.idSolicitud)cancelar(); setEliminando(null);}}}>{datos.guardando ? 'Eliminando…' : 'Eliminar'}</button></div>{datos.error && <p role="alert" className="aviso error">{datos.error}</p>}</section></div>}
 </>;
}
export default App;
