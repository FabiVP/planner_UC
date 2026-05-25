import { useState } from 'react';
import { HiOutlineQuestionMarkCircle, HiOutlineBookOpen, HiOutlineMail, HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineDocumentText, HiOutlineLightningBolt, HiOutlineAcademicCap, HiOutlineCog } from 'react-icons/hi';
import Modal from '../components/ui/Modal';
import './Help.css';

const FAQ = [
  { q: '¿Cómo se genera un horario?', a: 'Ve a la sección "Generar horario", configura tus preferencias y presiona "Regenerar horario". El sistema usará un algoritmo CSP para encontrar el mejor horario posible.' },
  { q: '¿Qué significa el puntaje de optimización?', a: 'Es una evaluación del 0 al 100 que mide qué tan bien el horario cumple con tus preferencias y las restricciones institucionales. Un puntaje mayor a 80 indica un horario óptimo.' },
  { q: '¿Por qué no se pudo cumplir todas mis preferencias?', a: 'Cuando hay muchas restricciones simultáneas (horarios de docentes, capacidad de aulas, etc.), el sistema prioriza la validez del horario y propone la mejor alternativa disponible.' },
  { q: '¿Cómo funciona el sistema de alternativas?', a: 'El motor genera múltiples horarios válidos y los evalúa. Te presenta el mejor y las alternativas disponibles con su comparación de puntajes.' },
  { q: '¿Puedo modificar un horario generado?', a: 'Actualmente los horarios se generan automáticamente. Puedes ajustar tus preferencias y regenerar para obtener un resultado diferente.' },
  { q: '¿Qué son las restricciones duras y blandas?', a: 'Las restricciones duras (institucionales) son obligatorias: no se permite choque de horarios ni superar créditos. Las blandas (personales) son preferencias que el sistema intenta satisfacer.' },
  { q: '¿Cómo exporto mi horario?', a: 'Ve a la sección "Reportes" y presiona el botón "Exportar reporte CSV". Se descargará un archivo con todo el detalle de tu horario.' },
];

const GUIDES = [
  {
    id: 'quick',
    title: 'Guía Rápida de Inicio',
    icon: HiOutlineLightningBolt,
    content: `## Guía Rápida — UniScheduler

### 1. Configura tus preferencias
Ve a **Preferencias** y selecciona tu disponibilidad horaria (mañana, tarde, noche) para cada día de la semana.

### 2. Genera tu horario
Ve a **Generar horario** y presiona el botón **"Regenerar horario"**. El motor CSP analizará todas las combinaciones posibles.

### 3. Revisa el resultado
El horario se mostrará en una grilla con colores por materia. Revisa el puntaje de optimización (mayor a 80 = óptimo).

### 4. Exporta o ajusta
Si no estás satisfecho, ajusta tus preferencias y regenera. Cuando estés conforme, ve a **Reportes** para exportar tu horario.

### Puntaje de optimización
- **90-100**: Excelente — todas las restricciones y preferencias satisfechas
- **80-89**: Muy bueno — alguna preferencia menor no fue posible
- **60-79**: Aceptable — varias preferencias no cumplidas
- **< 60**: Mejorable — revisa tus restricciones`
  },
  {
    id: 'csp',
    title: 'Acerca del Motor CSP',
    icon: HiOutlineCog,
    content: `## Motor CSP — Satisfacción de Restricciones

### ¿Qué es CSP?
CSP (Constraint Satisfaction Problem) es una técnica de inteligencia artificial que modela problemas con variables, dominios y restricciones.

### Algoritmo utilizado
UniScheduler emplea **Backtracking con heurísticas**:
- **MRV (Minimum Remaining Values)**: Asigna primero las variables con menos opciones disponibles
- **Forward Checking**: Después de cada asignación, elimina valores inconsistentes del dominio de variables vecinas
- **Shuffling aleatorio**: Genera diversidad en las soluciones para encontrar alternativas

### Evaluación de calidad
Cada horario se evalúa con 4 dimensiones:

| Dimensión | Peso | Descripción |
|-----------|------|-------------|
| Validez | 25% | Sin choques de horario ni conflictos |
| Institucional | 25% | Cumplimiento de restricciones duras |
| Preferencias | 30% | Satisfacción de preferencias del usuario |
| Optimización | 20% | Uso eficiente de recursos y distribución |

### Tiempo de ejecución
El motor resuelve la mayoría de instancias en menos de 5 segundos. Para problemas complejos con muchas restricciones, puede tomar hasta 30 segundos.`
  },
  {
    id: 'faq',
    title: 'Manual del Estudiante',
    icon: HiOutlineAcademicCap,
    content: `## Manual del Estudiante

### Perfiles del sistema
UniScheduler soporta 3 perfiles:

1. **Estudiante**: Genera su horario personal, configura preferencias, consulta notificaciones
2. **Docente**: Ve su carga académica, configura disponibilidad, revisa asignaciones
3. **Coordinador**: Administra cursos, docentes, aulas y genera horarios institucionales

### Secciones disponibles
- **Dashboard**: Vista general con estadísticas y notificaciones
- **Generar horario**: Motor CSP con grid interactivo
- **Mis horarios**: Historial de horarios generados
- **Preferencias**: Disponibilidad y configuración personal
- **Restricciones**: Reglas del sistema (institucionales y personales)
- **Reportes**: Estadísticas y exportación CSV
- **Notificaciones**: Alertas y avisos del sistema

### Recomendaciones
- Configura tu disponibilidad antes de generar
- Genera varias veces para comparar alternativas
- Revisa las condiciones no satisfechas si el puntaje es bajo
- Exporta tu horario final desde Reportes`
  }
];

