using AutoMapper;
using Core.DTOs.Request;
using Core.DTOs.Response;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Infrastructure.Services;

public class CustomerService : ICustomerService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CustomerService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<PagedResult<CustomerResponse>>> GetAllAsync(PagedRequest request)
    {
        var query = _unitOfWork.Customers.GetQueryable()
            .Include(c => c.User)
                .ThenInclude(u => u!.UserRoles)
                    .ThenInclude(ur => ur.Role)
            .AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            var search = request.SearchTerm.ToLower();
            query = query.Where(c => c.FullName.ToLower().Contains(search) || c.Phone!.ToLower().Contains(search));
        }

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(c => c.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var data = _mapper.Map<List<CustomerResponse>>(items);
        return ApiResponse<PagedResult<CustomerResponse>>.Ok(
            new PagedResult<CustomerResponse>(data, total, request.Page, request.PageSize));
    }

    public async Task<ApiResponse<CustomerResponse>> GetByIdAsync(int id)
    {
        var customer = await _unitOfWork.Customers.GetQueryable()
            .Include(c => c.Bookings)
            .Include(c => c.User)
                .ThenInclude(u => u!.UserRoles)
                    .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (customer == null)
            return ApiResponse<CustomerResponse>.Fail("Customer not found", 404);

        return ApiResponse<CustomerResponse>.Ok(_mapper.Map<CustomerResponse>(customer));
    }

    public async Task<ApiResponse<CustomerResponse>> CreateAsync(CreateCustomerRequest request)
    {
        var customer = _mapper.Map<Customer>(request);
        customer.CreatedAt = DateTime.UtcNow;

        await _unitOfWork.Customers.AddAsync(customer);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<CustomerResponse>.Ok(_mapper.Map<CustomerResponse>(customer), "Customer created successfully");
    }

    public async Task<ApiResponse<CustomerResponse>> UpdateAsync(int id, UpdateCustomerRequest request)
    {
        var customer = await _unitOfWork.Customers.GetQueryable()
            .Include(c => c.User)
                .ThenInclude(u => u!.UserRoles)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (customer == null)
            return ApiResponse<CustomerResponse>.Fail("Customer not found", 404);

        _mapper.Map(request, customer);
        customer.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrEmpty(request.Role) && customer.UserId.HasValue)
        {
            var user = customer.User;
            if (user != null)
            {
                // Delete old roles
                var userRoles = await _unitOfWork.Repository<UserRole>().GetQueryable()
                    .Where(ur => ur.UserId == user.Id)
                    .ToListAsync();
                foreach (var ur in userRoles)
                {
                    await _unitOfWork.Repository<UserRole>().DeleteAsync(ur);
                }

                // Add new role
                var role = await _unitOfWork.Roles.GetQueryable()
                    .FirstOrDefaultAsync(r => r.Name.ToLower() == request.Role.ToLower());
                if (role != null)
                {
                    await _unitOfWork.Repository<UserRole>().AddAsync(new UserRole
                    {
                        UserId = user.Id,
                        RoleId = role.Id
                    });
                }
            }
        }

        await _unitOfWork.Customers.UpdateAsync(customer);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<CustomerResponse>.Ok(_mapper.Map<CustomerResponse>(customer), "Customer updated successfully");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id, int currentUserId)
    {
        var customer = await _unitOfWork.Customers.GetByIdAsync(id);
        if (customer == null)
            return ApiResponse<bool>.Fail("Customer not found", 404);

        if (customer.UserId == currentUserId)
            return ApiResponse<bool>.Fail("Bạn không thể tự khóa tài khoản của chính mình", 400);

        customer.IsDeleted = true;
        customer.DeletedAt = DateTime.UtcNow;
        await _unitOfWork.Customers.UpdateAsync(customer);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Customer deleted successfully");
    }

    public async Task<ApiResponse<CustomerResponse>> GetCurrentCustomerAsync(int userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
            return ApiResponse<CustomerResponse>.Fail("User not found", 404);

        var customer = await _unitOfWork.Customers.GetQueryable()
            .FirstOrDefaultAsync(c => c.Email == user.Email && !c.IsDeleted);

        if (customer == null)
        {
            customer = new Customer
            {
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            await _unitOfWork.Customers.AddAsync(customer);
            await _unitOfWork.SaveChangesAsync();
        }

        return ApiResponse<CustomerResponse>.Ok(_mapper.Map<CustomerResponse>(customer));
    }
}
