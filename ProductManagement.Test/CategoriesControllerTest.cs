using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using ProductManagement.Controllers;
using ProductManagement.Data;
using ProductManagement.Dtos;
using ProductManagement.Services;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProductManagement.Test
{
    class CategoriesControllerTest
    {
        private readonly DbContextOptions<ShopDbContext> _dbContextOptions = new DbContextOptionsBuilder<ShopDbContext>()
            .UseInMemoryDatabase(databaseName: "ShopTestDb")
            .Options;
        private CategoriesController _controller;
        private ICategoryService _service;

        [OneTimeSetUp]
        public void SetUp()
        {
            SeedDb();
            var mockLogger = new Mock<ILogger<ICategoryService>>();
            _service = new CategoryService(new ShopDbContext(_dbContextOptions), mockLogger.Object);
            _controller = new CategoriesController(_service);
        }

        public async void SeedDb()
        {
            using var context = new ShopDbContext(_dbContextOptions);
            await context.SeedData();
        }

        [Test]
        public async Task Get_GetCategoriesAsync_Success()
        {
            using var context = new ShopDbContext(_dbContextOptions);
            var categories = await context.Categories.ToListAsync();
            
            var result = await _controller.GetCategoriesAsync();
            var resultData = (result.Result as OkObjectResult).Value as List<CategoryDto>;
            
            Assert.AreEqual(categories.Count, resultData.Count);
        }
    }
}
