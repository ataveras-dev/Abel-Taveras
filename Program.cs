using gestiondenomina.DAL;
using System;
using System.Globalization;
using System.Linq;

namespace gestiondenomina.UI
{
    class Program
    {
        static void Main(string[] args)
        {
            IEmpleadoRepository repo = new SqliteEmpleadoRepository();

            bool salir = false;
            while (!salir)
            {
                Console.WriteLine("\n--- Menú Nómina Servicios Corporativos Caribe SRL ---");
                Console.WriteLine("1) Agregar empleado");
                Console.WriteLine("2) Listar empleados");
                Console.WriteLine("3) Editar empleado");
                Console.WriteLine("4) Eliminar empleado");
                Console.WriteLine("5) Reporte mensual");
                Console.WriteLine("6) Cálculo de nómina:");
                Console.WriteLine("0) Salir");
                Console.Write("Seleccione una opción: ");
                var opt = Console.ReadLine();

                switch (opt)
                {
                    case "1":
                        AgregarEmpleado(repo);
                        break;
                    case "2":
                        ListarEmpleados(repo);
                        break;
                    case "3":
                        EditarEmpleado(repo);
                        break;
                    case "4":
                        EliminarEmpleado(repo);
                        break;
                    case "5":
                        ReporteMensual(repo);
                        break;
                    case "6":
                        CalculoNomina(repo);
                        break;
                    case "0":
                        salir = true;
                        break;
                    default:
                        Console.WriteLine("Opción inválida.");
                        break;
                }
            }
        }

        static void AgregarEmpleado(IEmpleadoRepository repo)
        {
            Console.WriteLine("-- Agregar empleado --");
            Console.Write("Nombre: ");
            var nombre = Console.ReadLine() ?? string.Empty;
            if (string.IsNullOrWhiteSpace(nombre))
            {
                Console.WriteLine("Nombre no puede estar vacío.");
                return;
            }

            Console.Write("Salario bruto: ");
            if (!decimal.TryParse(Console.ReadLine(), NumberStyles.Number, CultureInfo.InvariantCulture, out var salario) || salario < 0)
            {
                Console.WriteLine("Salario inválido.");
                return;
            }

            Console.Write("Fecha de ingreso (yyyy-MM-dd) o Enter para hoy: ");
            var fechaStr = Console.ReadLine();
            DateTime fecha;
            if (string.IsNullOrWhiteSpace(fechaStr)) fecha = DateTime.Today;
            else if (!DateTime.TryParse(fechaStr, out fecha))
            {
                Console.WriteLine("Fecha inválida.");
                return;
            }

            // Generar Id automático simple (max id + 1)
            var todos = repo.GetAll();
            int newId = todos.Any() ? todos.Max(e => e.Id) + 1 : 1;

            // Validar duplicados por nombre
            if (todos.Any(e => string.Equals(e.Nombre, nombre, StringComparison.OrdinalIgnoreCase)))
            {
                Console.WriteLine("Ya existe un empleado con ese nombre.");
                return;
            }

            var emp = new Gestiondenomina(newId, nombre, salario, fecha);
            repo.Add(emp);
            Console.WriteLine("Empleado agregado.");
        }

        static void ListarEmpleados(IEmpleadoRepository repo)
        {
            Console.WriteLine("-- Lista de empleados --");
            var todos = repo.GetAll();
            if (!todos.Any())
            {
                Console.WriteLine("No hay empleados.");
                return;
            }
            foreach (var e in todos)
            {
                e.MostrarDetalles();
            }
        }

        static void EditarEmpleado(IEmpleadoRepository repo)
        {
            Console.Write("ID de empleado a editar: ");
            if (!int.TryParse(Console.ReadLine(), out var id))
            {
                Console.WriteLine("ID inválido.");
                return;
            }
            var emp = repo.GetById(id);
            if (emp == null)
            {
                Console.WriteLine("Empleado no encontrado.");
                return;
            }

            Console.Write($"Nombre ({emp.Nombre}): ");
            var nombre = Console.ReadLine();
            if (!string.IsNullOrWhiteSpace(nombre)) emp.Nombre = nombre;

            Console.Write($"Salario bruto ({emp.SalarioBruto}): ");
            var salStr = Console.ReadLine();
            if (!string.IsNullOrWhiteSpace(salStr) && decimal.TryParse(salStr, NumberStyles.Number, CultureInfo.InvariantCulture, out var sal) && sal >= 0)
            {
                emp.SalarioBruto = sal;
            }

            Console.Write($"Fecha de ingreso ({emp.FechaIngreso.ToShortDateString()}): ");
            var f = Console.ReadLine();
            if (!string.IsNullOrWhiteSpace(f) && DateTime.TryParse(f, out var fecha)) emp.FechaIngreso = fecha;

            repo.Update(emp);
            Console.WriteLine("Empleado actualizado.");
        }

        static void EliminarEmpleado(IEmpleadoRepository repo)
        {
            Console.Write("ID de empleado a eliminar: ");
            if (!int.TryParse(Console.ReadLine(), out var id))
            {
                Console.WriteLine("ID inválido.");
                return;
            }
            var emp = repo.GetById(id);
            if (emp == null)
            {
                Console.WriteLine("Empleado no encontrado.");
                return;
            }
            Console.Write($"Confirma eliminar a {emp.Nombre}? (s/n): ");
            var c = Console.ReadLine();
            if (c?.ToLower() == "s")
            {
                repo.Delete(id);
                Console.WriteLine("Empleado eliminado.");
            }
            else
            {
                Console.WriteLine("Operación cancelada.");
            }
        }

