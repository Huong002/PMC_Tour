using Core.DTOs.Requests;
using Core.DTOs.Responses;
using Core.Entities;
using Core.Exceptions;
using Core.Interfaces;
using Infrastructure.Helpers;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class IdentityService : IIdentityService
{
    private readonly IUnitOfWork _unitOfWork;
    private IJwtUtils _jwtUtils;
    private readonly IAppSettings _appSettings;
    public IdentityService(IUnitOfWork unitOfWork, IJwtUtils jwtUtils, IAppSettings appSettings)
    {
        _unitOfWork = unitOfWork;
        _jwtUtils = jwtUtils; 
        _appSettings = appSettings; 
    }

    public async Task<AuthenticationResponse> LoginAsync(LoginCommand command, string ipAddress, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(command.UserName))
        {
            throw new ValidationCustomException(nameof(command.UserName),"Tài khoản không được trống.");
        }

        if (string.IsNullOrEmpty(command.Password))
        {
            throw new ValidationCustomException(nameof(command.Password), "Mật khẩu không được để trống.");
        }

        var user = await _unitOfWork.Repository<User>().Entities
            .Include(x => x.RefreshTokens)
            .Where(x => x.UserName == command.UserName && x.IsDeleted != true)
            .FirstOrDefaultAsync(cancellationToken);
        if (user == null)
            throw new ValidationCustomException(nameof(command.UserName), "Không tìm thấy tài khoản.");

        if (!PasswordHelper.VerifyPasswordHash(command.Password, user.PasswordHash, user.PasswordSalt))
        {
            throw new ValidationCustomException(nameof(command.Password), "Mật khẩu không chính xác.");
        } 
        var accessToken = _jwtUtils.GenerateJwtToken(user);
        var refreshToken = _jwtUtils.GenerateRefreshToken(user, ipAddress);
        user.RefreshTokens.Add(refreshToken);
        RemoveOldRefreshTokens(user);
        await _unitOfWork.Save(cancellationToken);

        var userAuth = new AuthenticatedUserResponse()
        {
            UserName = user.UserName,
            FullName = $"{user.LastName} {user.FirstName}",
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Type = user.Type,
        };
        
        return new AuthenticationResponse()
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token,
            User = userAuth,
        };
    }
    
    private void RemoveOldRefreshTokens(User user)
    {
        user.RefreshTokens.RemoveAll(x => 
            !x.IsActive && 
            x.Created.AddDays(_appSettings.RefreshTokenTTL) <= DateTime.UtcNow);
    }
}