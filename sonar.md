cONSIGNA: REVISIÓN DE LA CALIDAD PARA APLICACIONES WEB 
MODERNAS FULL STACK MEDIANTE SONARQUBE, OWASP TOP 10 2025, 
WCAG Y SUS 
1. Contexto del Proyecto 
La presente actividad se desarrolla en el marco del Proyecto de Fin de Asignatura (PFA) 
correspondiente al curso de Taller de Proyectos 2 – Ingeniería de Sistemas e Informática. Los equipos 
de trabajo deberán aplicar estrategias integrales de aseguramiento de calidad sobre una aplicación 
Web Full Stack previamente desarrollada durante el semestre académico. 
El proyecto deberá ser sometido a un proceso completo de validación técnica y aseguramiento de 
calidad utilizando estándares, métricas y herramientas profesionales de la industria. 
2. Escenario o Problemática en
La organización responsable del sistema Web ha identificado riesgos críticos asociados a: 
a. 
vulnerabilidades de seguridad, 
b. baja mantenibilidad del código, 
c. 
problemas de accesibilidad para usuarios con limitaciones funcionales, 
d. inconsistencias de usabilidad, 
e. 
f. 
g. 
ausencia de trazabilidad de pruebas, 
deficiencias en validación automatizada, 
deuda técnica acumulada, 
h. cobertura insuficiente de pruebas. 
El equipo de desarrollo deberá ejecutar un proceso integral de auditoría técnica, análisis de calidad, 
mitigación de vulnerabilidades y validación funcional, con el propósito de garantizar que la aplicación 
cumpla criterios mínimos de: 
a. 
seguridad, 
b. accesibilidad, 
c. 
usabilidad, 
d. mantenibilidad, 
e. 
f. 
verificabilidad técnica, 
calidad arquitectónica. 
La validación deberá sustentarse mediante evidencias objetivas, reportes especializados y métricas 
verificables. 
3. Objetivo General 
Evaluar, validar y mejorar integralmente la calidad técnica de una aplicación Web Full Stack mediante 
la implementación de estrategias de aseguramiento de calidad basadas en SonarQube, OWASP Top 10 
2025, WCAG, SUS y pruebas automatizadas, garantizando soluciones seguras, accesibles, usables, 
mantenibles y técnicamente verificables. 
4. Competencias 
Competencias técnicas 
1/8 
Proyectos de ingeniería 2 – Ingeniería de Sistemas e Informática 
a. 
Implementa estrategias profesionales de aseguramiento de calidad en aplicaciones Web 
modernas. 
b. Analiza métricas de calidad de código utilizando herramientas de análisis estático. 
c. 
Identifica y mitiga vulnerabilidades de seguridad basadas en estándares OWASP. 
d. Aplica criterios de accesibilidad conforme a estándares WCAG. 
e. 
f. 
g. 
Diseña y ejecuta pruebas automatizadas de software. 
Evalúa usabilidad mediante instrumentos cuantitativos especializados. 
Gestiona repositorios de software utilizando buenas prácticas de ingeniería. 
Competencias de análisis crítico 
a. 
Interpreta métricas técnicas para la toma de decisiones de mejora. 
b. Evalúa riesgos asociados a vulnerabilidades y deuda técnica. 
c. 
Sustenta técnicamente propuestas de mejora de software. 
d. Analiza impacto funcional y arquitectónico de las mitigaciones implementadas. 
Competencias de validación técnica 
a. 
Genera evidencias objetivas de calidad de software. 
b. Verifica cumplimiento de estándares técnicos internacionales. 
c. 
Documenta hallazgos técnicos mediante reportes verificables. 
d. Valida trazabilidad entre problemas detectados y soluciones implementadas. 
5. Resultados de Aprendizaje 
Al finalizar la actividad, el estudiante será capaz de: 
a. 
Analizar la calidad de código de una aplicación Web mediante SonarQube. 
b. Interpretar métricas de bugs, vulnerabilities, code smells, duplicación y deuda técnica. 
c. 
Identificar vulnerabilidades alineadas al OWASP Top 10 2025. 
d. Implementar mitigaciones verificables para riesgos de seguridad detectados. 
e. 
f. 
Evaluar accesibilidad utilizando criterios WCAG y herramientas especializadas. 
Aplicar y analizar resultados del instrumento SUS. 
Diseñar y ejecutar pruebas unitarias, integración, funcionales y E2E. 
a. 
Generar evidencias técnicas verificables de aseguramiento de calidad. 
b. Sustentar técnicamente decisiones de mejora del sistema. 
c. 
Validar el cumplimiento de criterios mínimos de calidad integral. 
6. Actividades Técnicas Detalladas 
6.1. Evaluación de Calidad de Código mediante SonarQube 
a. 
Configuración 
1º Instalar y configurar SonarQube. 
2º Integrar SonarQube con el repositorio GitHub del proyecto. 
2/8 
Proyectos de ingeniería 2 – Ingeniería de Sistemas e Informática 
3º Configurar análisis automático del proyecto. 
b. Análisis Estático. Se deberá ejecutar análisis completo del código fuente del Frontend y 
Backend considerando: 
1º Bugs. 
2º Vulnerabilities. 
3º Code Smells. 
4º Duplicación de código. 
5º Maintainability Rating. 
6º Reliability Rating. 
7º Security Rating. 
8º Technical Debt. 
9º Cobertura de pruebas. 
c. 
Interpretación Técnica 
1º analizar métricas obtenidas, 
2º identificar componentes críticos, 
3º justificar problemas detectados, 
4º proponer mejoras sustentadas técnicamente, 
5º implementar correcciones verificables. 
d. Evidencias Obligatorias 
1º capturas de dashboard, 
2º métricas antes y después de correcciones, 
3º reporte técnico de análisis, 
4º evidencia de reducción de deuda técnica. 
6.2. Evaluación de Seguridad basada en OWASP Top 10 2025 
El equipo deberá realizar una auditoría técnica de seguridad alineada al OWASP Top 10 2025. 
a. 
Actividades Obligatorias 
b. identificación de vulnerabilidades, 
c. 
clasificación de riesgos, 
d. análisis de impacto, 
e. 
f. 
g. 
evaluación de exposición del sistema, 
validación de autenticación, 
validación de autorización, 
h. análisis de manejo de sesiones, 
i. 
j. 
validación de sanitización de entradas, 
validación de protección contra ataques comunes. 
Mitigaciones. Se deberá implementar evidencia funcional de mitigación para vulnerabilidades 
detectadas. Evidencias Obligatorias 
a. 
matriz de vulnerabilidades, 
b. evidencia técnica de mitigación, 
c. 
pruebas de validación, 
d. capturas verificables, 
e. 
análisis de riesgo residual. 
6.3. Evaluación de Accesibilidad mediante WCAG 
El equipo deberá evaluar el cumplimiento de criterios WCAG aplicables a aplicaciones Web 
modernas. Evaluaciones Obligatorias: 
a. 
contraste de colores, 
b. navegación mediante teclado, 
c. 
estructura semántica HTML, 
d. uso correcto de etiquetas, 
e. 
f. 
g. 
compatibilidad con lectores de pantalla, 
accesibilidad de formularios, 
accesibilidad multimedia, 
h. accesibilidad funcional. 
Herramientas que se deberá utilizar: 
a. 
herramientas automáticas, 
b. validación manual, 
c. 
inspección del DOM, 
d. validadores de accesibilidad. 
Evidencias Obligatorias 
a. 
reportes automáticos, 
b. checklist WCAG, 
c. 
capturas de validación, 
d. listado de incumplimientos, 
e. 
evidencia de correcciones implementadas. 
6.4. Evaluación de Usabilidad mediante SUS 
El equipo deberá aplicar el instrumento SUS (System Usability Scale) y con actividades 
obligatorias: 
a. 
diseño del instrumento, 
b. selección de participantes, 
c. 
aplicación controlada, 
d. recolección de datos, 
e. 
f. 
cálculo del puntaje SUS, 
interpretación cuantitativa. 
Interpretación, deberá considerar: 
a. 
nivel de aceptabilidad, 
b. percepción de facilidad de uso, 
c. 
oportunidades de mejora, 
d. análisis crítico de resultados. 
Requisito Mínimo, el sistema deberá obtener un resultado SUS con interpretación positiva y 
técnicamente sustentada y con evidencias obligatorias: 
a. 
formulario aplicado, 
b. base de resultados, 
c. 
cálculo del puntaje, 
d. interpretación técnica, 
e. 
propuesta de mejoras derivadas del análisis. 
6.5. Implementación de testing y validación automatizada 
El equipo deberá implementar pruebas automatizadas sobre la aplicación y con las pruebas 
obligatorias: pruebas unitarias, pruebas de integración, pruebas E2E y pruebas de cobertura. 
7. Entregables 
7.1. Repositorio del proyecto 
a. 
repositorio GitHub público, 
b. código fuente completo, 
c. 
historial de versiones, 
d. ramas organizadas, 
e. 
documentación del proyecto. 
7.2. Informe técnico integral que deberá incluir: 
a. 
análisis SonarQube, 
b. interpretación de métricas, 
c. 
análisis OWASP, 
d. validación WCAG, 
e. 
análisis SUS. 
7.3. Evidencias técnicas 
a. 
capturas verificables, 
b. dashboards. 
7.4. Presentación técnica profesional orientada a: 
a. 
hallazgos críticos, 
b. métricas obtenidas,  
c. 
vulnerabilidades detectadas, 
d. mejoras implementadas, 
e. 
validación integral del sistema. 
rubrica:
Repositorio GitHub público 
correctamente configurado; código 
fuente completo y funcional; 
historial de commits consistente; 
ramas organizadas bajo estrategia 
clara; documentación técnica 
completa con instrucciones de 
instalación, ejecución y pruebas. Repositorio completamente 
operativo, historial profesional 
con commits descriptivos, ramas 
organizadas por funcionalidades, 
documentación exhaustiva, 
instalación reproducible y 
evidencias verificables del 
proceso de desarrollo. 

