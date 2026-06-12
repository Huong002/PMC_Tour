using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.DTOs.Requests;
using Core.DTOs.Responses;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Helpers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Shared;
using Shared.Extensions;

namespace Infrastructure.Services;

public class UserService: BaseService, IUserService
{
    private readonly ILogger<UserService> _logger;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IWebHostEnvironment _hostingEnvironment;
    public UserService(ILogger<UserService> logger, IUnitOfWork unitOfWork, IMapper mapper, IHttpContextAccessor httpContextAccessor,  IWebHostEnvironment hostingEnvironment) : base(httpContextAccessor)
    {
        _logger = logger;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _hostingEnvironment = hostingEnvironment;
    }

    public async Task<Result<int>> Create(CreateUserCommand command, CancellationToken cancellationToken)
    {
        var entity = _unitOfWork.Repository<User>().Entities
            .Where(x => x.UserName == command.UserName.ToLower() && x.IsDeleted != true).FirstOrDefault();

        if (entity != null)
            throw new Exception($"User {command.UserName} already exists.");

        entity = new User()
        {
            UserName = command.UserName.ToLower().Trim(),
            FirstName = command.FirstName,
            LastName = command.LastName,
            Email = command.Email,
            PhoneNumber = command.PhoneNumber,
            IsVerified = true,
            Type = command.Type,
        };
    
        byte[] passwordHash, passwordSalt;
        PasswordHelper.GeneratePasswordHash(command.UserName, out passwordHash, out passwordSalt);
        entity.PasswordHash = passwordHash;
        entity.PasswordSalt = passwordSalt;

        await _unitOfWork.Repository<User>().AddAsync(entity);
        await _unitOfWork.Save(cancellationToken);
        
        _logger.LogInformation($"User {command.UserName} has been created");
        return await Result<int>.SuccessAsync(entity.Id, "User Created.");
    }
    
    public async Task<Result<int>> Update(UpdateUserCommand command, CancellationToken cancellationToken)
    {
        var entity = _unitOfWork.Repository<User>().Entities.Where(x => x.UserName == command.UserName.ToLower() && x.IsDeleted != true).FirstOrDefault();

        if (entity == null)
            throw new Exception($"User {command.UserName} does not exist.");
    
        var checkEntityExist = _unitOfWork.Repository<User>().Entities.Where(x => x.Id == command.Id && x.UserName == command.UserName.ToLower() && x.IsDeleted != true).FirstOrDefault();
        if (checkEntityExist != null)
            throw new Exception($"User {command.UserName} already exists.");


        entity.UserName = command.UserName.ToLower().Trim();
        entity.FirstName = command.FirstName;
        entity.LastName = command.LastName;
        entity.Email = command.Email;
        entity.PhoneNumber = command.PhoneNumber;
        entity.Type = command.Type;

        await _unitOfWork.Repository<User>().UpdateAsync(entity);
        await _unitOfWork.Save(cancellationToken);
        
        _logger.LogInformation($"User {command.UserName} has been updated");
        return await Result<int>.SuccessAsync(entity.Id, "User Updated.");
    }

    public async Task<Result<int>> Delete(int id, CancellationToken cancellationToken)
    {
        var entity = _unitOfWork.Repository<User>().Entities.Where(x => x.Id == id && x.IsDeleted != true).FirstOrDefault();

        if (entity == null)
            throw new Exception($"User does not exist.");

        entity.IsDeleted = true;
        await _unitOfWork.Repository<User>().UpdateAsync(entity);
        await _unitOfWork.Save(cancellationToken);
        
        return await Result<int>.SuccessAsync(entity.Id, "User Deleted.");
    }
    
    public async Task<Result<List<int>>> DeleteMulti(int[] ids, CancellationToken cancellationToken = default)
    {
        var items = _unitOfWork.Repository<User>().Entities
            .Where(x => ids.Contains(x.Id) && x.IsDeleted != true)
            .ToList();
        foreach (var item in items)
        {
            item.IsDeleted = true;
            await _unitOfWork.Repository<User>().UpdateAsync(item);
        }
        await _unitOfWork.Save(cancellationToken);
        return await Result<List<int>>.SuccessAsync(items.Select(x => x.Id).ToList(), "User deleted successfully");  
    }

    public async Task<Result<UserDto>> GetUserById(int id, CancellationToken cancellationToken = default)
    {
        var entity = _unitOfWork.Repository<User>().Entities
            .FirstOrDefault(x => x.Id == id && x.IsDeleted != true);
        
        var role = _mapper.Map<UserDto>(entity);
        return await Result<UserDto>.SuccessAsync(role);
    }
    
