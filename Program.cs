using TempoControl.Business;
using TempoControl.Data;
using TempoControl.Data.Repositories;
using TempoControl.Presentation;

// ═══════════════════════════════════════════════════════════
// CONFIGURACIÓN DE INYECCIÓN DE DEPENDENCIAS
// ═══════════════════════════════════════════════════════════

// Crear contexto de base de datos
var context = new TempoControlDbContext();

// Crear las tablas si no existen
context.Database.EnsureCreated();

// Crear repositorios (Patrón Repositorio)
IEmpleadoRepository empleadoRepository = new EmpleadoRepository(context);
IRegistroFichajeRepository fichajeRepository = new RegistroFichajeRepository(context);

// Crear servicios de lógica de negocio
var empleadoService = new EmpleadoService(empleadoRepository);
var fichajeService = new RegistroFichajeService(fichajeRepository, empleadoRepository);
var reporteService = new ReporteService(empleadoRepository, fichajeRepository);

// Crear el gestor de menú (Capa de Presentación)
var menuManager = new MenuManager(empleadoService, fichajeService, reporteService, empleadoRepository);

// ═══════════════════════════════════════════════════════════
// EJECUTAR APLICACIÓN
// ═══════════════════════════════════════════════════════════

await menuManager.EjecutarAsync();
