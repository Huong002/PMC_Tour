using Core.DTOs.Requests;
using Core.DTOs.Responses;
using Shared;

namespace Core.Interfaces;

public interface IUserService
{
    Task<Result<int>> Create(CreateUserCommand command, CancellationToken cancellationToken);
    Task<Result<int>> Update(UpdateUserCommand command, CancellationToken cancellationToken);
    Task<Result<int>> Delete(int id, CancellationToken cancellationToken);
    Task<Result<UserDto>> GetUserById(int id, CancellationToken cancellationToken = default);
    Task<Result<List<int>>> DeleteMulti(int[] ids, CancellationToken cancellationToken = default);
    Task<PaginatedResult<UserDto>> GetUsersWithPagination(GetUsersWithPaginationQuery query,
        CancellationToken cancellationToken = default);
    Task<Result<int>> ResetPassword(ResetPasswordCommand command,
        CancellationToken cancellationToken = default);

    Task<Result<int>> ChangePassword(ChangePasswordCommand command,
        CancellationToken cancellationToken = default);

    Task<Result<GetMeUserDto>> GetMe(CancellationToken cancellationToken = default);

    Task<Result<List<UserByDepartment>>> GetUsersByDepartmentAsync(string departmentCode, CancellationToken cancellationToken = default);
}