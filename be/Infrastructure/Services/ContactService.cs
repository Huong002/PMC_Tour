using AutoMapper;
using Core.DTOs.Request;
using Core.DTOs.Response;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Infrastructure.Services;

public class ContactService : IContactService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ContactService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<ContactResponse>> CreateAsync(CreateContactRequest request)
    {
        var contact = _mapper.Map<ContactMessage>(request);
        contact.CreatedAt = DateTime.UtcNow;

        await _unitOfWork.ContactMessages.AddAsync(contact);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<ContactResponse>.Ok(_mapper.Map<ContactResponse>(contact), "Message sent successfully");
    }

    public async Task<ApiResponse<PagedResult<ContactResponse>>> GetAllAsync(PagedRequest request)
    {
        var query = _unitOfWork.ContactMessages.GetQueryable().AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            var search = request.SearchTerm.ToLower();
            query = query.Where(c => c.Name.ToLower().Contains(search)
                                     || c.Email.ToLower().Contains(search)
                                     || c.Subject.ToLower().Contains(search));
        }

        var total = await query.CountAsync();
        var items = await query.Where(c => !c.IsDeleted)
            .OrderByDescending(c => c.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var data = _mapper.Map<List<ContactResponse>>(items);
        return ApiResponse<PagedResult<ContactResponse>>.Ok(
            new PagedResult<ContactResponse>(data, total, request.Page, request.PageSize));
    }

    public async Task<ApiResponse<ContactResponse>> GetByIdAsync(int id)
    {
        var contact = await _unitOfWork.ContactMessages.GetQueryable()
            .FirstOrDefaultAsync(c => c.Id == id);

        if (contact == null)
            return ApiResponse<ContactResponse>.Fail("Message not found", 404);

        return ApiResponse<ContactResponse>.Ok(_mapper.Map<ContactResponse>(contact));
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var contact = await _unitOfWork.ContactMessages.GetByIdAsync(id);
        if (contact == null)
            return ApiResponse<bool>.Fail("Message not found", 404);

        contact.IsDeleted = true;
        contact.DeletedAt = DateTime.UtcNow;
        await _unitOfWork.ContactMessages.UpdateAsync(contact);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Message deleted successfully");
    }
}
