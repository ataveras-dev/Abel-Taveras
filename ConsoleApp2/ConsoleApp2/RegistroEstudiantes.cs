using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

/// <summary>
/// Clase que gestiona el registro de estudiantes con persistencia en JSON
/// </summary>
public class RegistroEstudiantes
{
    private List<Estudiante> estudiantes = new List<Estudiante>();
    private const string ARCHIVO_DATOS = "estudiantes.json";
    private JsonSerializerOptions opciones = new JsonSerializerOptions { WriteIndented = true };

    public RegistroEstudiantes()
    {
        CargarDatos();
    }

    /// <summary>
    /// Agrega un nuevo estudiante al registro
    /// </summary>
    public void AgregarEstudiante(string nombre, string apellido, int edad)
    {
        if (string.IsNullOrWhiteSpace(nombre) || string.IsNullOrWhiteSpace(apellido))
        {
            throw new ArgumentException("El nombre y apellido no pueden estar vacíos.");
        }

        if (edad < 0 || edad > 120)
        {
            throw new ArgumentException("La edad debe estar entre 0 y 120 años.");
        }

        int nuevoID = estudiantes.Count > 0 ? estudiantes[estudiantes.Count - 1].ID + 1 : 1;
        Estudiante nuevoEstudiante = new Estudiante(nuevoID, nombre, apellido, edad);
        estudiantes.Add(nuevoEstudiante);

        Console.WriteLine($"\n✓ Estudiante '{nombre} {apellido}' agregado exitosamente con ID: {nuevoID}");
        GuardarDatos();
    }

    /// <summary>
    /// Elimina un estudiante del registro por su ID
    /// </summary>
    public void EliminarEstudiante(int id)
    {
        Estudiante? estudiante = estudiantes.Find(e => e.ID == id);

        if (estudiante == null)
        {
            throw new ArgumentException($"No se encontró estudiante con ID: {id}");
        }

        estudiantes.Remove(estudiante);
        Console.WriteLine($"\n✓ Estudiante con ID {id} eliminado exitosamente.");
        GuardarDatos();
    }

    /// <summary>
    /// Actualiza los datos de un estudiante existente
    /// </summary>
    public void ActualizarEstudiante(int id, string nombre, string apellido, int edad)
    {
        Estudiante? estudiante = estudiantes.Find(e => e.ID == id);

        if (estudiante == null)
        {
            throw new ArgumentException($"No se encontró estudiante con ID: {id}");
        }

        if (string.IsNullOrWhiteSpace(nombre) || string.IsNullOrWhiteSpace(apellido))
        {
            throw new ArgumentException("El nombre y apellido no pueden estar vacíos.");
        }

        if (edad < 0 || edad > 120)
        {
            throw new ArgumentException("La edad debe estar entre 0 y 120 años.");
        }

        estudiante.Nombre = nombre;
        estudiante.Apellido = apellido;
        estudiante.Edad = edad;

        Console.WriteLine($"\n✓ Estudiante con ID {id} actualizado exitosamente.");
        GuardarDatos();
    }

    /// <summary>
    /// Lista todos los estudiantes registrados en la consola
    /// </summary>
    public void ListarEstudiantes()
    {
        if (estudiantes.Count == 0)
        {
            Console.WriteLine("\n⚠ No hay estudiantes registrados.");
            return;
        }

        Console.WriteLine("\n========== LISTA DE ESTUDIANTES ==========");
        foreach (Estudiante e in estudiantes)
        {
            Console.WriteLine(e);
        }
        Console.WriteLine("==========================================");
    }

    /// <summary>
    /// Guarda la lista de estudiantes en un archivo JSON
    /// </summary>
    private void GuardarDatos()
    {
        try
        {
            string json = JsonSerializer.Serialize(estudiantes, opciones);
            File.WriteAllText(ARCHIVO_DATOS, json);
            Console.WriteLine("(Datos guardados en archivo)");
        }
        catch (IOException ex)
        {
            Console.WriteLine($"❌ Error al guardar el archivo: {ex.Message}");
        }
        catch (JsonException ex)
        {
            Console.WriteLine($"❌ Error de serialización JSON: {ex.Message}");
        }
    }

    /// <summary>
    /// Carga la lista de estudiantes desde el archivo JSON
    /// </summary>
    private void CargarDatos()
    {
        try
        {
            if (File.Exists(ARCHIVO_DATOS))
            {
                string json = File.ReadAllText(ARCHIVO_DATOS);
                if (!string.IsNullOrWhiteSpace(json))
                {
                    estudiantes = JsonSerializer.Deserialize<List<Estudiante>>(json) ?? new List<Estudiante>();
                    Console.WriteLine($"✓ Datos cargados exitosamente ({estudiantes.Count} estudiantes).\n");
                }
            }
            else
            {
                Console.WriteLine("ℹ Archivo de datos no encontrado. Se creará uno nuevo.\n");
            }
        }
        catch (FileNotFoundException ex)
        {
            Console.WriteLine($"❌ Error: Archivo no encontrado: {ex.Message}");
            estudiantes = new List<Estudiante>();
        }
        catch (IOException ex)
        {
            Console.WriteLine($"❌ Error al leer el archivo: {ex.Message}");
            estudiantes = new List<Estudiante>();
        }
        catch (JsonException ex)
        {
            Console.WriteLine($"❌ Error de deserialización JSON: {ex.Message}");
            estudiantes = new List<Estudiante>();
        }
    }
}
