using Core.Enums;
using Microsoft.AspNetCore.Http;

namespace Core.DTOs.Requests;

public record CreateUserCommand(string UserName, string FirstName, string LastName, string? Email, string? PhoneNumber, EUserType Type);
public record UpdateUserCommand(int Id, string UserName, string FirstName, string LastName, string? Email, string? PhoneNumber, EUserType Type);
public record GetUsersWithoutInActivityWithPaginationQuery(int ActivityId, int PageNumber, int PageSize, string? Keywords);
public record GetUsersWithPaginationQuery(int PageNumber, int PageSize, string? Keywords);
public record UpdateAvatarUserCommand(string UserName, IFormFile FileUpload);
public record ResetPasswordCommand(string UserName);
public record ChangePasswordCommand(string UserName, string OldPassword, string NewPassword);