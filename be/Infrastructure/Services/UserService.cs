using System.Linq.Expressions;
using AutoMapper;
using Core.DTOs.Request;
using Core.DTOs.Response;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Infrastructure.Services;

public class UserService : IUserService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UserService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PagedResult<UserResponse>> GetPagedAsync(PagedRequest request)
    {
        var query = _unitOfWork.Users.GetQueryable()
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
            .AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            var search = request.SearchTerm.ToLower();
            query = query.Where(u => u.Username.ToLower().Contains(search) || u.FullName.ToLower().Contains(search));
        }

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        return new PagedResult<UserResponse>(_mapper.Map<List<UserResponse>>(items), total, request.Page, request.PageSize);
    }

    public async Task<UserResponse?> GetByIdAsync(int id)
    {
        var user = await GetEntityByIdAsync(id);
        return user == null ? null : _mapper.Map<UserResponse>(user);
    }

    public async Task<UserResponse> CreateAsync(CreateUserRequest request)
    {
        var user = _mapper.Map<User>(request);
        user.CreatedAt = DateTime.UtcNow;
        user.IsActive = true;

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<UserResponse>(user);
    }

    public async Task<UserResponse?> UpdateAsync(int id, UpdateUserRequest request)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        if (user == null) return null;

        _mapper.Map(request, user);
        user.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<UserResponse>(user);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        if (user == null) return false;

        user.IsDeleted = true;
        user.DeletedAt = DateTime.UtcNow;
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ToggleActiveAsync(int id)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        if (user == null) return false;

        user.IsActive = !user.IsActive;
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<UserResponse?> GetByUsernameAsync(string username)
    {
        var user = await GetEntityByUsernameAsync(username);
        return user == null ? null : _mapper.Map<UserResponse>(user);
    }

    public async Task<User?> GetEntityByIdAsync(int id)
    {
        return await _unitOfWork.Users.GetQueryable()
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetEntityByUsernameAsync(string username)
    {
        return await _unitOfWork.Users.GetQueryable()
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<IReadOnlyList<User>> GetAllEntitiesAsync()
    {
        return await _unitOfWork.Users.GetQueryable()
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
            .ToListAsync();
    }

    public async Task<User> CreateEntityAsync(User user)
    {
        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();
        return user;
    }

    public async Task UpdateEntityAsync(User user)
    {
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public Task<bool> EntityExistsAsync(Expression<Func<User, bool>> predicate)
    {
        return _unitOfWork.Users.AnyAsync(predicate);
    }
}
