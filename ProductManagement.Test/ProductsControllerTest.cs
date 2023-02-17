using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using ProductManagement.Controllers;
using ProductManagement.Data;
using ProductManagement.Dtos;
using ProductManagement.Dtos.ApiDtos;
using ProductManagement.Exceptions.BrandExceptions;
using ProductManagement.Exceptions.CategoryExceptions;
using ProductManagement.Exceptions.GeneralExceptions;
using ProductManagement.Exceptions.ProductExceptions;
using ProductManagement.Services;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Test
{
    [TestFixture]
    public class ProductsControllerTest
    {
        private readonly DbContextOptions<ShopDbContext> _dbContextOptions = new DbContextOptionsBuilder<ShopDbContext>()
            .UseInMemoryDatabase(databaseName: "ShopTestDb")
            .Options;
        private ProductsController _controller;
        private IProductService _service;
        [OneTimeSetUp]
        public void Setup()
        {
            SeedDb();
            var mockLogger = new Mock<ILogger<IProductService>>();
            _service = new ProductService(new ShopDbContext(_dbContextOptions), mockLogger.Object);
            _controller = new ProductsController(_service);
        }

        public async void SeedDb()
        {
            using var context = new ShopDbContext(_dbContextOptions);
            await context.SeedData();
        }
        
        [Test]
        public void Get_GetProductDetailAsync_Throws_ProductIdInvalidException()
        {
            using var context = new ShopDbContext(_dbContextOptions);

            Assert.ThrowsAsync<ProductIdInvalidException>(async () => await _controller.GetProductDetailAsync(Guid.Empty));
        }

        [Test]
        public void Get_GetProductDetailAsync_Throws_ProductNotFoundException()
        {
            using var context = new ShopDbContext(_dbContextOptions);

            Assert.ThrowsAsync<ProductNotFoundException>(async () => await _controller.GetProductDetailAsync(Guid.NewGuid()));
        }

        [Test]
        public async Task Get_GetProductDetailAsync_Success()
        {
            using var context = new ShopDbContext(_dbContextOptions);
            var product = await context.Products.FirstOrDefaultAsync();

            var result = await _controller.GetProductDetailAsync(product.Id);
            var resultData = (result.Result as OkObjectResult).Value as ProductDetailDto;

            Assert.AreEqual(product.Id, resultData.Id);
        }

        [Test]
        public async Task Post_GetProductsAsync_Success()
        {
            using var context = new ShopDbContext(_dbContextOptions);
            DataSourceRequestFilterDto<ProductDto> request = new DataSourceRequestFilterDto<ProductDto>()
            {
                DataSourceRequest = new DataSourceRequestDto
                {
                    Skip = 0,
                    Take = 10,
                    Sorts = new List<SortFieldDto>
                    {
                        new SortFieldDto() {
                            Field = "Name",
                            Order = Enums.SortOrder.Asc,
                        }
                    }
                },
                Filter = new ProductDto
                {
                    BrandId = Guid.Empty,
                    CategoryId = Guid.Empty
                }
            };

            var result = await _controller.GetProductsAsync(request);
            var resultData = (result.Result as OkObjectResult).Value as DataSourceResultDto<ProductDto>;
            Assert.AreEqual(10, resultData.Data.Count);
        }

        [Test]
        public async Task Put_CreateOrUpdateProductAsync_Create_Throws_BrandIdInvalidException()
        {
            using var context = new ShopDbContext(_dbContextOptions);
            var product = await context.Products.FirstOrDefaultAsync();
            ProductDetailDto dto = new ProductDetailDto
            {
                Name = "New product name",
                BrandId = Guid.Empty,
                CategoryId = product.CategoryId,
                WarrantyMonth = 69,
                Price = 69000,
                Stock = 4
            };
            Assert.ThrowsAsync<BrandIdInvalidException>(async () => await _controller.CreateOrUpdateProductAsync(dto));
        }

        [Test]
        public async Task Put_CreateOrUpdateProductAsync_Throws_CategoryIdInvalidException()
        {
            using var context = new ShopDbContext(_dbContextOptions);
            var product = await context.Products.FirstOrDefaultAsync();
            ProductDetailDto dto = new ProductDetailDto
            {
                Name = "New product name",
                BrandId = product.BrandId,
                CategoryId = Guid.Empty,
                WarrantyMonth = 69,
                Price = 69000,
                Stock = 4
            };
            Assert.ThrowsAsync<CategoryIdInvalidException>(async () => await _controller.CreateOrUpdateProductAsync(dto));
        }

        [Test]
        public async Task Put_CreateOrUpdateProductAsync_Create_Success()
        {
            using var context = new ShopDbContext(_dbContextOptions);
            var brandId = await context.Brands.Select(b => b.Id).FirstOrDefaultAsync();
            var categoryId = await context.Categories.Select(c => c.Id).FirstOrDefaultAsync();
            string productName = "New product name";
            ProductDetailDto dto = new ProductDetailDto
            {
                Name = productName,
                BrandId = brandId,
                CategoryId = categoryId,
                WarrantyMonth = 69,
                Price = 69000,
                Stock = 4
            };

            await _controller.CreateOrUpdateProductAsync(dto);

            var product = await context.Products.Where(p => string.Equals(productName, p.Name, StringComparison.OrdinalIgnoreCase)).FirstOrDefaultAsync();

            Assert.NotNull(product);
        }

        [Test]
        public async Task Put_CreateOrUpdateProductAsync_Update_Success()
        {
            using var context = new ShopDbContext(_dbContextOptions);
            var brandId = await context.Brands.Select(b => b.Id).FirstOrDefaultAsync();
            var categoryId = await context.Categories.Select(c => c.Id).FirstOrDefaultAsync();
            string productName = await context.Products.Select(p => p.Name).FirstOrDefaultAsync();
            int warrantyMonth = 420;
            int price = 69000;
            int stock = 8;
            ProductDetailDto dto = new ProductDetailDto
            {
                Name = productName,
                BrandId = brandId,
                CategoryId = categoryId,
                WarrantyMonth = warrantyMonth,
                Price = price,
                Stock = stock
            };

            await _controller.CreateOrUpdateProductAsync(dto);
            var product = await context.Products.Where(p => string.Equals(productName, p.Name, StringComparison.OrdinalIgnoreCase)).FirstOrDefaultAsync();

            Assert.Multiple(() => 
            {
                Assert.AreEqual(product.Name, productName);
                Assert.AreEqual(product.BrandId, brandId);
                Assert.AreEqual(product.CategoryId, categoryId);
                Assert.AreEqual(product.WarrantyMonth, warrantyMonth);
                Assert.AreEqual(product.Price, price);
                Assert.AreEqual(product.Stock, stock);
            });
        }

        [Test]
        public void Patch_StockProductAsync_Throws_ProductIdInvalidException()
        {
            StockDto dto = new StockDto()
            {
                Id = Guid.Empty,
                sellNumber = 5
            };

            Assert.ThrowsAsync<ProductIdInvalidException>(async () => await _controller.StockProductAsync(dto));
        }

        [Test]
        public void Patch_StockProductAsync_Throws_ProductNotFoundException()
        {
            StockDto dto = new StockDto()
            {
                Id = Guid.NewGuid(),
                sellNumber = 13
            };

            Assert.ThrowsAsync<ProductNotFoundException>(async () => await _controller.StockProductAsync(dto));
        }
        [Test]
        public async Task Patch_StockProductAsync_Success()
        {
            using var context = new ShopDbContext(_dbContextOptions);
            var productInfo = await context.Products.Select(p => new { p.Stock, p.Id }).FirstOrDefaultAsync();
            var sellNumber = 4;
            var newStock = (uint)(productInfo.Stock + sellNumber < 0 ? 0 : productInfo.Stock + sellNumber);
            StockDto dto = new StockDto()
            {
                Id = productInfo.Id,
                sellNumber = sellNumber,
            };
            var result = await _controller.StockProductAsync(dto);
            var resultData = (result.Result as OkObjectResult).Value as ProductDetailDto;
            Assert.AreEqual(resultData.Stock, newStock);
        }

        [Test]
        public void Get_CheckDuplicatedProductNameAsync_Throws_EmptyStringException()
        {
            string newProductName = "";
            Assert.ThrowsAsync<EmptyStringException>(async () => await _controller.CheckDuplicatedProductNameAsync(newProductName));
        }

        [Test]
        public async Task Get_CheckDuplicatedProductNameAsync_ReturnTrue()
        {
            using var context = new ShopDbContext(_dbContextOptions);
            var existingProductName = "Bàn phím Steelseries Apex 3";

            var result = await _controller.CheckDuplicatedProductNameAsync(existingProductName);
            var resultData = (bool)(result.Result as OkObjectResult).Value;

            Assert.IsTrue(resultData);
        }

        [Test]
        public async Task Get_CheckDuplicatedProductNameAsync_ReturnFalse()
        {
            string newProductName = "Definitely not an existing product name";

            var result = await _controller.CheckDuplicatedProductNameAsync(newProductName);
            var resultData = (bool)(result.Result as OkObjectResult).Value;

            Assert.IsFalse(resultData);
        }

        [Test]
        public void Delete_RemoveProductsAsync_Throws_ProductNotFoundException()
        {
            using var context = new ShopDbContext(_dbContextOptions);

            Assert.ThrowsAsync<ProductIdInvalidException>(async () => await _controller.RemoveProductAsync(new List<Guid>() { Guid.Empty }));
        }

        [Test]
        public async Task Delete_RemoveProductAsync_Success()
        {
            using var context = new ShopDbContext(_dbContextOptions);
            var guids = await context.Products.Select(p => p.Id).Take(3).ToListAsync();
            var count = await context.Products.CountAsync();
            await _controller.RemoveProductAsync(guids);
            Assert.AreEqual(0, await context.Products.Where(p => guids.Contains(p.Id)).CountAsync());
        }
    }
}