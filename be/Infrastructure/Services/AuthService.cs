using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Core.DTOs.Request;
using Core.DTOs.Response;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Shared;

namespace Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public AuthService(IUnitOfWork unitOfWork, IMapper mapper, IConfiguration configuration)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _configuration = configuration;
    }

    public async Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request)
    {
        var users = _unitOfWork.Users.GetQueryable();
        var user = await users.IgnoreQueryFilters()
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Username == request.Username || u.Email == request.Username);

        if (user == null || user.DeletedAt.HasValue)
            return ApiResponse<LoginResponse>.Fail("Invalid credentials", 401);

        if (!VerifyPassword(request.Password, user.PasswordHash))
            return ApiResponse<LoginResponse>.Fail("Invalid credentials", 401);

        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        await _unitOfWork.SaveChangesAsync();

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        var response = new LoginResponse
        {
            Token = token,
            RefreshToken = refreshToken,
            UserId = user.Id,
            Username = user.Username,
            FullName = user.FullName,
            Roles = roles
        };

        return ApiResponse<LoginResponse>.Ok(response, "Login successful");
    }

    public async Task<ApiResponse<LoginResponse>> RegisterAsync(RegisterRequest request)
    {
        var users = _unitOfWork.Users.GetQueryable();
        if (await users.IgnoreQueryFilters().AnyAsync(u => u.Username == request.Username))
            return ApiResponse<LoginResponse>.Fail("Username already exists");

        if (await users.IgnoreQueryFilters().AnyAsync(u => u.Email == request.Email))
            return ApiResponse<LoginResponse>.Fail("Email already exists");

        var customerRole = await _unitOfWork.Roles.FirstOrDefaultAsync(r => r.Name == "Customer");
        if (customerRole == null)
            return ApiResponse<LoginResponse>.Fail("Default role not found", 500);

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = HashPassword(request.Password),
            FullName = request.FullName,
            Phone = request.Phone,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };
        user.UserRoles.Add(new UserRole { RoleId = customerRole.Id });

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        await _unitOfWork.SaveChangesAsync();

        var response = new LoginResponse
        {
            Token = token,
            RefreshToken = refreshToken,
            UserId = user.Id,
            Username = user.Username,
            FullName = user.FullName,
            Roles = new List<string> { "Customer" }
        };

        return ApiResponse<LoginResponse>.Ok(response, "Registration successful");
    }

    public async Task<ApiResponse<LoginResponse>> RefreshTokenAsync(string refreshToken)
    {
        var users = _unitOfWork.Users.GetQueryable();
        var user = await users
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

        if (user == null || user.RefreshTokenExpiry < DateTime.UtcNow)
            return ApiResponse<LoginResponse>.Fail("Invalid or expired refresh token", 401);

        var token = GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        await _unitOfWork.SaveChangesAsync();

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        var response = new LoginResponse
        {
            Token = token,
            RefreshToken = newRefreshToken,
            UserId = user.Id,
            Username = user.Username,
            FullName = user.FullName,
            Roles = roles
        };

        return ApiResponse<LoginResponse>.Ok(response);
    }

    public async Task<ApiResponse<bool>> ChangePasswordAsync(int userId, ChangePasswordRequest request)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
            return ApiResponse<bool>.Fail("User not found", 404);

        if (!VerifyPassword(request.OldPassword, user.PasswordHash))
            return ApiResponse<bool>.Fail("Old password is incorrect");

        user.PasswordHash = HashPassword(request.NewPassword);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Password changed successfully");
    }

    public async Task<ApiResponse<bool>> UpdateProfileAsync(int userId, UpdateProfileRequest request)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
            return ApiResponse<bool>.Fail("User not found", 404);

        if (user.Email != request.Email)
        {
            var emailExists = await _unitOfWork.Users.GetQueryable().AnyAsync(u => u.Email == request.Email && u.Id != userId);
            if (emailExists)
                return ApiResponse<bool>.Fail("Email already exists");
        }

        user.FullName = request.FullName;
        user.Email = request.Email;
        user.Phone = request.Phone;

        var customer = await _unitOfWork.Customers.GetQueryable()
            .FirstOrDefaultAsync(c => c.UserId == userId || c.Email == user.Email);

        if (customer != null)
        {
            customer.FullName = request.FullName;
            customer.Email = request.Email;
            customer.Phone = request.Phone;
            customer.Address = request.Address;
            customer.DateOfBirth = request.DateOfBirth;
            customer.Nationality = request.Nationality;
            customer.PassportNumber = request.PassportNumber;
            customer.IdCard = request.IdCard;
            await _unitOfWork.Customers.UpdateAsync(customer);
        }
        else
        {
            // Tự động tạo Customer nếu chưa có
            var newCustomer = new Customer
            {
                UserId = userId,
                FullName = request.FullName,
                Email = request.Email,
                Phone = request.Phone,
                Address = request.Address,
                DateOfBirth = request.DateOfBirth,
                Nationality = request.Nationality,
                PassportNumber = request.PassportNumber,
                IdCard = request.IdCard,
                IsActive = true,
                CreatedAt = System.DateTime.UtcNow
            };
            await _unitOfWork.Customers.AddAsync(newCustomer);
        }

        await _unitOfWork.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true, "Profile updated successfully");
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Email, user.Email ?? ""),
        };

        foreach (var role in user.UserRoles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role.Role.Name));
        }

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        var randomBytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    private static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    private static bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}
