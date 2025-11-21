using System;

// Programa principal
class Program
{
    static void Main()
    {
        RegistroEstudiantes registro = new RegistroEstudiantes();
        bool continuar = true;

        Console.WriteLine("╔════════════════════════════════════════════════════╗");
        Console.WriteLine("║   SISTEMA DE REGISTRO DE ESTUDIANTES              ║");
        Console.WriteLine("╚════════════════════════════════════════════════════╝\n");

        while (continuar)
        {
            MostrarMenu();

            try
            {
                Console.Write("\nSeleccione una opción: ");
                string entrada = Console.ReadLine() ?? string.Empty;

                if (!int.TryParse(entrada, out int opcion))
                {
                    Console.WriteLine("❌ Error: Debe ingresar un número válido.");
                    continue;
                }

                switch (opcion)
                {
                    case 1:
                        AgregarEstudiante(registro);
                        break;
                    case 2:
                        EliminarEstudiante(registro);
                        break;
                    case 3:
                        ActualizarEstudiante(registro);
                        break;
                    case 4:
                        registro.ListarEstudiantes();
                        break;
                    case 5:
                        continuar = false;
                        Console.WriteLine("\n¡Hasta luego!");
                        break;
                    default:
                        throw new ArgumentException($"Opción '{opcion}' no válida. Intente nuevamente.");
                }
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"⚠ Advertencia: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error inesperado: {ex.Message}");
            }
        }
    }

    static void MostrarMenu()
    {
        Console.WriteLine("\n-------- MENÚ DE OPCIONES --------");
        Console.WriteLine("1. Agregar un estudiante");
        Console.WriteLine("2. Eliminar un estudiante");
        Console.WriteLine("3. Actualizar un estudiante");
        Console.WriteLine("4. Listar estudiantes");
        Console.WriteLine("5. Salir del programa");
        Console.WriteLine("----------------------------------");
    }

    static void AgregarEstudiante(RegistroEstudiantes registro)
    {
        try
        {
            Console.Write("\nIngrese el nombre del estudiante: ");
            string nombre = Console.ReadLine() ?? string.Empty;

            Console.Write("Ingrese el apellido del estudiante: ");
            string apellido = Console.ReadLine() ?? string.Empty;

            Console.Write("Ingrese la edad del estudiante: ");
            if (!int.TryParse(Console.ReadLine(), out int edad))
            {
                throw new ArgumentException("La edad debe ser un número válido.");
            }

            registro.AgregarEstudiante(nombre, apellido, edad);
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine($"⚠ Advertencia: {ex.Message}");
        }
    }

    static void EliminarEstudiante(RegistroEstudiantes registro)
    {
        try
        {
            Console.Write("\nIngrese el ID del estudiante a eliminar: ");
            if (!int.TryParse(Console.ReadLine(), out int id))
            {
                throw new ArgumentException("El ID debe ser un número válido.");
            }

            registro.EliminarEstudiante(id);
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine($"⚠ Advertencia: {ex.Message}");
        }
    }

    static void ActualizarEstudiante(RegistroEstudiantes registro)
    {
        try
        {
            Console.Write("\nIngrese el ID del estudiante a actualizar: ");
            if (!int.TryParse(Console.ReadLine(), out int id))
            {
                throw new ArgumentException("El ID debe ser un número válido.");
            }

            Console.Write("Ingrese el nuevo nombre: ");
            string nombre = Console.ReadLine() ?? string.Empty;

            Console.Write("Ingrese el nuevo apellido: ");
            string apellido = Console.ReadLine() ?? string.Empty;

            Console.Write("Ingrese la nueva edad: ");
            if (!int.TryParse(Console.ReadLine(), out int edad))
            {
                throw new ArgumentException("La edad debe ser un número válido.");
            }

            registro.ActualizarEstudiante(id, nombre, apellido, edad);
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine($"⚠ Advertencia: {ex.Message}");
        }
    }
}
