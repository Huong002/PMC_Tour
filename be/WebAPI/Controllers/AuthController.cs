using Core.DTOs.Requests;
using Core.DTOs.Responses;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Shared;
using WebAPI.Authorization;

namespace WebAPI.Controllers;

public class AuthController : ApiControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly IIdentityService _identityService;
    public AuthController(ILogger<AuthController> logger, IIdentityService identityService)
    {
        _logger = logger;
        _identityService = identityService;
    }
    
    [AllowAnonymous]
    [HttpPost]
    [Route("login")]
    public async Task<ActionResult<Result<AuthenticationResponse>>> Create(LoginCommand command, CancellationToken cancellationToken)
    {
        var data = await _identityService.LoginAsync(command, IpAddress(), cancellationToken);
        SetTokenCookie(data.RefreshToken);
        return await Result<AuthenticationResponse>.SuccessAsync(data, "Đăng nhập thành công.");
    }
    
    private void SetTokenCookie(string token)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        Response.Cookies.Append("refreshToken", token, cookieOptions);
    }

    private string IpAddress()
    {
        if (Request.Headers.ContainsKey("X-Forwarded-For"))
            return Request.Headers["X-Forwarded-For"];
        else
            return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
    }
}