    public async Task<PaginatedResult<UserDto>> GetUsersWithPagination(GetUsersWithPaginationQuery query,  CancellationToken cancellationToken = default)
    {
        var roleQuery = _unitOfWork.Repository<User>().Entities.Where(x => !x.IsDeleted);
        
        if (!string.IsNullOrEmpty(query.Keywords))
        {
            roleQuery = roleQuery.Where(x => x.UserName.Contains(query.Keywords.Trim()));
        }
        
        return await roleQuery
            .OrderByDescending(x => x.FirstName)
            .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
            .ToPaginatedListAsync(query.PageNumber, query.PageSize, cancellationToken);
    }

    
    public async Task<Result<int>> ResetPassword(ResetPasswordCommand command,
        CancellationToken cancellationToken = default)
    {
        var entity = _unitOfWork.Repository<User>().Entities.Where(x => x.UserName == command.UserName.ToLower() && x.IsDeleted != true).FirstOrDefault();
        if(entity == null)
            throw new Exception($"User {command.UserName} does not exist.");
        
        byte[] passwordHash, passwordSalt;
        PasswordHelper.GeneratePasswordHash(command.UserName, out passwordHash, out passwordSalt);
        entity.PasswordHash = passwordHash;
        entity.PasswordSalt = passwordSalt; 
        
        await _unitOfWork.Repository<User>().UpdateAsync(entity);
        await _unitOfWork.Save(cancellationToken);
        
        return await Result<int>.SuccessAsync(entity.Id, "Reset Password Successful.");
    }
    
    public async Task<Result<int>> ChangePassword(ChangePasswordCommand command,
        CancellationToken cancellationToken = default)
    {
        var entity = _unitOfWork.Repository<User>().Entities.Where(x => x.UserName == command.UserName.ToLower() && x.IsDeleted != true).FirstOrDefault();
        if(entity == null)
            throw new Exception($"User {command.UserName} does not exist.");
        
        if(command.NewPassword != command.OldPassword)
            throw new Exception($"Old passwords do not match.");
        
        if(command.NewPassword.Length < 5)
            throw new Exception("Old password must be at least 5 characters.");
        
        byte[] passwordHash, passwordSalt;
        PasswordHelper.GeneratePasswordHash(command.NewPassword, out passwordHash, out passwordSalt);
        entity.PasswordHash = passwordHash;
        entity.PasswordSalt = passwordSalt; 
        
        await _unitOfWork.Repository<User>().UpdateAsync(entity);
        await _unitOfWork.Save(cancellationToken);
        
        return await Result<int>.SuccessAsync(entity.Id, "Change Password Successful.");
    }

    public async Task<Result<GetMeUserDto>> GetMe(CancellationToken cancellationToken = default)
    {
        var user = await _unitOfWork.Repository<User>().Entities
            .Where(x => x.Id == UserId  && x.IsDeleted != true)
            .FirstOrDefaultAsync(cancellationToken);
        if (user == null)
            throw new Exception("Không tìm thấy tài khoản.");


        var getMeUser = new GetMeUserDto()
        {
            UserName = user.UserName,
            FullName = $"{user.FirstName} {user.LastName}",
            Email = user.Email,
            PhoneNumner = user.PhoneNumber,
            Type = user.Type,
        };
        
        return await Result<GetMeUserDto>.SuccessAsync(getMeUser, "Get Me");
    }

    public async Task<Result<List<UserByDepartment>>> GetUsersByDepartmentAsync(string departmentCode, CancellationToken cancellationToken = default)
    {
        var data = await _unitOfWork.Repository<UserSync>().Entities.Where(x => x.DepartmentId.ToLower() == departmentCode.ToLower() && x.IsDeleted != true).ProjectTo<UserByDepartment>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);
        
        return await Result<List<UserByDepartment>>.SuccessAsync(data, "Users by department");
    }

    private async Task<HttpClient> GetPersonProfileHttpClient()
    {
        var httpClient = new HttpClient();
        return httpClient;
    }
    private async Task<byte[]> GetFaceImage(string username)
    {     
        using var httpClient = await GetPersonProfileHttpClient();          
        var response = await httpClient.GetAsync($"http://171.242.12.145/api/v1/files/view-username/{username}");
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }
        return await response.Content.ReadAsByteArrayAsync();          
    }
}