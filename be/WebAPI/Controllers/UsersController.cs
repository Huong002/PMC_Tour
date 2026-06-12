using Core.DTOs.Requests;
using Core.DTOs.Responses;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Shared;
using WebAPI.Authorization;

namespace WebAPI.Controllers;

[Authorize]
public class UsersController : ApiControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }
    
    [HttpPost]
    [Route("create")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<int>>> Create(CreateUserCommand command, CancellationToken cancellationToken)
    {
        return await _userService.Create(command, cancellationToken);
    }
    
    [HttpPost]
    [Route("update/{id}")]
    public async Task<ActionResult<Result<int>>> Update(int id, UpdateUserCommand command, CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return await Result<int>.FailureAsync("The request Id and command Id must be the same");
        }
        
        return await _userService.Update(command, cancellationToken);
    }
    
    [HttpPost]
    [Route("delete/{id}")]
    public async Task<ActionResult<Result<int>>> Delete(int id, CancellationToken cancellationToken)
    {
        return await _userService.Delete(id, cancellationToken);
    }
    
    [HttpPost]
    [Route("delete-multi")]
    public async Task<ActionResult<Result<List<int>>>> DeteleMulti([FromBody] int[] ids, CancellationToken cancellationToken)
    {
        return await _userService.DeleteMulti(ids, cancellationToken);
    }
    
    [HttpGet]
    [Route("get-by-id/{id}")]
    public async Task<ActionResult<Result<UserDto>>> GetById(int id, CancellationToken cancellationToken)
    {
        return await _userService.GetUserById(id, cancellationToken);
    }
    
    [HttpGet]
    [Route("get-pagination")]
    public async Task<ActionResult<Result<UserDto>>> GetWithPagination([FromQuery] GetUsersWithPaginationQuery query, CancellationToken cancellationToken)
    {
        return await _userService.GetUsersWithPagination(query, cancellationToken);
    }
    
    [HttpPost]
    [Route("reset-password")]
    public async Task<ActionResult<Result<int>>> ResetPassword(ResetPasswordCommand command, CancellationToken cancellationToken)
    {
        return await _userService.ResetPassword(command, cancellationToken);
    }
    
    [HttpPost]
    [Route("change-password")]
    public async Task<ActionResult<Result<int>>> ChangePassword(ChangePasswordCommand command, CancellationToken cancellationToken)
    {
        return await _userService.ChangePassword(command, cancellationToken);
    }
    
    [HttpGet]
    [Route("me")]
    public async Task<ActionResult<Result<GetMeUserDto>>> GetMe(CancellationToken cancellationToken)
    {
        return await _userService.GetMe(cancellationToken);
    }
    
    [HttpGet]
    [Route("get-users-by-department/{departmentCode}")]
    public async Task<ActionResult<Result<List<UserByDepartment>>>> GetUserByDepartment([FromRoute] string departmentCode, CancellationToken cancellationToken)
    {
        return await _userService.GetUsersByDepartmentAsync(departmentCode, cancellationToken);
    }
}