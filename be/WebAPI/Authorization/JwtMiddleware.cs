using Core.Interfaces;

namespace WebAPI.Authorization;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IAppSettings _appSettings;

    public JwtMiddleware(RequestDelegate next, IAppSettings appSettings)
    {
        _next = next;
        _appSettings = appSettings;
    }

    public async Task Invoke(HttpContext context, IUserService userService, IJwtUtils jwtUtils)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
        var userId = jwtUtils.ValidateJwtToken(token);
        if (userId != null)
        {
            // attach user to context on successful jwt validation
            context.Items["User"] = (await userService.GetUserById(userId.Value)).Data;
            context.Items["UserId"] = userId.Value;
        }

        await _next(context);
    }
}