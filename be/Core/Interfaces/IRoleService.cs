using Core.Entities;

namespace Core.Interfaces;

public interface IRoleService
{
    Task<Role?> GetByIdAsync(int id);
    Task<Role?> GetByNameAsync(string name);
    Task<IReadOnlyList<Role>> GetAllAsync();
}