        static void ReporteMensual(IEmpleadoRepository repo)
        {
            Console.WriteLine("-- Reporte Mensual --");
            Console.Write("Año (YYYY): ");
            if (!int.TryParse(Console.ReadLine(), out var year))
            {
                Console.WriteLine("Año inválido.");
                return;
            }
            Console.Write("Mes (1-12): ");
            if (!int.TryParse(Console.ReadLine(), out var month) || month < 1 || month > 12)
            {
                Console.WriteLine("Mes inválido.");
                return;
            }

            var todos = repo.GetAll();
            var filtrados = todos.Where(e => e.FechaIngreso.Year <= year && e.FechaIngreso.Month <= month).ToList();

            if (!filtrados.Any())
            {
                Console.WriteLine("No hay registros para el periodo indicado.");
                return;
            }

            decimal totalBruto = 0m;
            decimal totalAFP = 0m;
            decimal totalARS = 0m;
            decimal totalISR = 0m;
            decimal totalDeducciones = 0m;
            decimal totalNeto = 0m;

            Console.WriteLine("\n=== REPORTE DE NÓMINA ===");
            Console.WriteLine(string.Format("{0,-20} {1,12} {2,12} {3,12} {4,12} {5,12}", 
                "Empleado", "Bruto", "AFP(2.87%)", "ARS(3.04%)", "ISR(2%)", "Neto"));
            Console.WriteLine(new string('-', 92));

            foreach (var e in filtrados)
            {
                totalBruto += e.SalarioBruto;
                totalAFP += e.AFP;
                totalARS += e.ARS;
                totalISR += e.ISR;
                totalDeducciones += e.Deducciones;
                totalNeto += e.SalarioNeto;

                Console.WriteLine(string.Format("{0,-20} {1,12:C} {2,12:C} {3,12:C} {4,12:C} {5,12:C}",
                    e.Nombre, e.SalarioBruto, e.AFP, e.ARS, e.ISR, e.SalarioNeto));
            }
            
            Console.WriteLine(new string('-', 92));
            Console.WriteLine(string.Format("{0,-20} {1,12:C} {2,12:C} {3,12:C} {4,12:C} {5,12:C}",
                "TOTAL", totalBruto, totalAFP, totalARS, totalISR, totalNeto));
            Console.WriteLine($"\nTotal deducciones: {totalDeducciones:C}");
            Console.WriteLine($"Total a pagar (neto): {totalNeto:C}");
        }

        static void CalculoNomina(IEmpleadoRepository repo)
        {
            Console.WriteLine("-- Cálculo de Nómina (Exportar a CSV) --");
            Console.Write("Año (YYYY): ");
            if (!int.TryParse(Console.ReadLine(), out var year))
            {
                Console.WriteLine("Año inválido.");
                return;
            }
            Console.Write("Mes (1-12): ");
            if (!int.TryParse(Console.ReadLine(), out var month) || month < 1 || month > 12)
            {
                Console.WriteLine("Mes inválido.");
                return;
            }

            Console.Write("Nombre del archivo (ej: reporte_2025_11): ");
            var nombreArchivo = Console.ReadLine() ?? "reporte";

            var todos = repo.GetAll();
            var filtrados = todos.Where(e => e.FechaIngreso.Year <= year && e.FechaIngreso.Month <= month).ToList();

            if (!filtrados.Any())
            {
                Console.WriteLine("No hay registros para el periodo indicado.");
                return;
            }

            try
            {
                string rutaArchivo = $"{nombreArchivo}.csv";
                using (var writer = new System.IO.StreamWriter(rutaArchivo, false, System.Text.Encoding.UTF8))
                {
                    // Encabezado
                    writer.WriteLine("Empleado,Salario Bruto,AFP (2.87%),ARS (3.04%),ISR (2%),Deducciones,Salario Neto");

                    decimal totalBruto = 0m;
                    decimal totalAFP = 0m;
                    decimal totalARS = 0m;
                    decimal totalISR = 0m;
                    decimal totalDeducciones = 0m;
                    decimal totalNeto = 0m;

                    // Datos
                    foreach (var e in filtrados)
                    {
                        totalBruto += e.SalarioBruto;
                        totalAFP += e.AFP;
                        totalARS += e.ARS;
                        totalISR += e.ISR;
                        totalDeducciones += e.Deducciones;
                        totalNeto += e.SalarioNeto;

                        writer.WriteLine($"\"{e.Nombre}\",{e.SalarioBruto},{e.AFP},{e.ARS},{e.ISR},{e.Deducciones},{e.SalarioNeto}");
                    }

                    // Total
                    writer.WriteLine($"TOTAL,{totalBruto},{totalAFP},{totalARS},{totalISR},{totalDeducciones},{totalNeto}");
                }

                Console.WriteLine($"✓ Reporte exportado exitosamente a: {rutaArchivo}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al exportar: {ex.Message}");
            }
        }
    }
}