Informe técnico integral con 
análisis SonarQube; interpretación 
de métricas; análisis OWASP Top 10 
2025; validación WCAG; evaluación 
SUS; integración de hallazgos 
técnicos y propuestas de mejora 
sustentadas. nforme completo, coherente y 
técnicamente sustentado; 
integra métricas, interpretación 
crítica, evidencias comparativas 
antes/después y propuestas de 
mejora verificables con lenguaje 
técnico profesional. 

Evidencias técnicas verificables; 
capturas de dashboards; reportes 
de SonarQube; evidencias de 
mitigación OWASP; validaciones 
WCAG; resultados SUS; pruebas 
automatizadas y cobertura 
correctamente documentadas. evidencias completas, 
organizadas, trazables y 
verificables; incluyen capturas 
claras, reportes técnicos, 
resultados comparativos y 
validaciones reproducibles del 
sistema. 
Presentación técnica profesional; 
demostración funcional del 
sistema; explicación de hallazgos críticos; interpretación de métricas; 
demostración de vulnerabilidades 
detectadas y mitigadas; validación 
integral del sistema; dominio 
técnico del proyecto y respuesta a 
preguntas. Demostración fluida y 
completamente funcional; 
explica métricas,vulnerabilidades, mitigaciones, 
accesibilidad, usabilidad y 
pruebas con dominio técnico 
sobresaliente; responde 
preguntas con precisión técnica y 
evidencia en tiempo real.