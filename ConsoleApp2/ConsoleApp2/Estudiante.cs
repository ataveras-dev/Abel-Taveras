using System.Text.Json.Serialization;

/// <summary>
/// Clase que representa un estudiante con sus atributos básicos
/// </summary>
public class Estudiante
{
    [JsonPropertyName("id")]
    public int ID { get; set; }

    [JsonPropertyName("nombre")]
    public string Nombre { get; set; } = string.Empty;

    [JsonPropertyName("apellido")]
    public string Apellido { get; set; } = string.Empty;

    [JsonPropertyName("edad")]
    public int Edad { get; set; }

    public Estudiante() { }

    public Estudiante(int id, string nombre, string apellido, int edad)
    {
        ID = id;
        Nombre = nombre;
        Apellido = apellido;
        Edad = edad;
    }

    public override string ToString()
    {
        return $"ID: {ID}, Nombre: {Nombre}, Apellido: {Apellido}, Edad: {Edad}";
    }
}
