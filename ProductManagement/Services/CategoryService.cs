using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProductManagement.Data;
using ProductManagement.Dtos;
using ProductManagement.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ShopDbContext _context;
        private readonly ILogger _logger;

        public CategoryService(ShopDbContext context, ILogger<ICategoryService> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task<ICollection<CategoryDto>> GetCategoriesAsync()
        {
            _logger.LogInfo("Fetching categories list from database");
            return await _context.Categories.Select(c => new CategoryDto()
            {
                Id = c.Id,
                Name = c.Name
            }).ToListAsync();
        }
    }
}
