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
    public class BrandService : IBrandService
    {
        private readonly ShopDbContext _context;
        private readonly ILogger _logger;
        public BrandService(ShopDbContext context, ILogger<IBrandService> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task<ICollection<BrandDto>> GetBrandsAsync()
        {
            _logger.LogInfo("Fetch brands list from database");
            return await _context.Brands.Select(b => new BrandDto()
            {
                Id = b.Id,
                Name = b.Name
            }).ToListAsync();
        }
    }
}
