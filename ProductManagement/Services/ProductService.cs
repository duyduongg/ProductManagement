using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProductManagement.Data;
using ProductManagement.Dtos;
using ProductManagement.Dtos.ApiDtos;
using ProductManagement.Exceptions.BrandExceptions;
using ProductManagement.Exceptions.CategoryExceptions;
using ProductManagement.Exceptions.GeneralExceptions;
using ProductManagement.Exceptions.ProductExceptions;
using ProductManagement.Extensions;
using ProductManagement.Models;
using ProductManagement.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Services
{
    public class ProductService : IProductService
    {
        private readonly ShopDbContext _context;
        private readonly ILogger _logger;
        public ProductService(ShopDbContext context, ILogger<IProductService> logger) 
        {
            _context = context;

            _logger = logger;
        }
        public async Task<ProductDetailDto> GetProductDetailAsync(Guid productId)
        {
            if (!Helper.CheckGuidValidity(productId))
            {
                _logger.LogError($"Product with Id = {productId} is not valid");
                throw new ProductIdInvalidException("Product identifier not valid");
            }

            ProductDetailDto product;

            _logger.LogInfo($" Fetching product with Id = {productId}");

             product = await _context.Products
                .Where(p => p.Id == productId)
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .Select(p => new ProductDetailDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    Rating = p.Rating,
                    NumberRating = p.NumberRating,
                    Stock = p.Stock,
                    WarrantyMonth = p.WarrantyMonth,
                    BrandId = p.BrandId,
                    Brand = p.Brand.Name,
                    CategoryId = p.CategoryId,
                    Category = p.Category.Name,
                    Images = new List<string>()
                }).FirstOrDefaultAsync();

            if(product == null)
            {
                _logger.LogError($"Product with Id = {productId} is not found");
                throw new ProductNotFoundException("Product is not found");
            }

            return product;
        }

        public async Task<DataSourceResultDto<ProductDto>> GetProductsAsync(DataSourceRequestFilterDto<ProductDto> request)
        {
            IQueryable<Product> result = _context.Products;

            if (Helper.CheckGuidValidity(request.Filter.CategoryId)) 
            {
                result = result.Where(p => p.CategoryId == request.Filter.CategoryId);
            }

            if (Helper.CheckGuidValidity(request.Filter.BrandId))
            {
                result = result.Where(p => p.BrandId == request.Filter.BrandId);
            }

            if(request.Filter.Name != String.Empty)
            {
                result = result.Where(p => EF.Functions.FreeText(p.Name, request.Filter.Name));
            }

            return await result
                .Select(r => new ProductDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    Price = r.Price,
                    WarrantyMonth = r.WarrantyMonth,
                    BrandId = r.BrandId,
                    CategoryId = r.CategoryId,
                    Stock = r.Stock,
                    Brand = r.Brand.Name,
                    Category = r.Category.Name
                }).ApplyPaging(request.DataSourceRequest);
        }

        public async Task CreateOrUpdateProductAsync(ProductDetailDto dto)
        {
            if (!Helper.CheckGuidValidity(dto.BrandId))
            {
                _logger.LogError($"Brand with Id = {dto.BrandId} is not valid");
                throw new BrandIdInvalidException("Brand identifier not valid");
            }
            if (!Helper.CheckGuidValidity(dto.CategoryId))
            {
                _logger.LogError($"Category with Id = {dto.CategoryId} is not valid");
                throw new CategoryIdInvalidException("Category identifier not valid");
            }

            if (dto.Price <= 0 || dto.WarrantyMonth <= 0 || dto.Stock < 0)
            {
                _logger.LogError($"Product's information invalid");
                throw new ProductInformationInvalidException("Product's information is not valid");
            }

            var brand = await _context.Brands.FirstOrDefaultAsync(b => b.Id == dto.BrandId);
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == dto.CategoryId);


            if (await IsProductNameDuplicated(dto.Name))
            {
                _logger.LogInfo("Name duplicated, updating existing procut");
                var product = await _context.Products
                    .Include(p => p.Brand)
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.Name == dto.Name);

                product.BrandId = brand.Id;
                product.Brand = brand;
                product.CategoryId = category.Id;
                product.Category = category;
                product.WarrantyMonth = dto.WarrantyMonth;
                product.Price = dto.Price;
                product.Stock = dto.Stock;
            }
            else
            {
                _logger.LogInfo("Create new product");
                var product = new Product() { 
                    Name = dto.Name,
                    Stock = dto.Stock,
                    Price = dto.Price,
                    CategoryId = category.Id,
                    Category = category,
                    BrandId = brand.Id,
                    Brand = brand,
                    NumberRating = 0,
                    Rating = (decimal)0.0,
                    WarrantyMonth = dto.WarrantyMonth
                };
                await _context.Products.AddAsync(product);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<ProductDetailDto> StockProductAsync(StockDto dto)
        {
            if (!Helper.CheckGuidValidity(dto.Id))
            {
                _logger.LogError($"Product with Id = {dto.Id} is not valid");
                throw new ProductIdInvalidException("Product identifier not valid");
            }

            var product = await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == dto.Id);

            if (product == null)
            {
                _logger.LogError($"Cannot find product with Id = {dto.Id} to stock");
                throw new ProductNotFoundException("Product is not found");
            }

            product.Stock = (product.Stock + dto.sellNumber < 0 ? 0 : product.Stock + dto.sellNumber);
            await _context.SaveChangesAsync();

            return ConvertProductToProductDetailDto(product);
        }

        public async Task<bool> CheckDuplicatedProductNameAsync(string name)
        {
            if(name.Length == 0)
            {
                throw new EmptyStringException("Product name cannot be empty");
            }
            return await IsProductNameDuplicated(name);
        }

        private async Task<bool> IsProductNameDuplicated(string name)
        {
            StringComparer comparer = StringComparer.OrdinalIgnoreCase;
            return await _context.Products.AnyAsync(p => comparer.Compare(p.Name, name) == 0);
        }

        public async Task RemoveProductAsync(Guid productId)
        {
            if (!Helper.CheckGuidValidity(productId))
            {
                _logger.LogError($"Product with Id = {productId} is not valid");
                throw new ProductIdInvalidException("Product identifier not valid");
            }

            var product = await _context.Products.Where(p => p.Id == productId).FirstOrDefaultAsync();
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }
        private ProductDetailDto ConvertProductToProductDetailDto(Product product)
        {
            return new ProductDetailDto()
            {
                BrandId = product.BrandId,
                Brand = product.Brand.Name,
                CategoryId = product.CategoryId,
                Category = product.Category.Name,
                Id = product.Id,
                Name = product.Name,
                NumberRating = product.NumberRating,
                Rating = product.Rating,
                Price = product.Price,
                Stock = product.Stock,
                WarrantyMonth = product.WarrantyMonth
            };
        }
    }
}
