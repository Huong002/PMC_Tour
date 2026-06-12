using Core.Interfaces;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class RoleService : IRoleService
{
    private readonly IUnitOfWork _unitOfWork;

    public RoleService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Role?> GetByIdAsync(int id)
    {
        return await _unitOfWork.Roles.GetByIdAsync(id);
    }

    public async Task<Role?> GetByNameAsync(string name)
    {
        return await _unitOfWork.Roles.FirstOrDefaultAsync(r => r.Name == name);
    }

    public async Task<IReadOnlyList<Role>> GetAllAsync()
    {
        return await _unitOfWork.Roles.GetAllAsync();
    }
}
