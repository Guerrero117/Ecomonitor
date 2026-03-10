namespace backend_iot.Services
{
    // Esta es la "Interface". Piensa en ella como un contrato o una lista de reglas.
    public interface IAuthService
    {
        // Aquí dice: "Cualquier servicio que sea de Autenticación 
        // DEBE tener una función llamada Login que reciba un correo y una clave".
        
        // El "string?" con el signo de pregunta significa que puede devolver 
        // un Token si todo sale bien, o un "null" (nada) si el usuario no existe.
        string? Login(string email, string password);
    }
}