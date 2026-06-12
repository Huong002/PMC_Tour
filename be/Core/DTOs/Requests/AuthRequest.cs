namespace Core.DTOs.Requests;

public record LoginCommand(string UserName, string Password);