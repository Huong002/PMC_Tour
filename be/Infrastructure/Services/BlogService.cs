using AutoMapper;
using Core.DTOs.Request;
using Core.DTOs.Response;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Infrastructure.Services;

public class BlogService : IBlogService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public BlogService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<PagedResult<BlogResponse>>> GetAllAsync(PagedRequest request)
    {
        var query = _unitOfWork.Blogs.GetQueryable().AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            var search = request.SearchTerm.ToLower();
            query = query.Where(b => b.Title.ToLower().Contains(search));
        }

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(b => b.PublishedAt ?? b.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var data = _mapper.Map<List<BlogResponse>>(items);
        return ApiResponse<PagedResult<BlogResponse>>.Ok(
            new PagedResult<BlogResponse>(data, total, request.Page, request.PageSize));
    }

    public async Task<ApiResponse<BlogResponse>> GetByIdAsync(int id)
    {
        var blog = await _unitOfWork.Blogs.GetByIdAsync(id);
        if (blog == null)
            return ApiResponse<BlogResponse>.Fail("Blog not found", 404);

        return ApiResponse<BlogResponse>.Ok(_mapper.Map<BlogResponse>(blog));
    }

    public async Task<ApiResponse<BlogResponse>> GetBySlugAsync(string slug)
    {
        var blog = await _unitOfWork.Blogs.FirstOrDefaultAsync(b => b.Slug == slug);
        if (blog == null)
            return ApiResponse<BlogResponse>.Fail("Blog not found", 404);

        return ApiResponse<BlogResponse>.Ok(_mapper.Map<BlogResponse>(blog));
    }

    public async Task<ApiResponse<BlogResponse>> CreateAsync(CreateBlogRequest request)
    {
        if (await _unitOfWork.Blogs.AnyAsync(b => b.Slug == request.Slug))
            return ApiResponse<BlogResponse>.Fail("Blog slug already exists");

        var blog = _mapper.Map<Blog>(request);
        blog.CreatedAt = DateTime.UtcNow;
        blog.IsActive = true;

        await _unitOfWork.Blogs.AddAsync(blog);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<BlogResponse>.Ok(_mapper.Map<BlogResponse>(blog), "Blog created successfully");
    }

    public async Task<ApiResponse<BlogResponse>> UpdateAsync(int id, UpdateBlogRequest request)
    {
        var blog = await _unitOfWork.Blogs.GetByIdAsync(id);
        if (blog == null)
            return ApiResponse<BlogResponse>.Fail("Blog not found", 404);

        _mapper.Map(request, blog);
        blog.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Blogs.UpdateAsync(blog);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<BlogResponse>.Ok(_mapper.Map<BlogResponse>(blog), "Blog updated successfully");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var blog = await _unitOfWork.Blogs.GetByIdAsync(id);
        if (blog == null)
            return ApiResponse<bool>.Fail("Blog not found", 404);

        blog.IsDeleted = true;
        blog.DeletedAt = DateTime.UtcNow;
        await _unitOfWork.Blogs.UpdateAsync(blog);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Blog deleted successfully");
    }
}