export default function Help() {
  const [openFaq, setOpenFaq] = useState(null);
  const [openGuide, setOpenGuide] = useState(null);
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="help-page animate-fadeIn">
      <div className="page-header">
        <h1>Ayuda</h1>
        <p>¿Tienes dudas? Encuentra respuestas aquí.</p>
      </div>

      <div className="help-grid">
        <div>
          <div className="card">
            <h3 className="card-title">Preguntas frecuentes ({FAQ.length})</h3>
            <div className="faq-list">
              {FAQ.map((item, i) => (
                <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                  <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <HiOutlineQuestionMarkCircle />
                    <span>{item.q}</span>
                    {openFaq === i ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
                  </button>
                  {openFaq === i && <div className="faq-answer">{item.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="help-sidebar">
          <div className="card">
            <h3 className="card-title">Documentación</h3>
            <div className="resource-list">
              {GUIDES.map(g => (
                <button key={g.id} className="resource-item" onClick={() => setOpenGuide(g)}>
                  <g.icon />
                  <span>{g.title}</span>
                  <HiOutlineDocumentText className="resource-arrow" />
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Contacto</h3>
            <p className="card-subtitle">¿Necesitas ayuda personalizada?</p>
            <button className="btn btn-outline w-full" style={{ marginTop: 12 }} onClick={() => setShowContact(true)}>
              <HiOutlineMail /> Contactar soporte
            </button>
          </div>

          <div className="card help-version-card">
            <h4>UniScheduler</h4>
            <p>Versión 2.0 — Motor CSP</p>
            <p className="text-muted">Universidad Continental</p>
            <p className="text-muted">Taller de Proyectos 2 — {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* Modal de documentación */}
      <Modal isOpen={!!openGuide} onClose={() => setOpenGuide(null)} title={openGuide?.title || ''}>
        {openGuide && (
          <div className="guide-modal-content">
            {openGuide.content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
              if (line.startsWith('### ')) return <h3 key={i} style={{marginTop:16}}>{line.replace('### ', '')}</h3>;
              if (line.startsWith('- ')) return <li key={i} style={{marginLeft:16,marginBottom:4}}>{line.replace('- ', '')}</li>;
              if (line.startsWith('| ')) {
                const cells = line.split('|').filter(c => c.trim());
                if (cells.every(c => c.trim().match(/^-+$/))) return null;
                return <div key={i} style={{display:'flex',gap:8,padding:'4px 0',borderBottom:'1px solid var(--border-light)',fontSize:13}}>
                  {cells.map((c,j) => <span key={j} style={{flex:1,fontWeight:i===0?600:400}}>{c.trim()}</span>)}
                </div>;
              }
              if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
                return <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:6}}>
                  <span style={{fontWeight:700,color:'var(--primary)'}}>{line.charAt(0)}.</span>
                  <span>{line.substring(3)}</span>
                </div>;
              }
              if (line.trim() === '') return <br key={i} />;
              // Handle **bold**
              const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              return <p key={i} style={{marginBottom:4}} dangerouslySetInnerHTML={{__html: formatted}} />;
            })}
          </div>
        )}
      </Modal>

      {/* Modal de contacto */}
      <Modal isOpen={showContact} onClose={() => setShowContact(false)} title="Contactar soporte">
        <div className="contact-modal">
          <div className="form-group">
            <label>Asunto</label>
            <select className="form-select">
              <option>Problema con generación de horario</option>
              <option>Error en el sistema</option>
              <option>Solicitud de funcionalidad</option>
              <option>Otro</option>
            </select>
          </div>
          <div className="form-group">
            <label>Mensaje</label>
            <textarea className="form-input" rows="4" placeholder="Describe tu problema o sugerencia..."></textarea>
          </div>
          <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={() => { alert('Mensaje enviado correctamente'); setShowContact(false); }}>
            <HiOutlineMail /> Enviar mensaje
          </button>
        </div>
      </Modal>
    </div>
  );
}
