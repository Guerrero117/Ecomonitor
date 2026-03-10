namespace backend_iot.Models
{
    // 1. El modelo del Usuario (Lo que vive en la base de datos)
    public class User
    {
        // El correo del usuario
        public string Email { get; set; } = string.Empty;
        
        // ¡OJO AQUÍ! No se llama Password, se llama PasswordHash. 
        // Es la caja donde guardamos la clave ya encriptada (hecha símbolos).
        public string PasswordHash { get; set; } = string.Empty;
    }

    // 2. El modelo de Login (Lo que el usuario escribe en la pantalla)
    // Se le pone "Dto" porque es un "Objeto de Transferencia de Datos".
    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        
        // Aquí sí recibimos la contraseña tal cual la escribe el usuario 
        // para poder procesarla y compararla.
        public string Password { get; set; } = string.Empty;
    }
}