using System.Linq.Expressions;
using Core.DTOs.Request;
using Core.DTOs.Response;
using Core.Entities;
using Shared;

namespace Core.Interfaces;

public interface IUserService
{
    // DTO methods
    Task<PagedResult<UserResponse>> GetPagedAsync(PagedRequest request);
    Task<UserResponse?> GetByIdAsync(int id);
    Task<UserResponse> CreateAsync(CreateUserRequest request);
    Task<UserResponse?> UpdateAsync(int id, UpdateUserRequest request);
    Task<bool> DeleteAsync(int id);
    Task<bool> ToggleActiveAsync(int id);
    Task<UserResponse?> GetByUsernameAsync(string username);

    // Entity methods for middleware/internal use
    Task<User?> GetEntityByIdAsync(int id);
    Task<User?> GetEntityByUsernameAsync(string username);
    Task<IReadOnlyList<User>> GetAllEntitiesAsync();
    Task<User> CreateEntityAsync(User user);
    Task UpdateEntityAsync(User user);
    Task<bool> EntityExistsAsync(Expression<Func<User, bool>> predicate);
}
