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
    class BrandsControllerTest
    {
        private readonly DbContextOptions<ShopDbContext> _dbContextOptions = new DbContextOptionsBuilder<ShopDbContext>()
    .UseInMemoryDatabase(databaseName: "ShopTestDb")
    .Options;
        private BrandsController _controller;
        private IBrandService _service;

        [OneTimeSetUp]
        public void SetUp()
        {
            SeedDb();
            var mockLogger = new Mock<ILogger<IBrandService>>();
            _service = new BrandService(new ShopDbContext(_dbContextOptions), mockLogger.Object);
            _controller = new BrandsController(_service);
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
            var brands = await context.Brands.ToListAsync();

            var result = await _controller.GetBrandsAsync();
            var resultData = (result.Result as OkObjectResult).Value as List<BrandDto>;

            Assert.AreEqual(brands.Count, resultData.Count);
        }
    }
}
