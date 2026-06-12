using Core.DTOs.Requests;
using Core.DTOs.Responses;

namespace Core.Interfaces;

public interface IIdentityService
{
    Task<AuthenticationResponse> LoginAsync(LoginCommand command, string ipAddress, CancellationToken cancellationToken);
}