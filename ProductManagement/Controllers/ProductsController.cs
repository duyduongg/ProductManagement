using Microsoft.AspNetCore.Mvc;
using ProductManagement.Services;
using System;
using System.Threading.Tasks;
using ProductManagement.Dtos;
using ProductManagement.Dtos.ApiDtos;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using ProductManagement.Shared.Attributes;
using ProductManagement.Shared.Classes;

namespace ProductManagement.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _service;

        public ProductsController(IProductService service)
        {
            _service = service;
        }

        // POST: /Products
        [HttpPost]
        public async Task<ActionResult<DataSourceResultDto<ProductDto>>> GetProductsAsync(
            [FromBody] DataSourceRequestFilterDto<ProductDto> request)
        {
            var result = await _service.GetProductsAsync(request);
            return Ok(result);
        }

        // GET: /Products?productId=
        [HttpGet]
        public async Task<ActionResult<ProductDetailDto>> GetProductDetailAsync(Guid productId)
        {
            var result = await _service.GetProductDetailAsync(productId);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        // PUT: /Products/New
        [HttpPut]
        [Route("New")]
        [RolesAuthorize(Roles.Admin)]
        public async Task<ActionResult> CreateOrUpdateProductAsync([FromBody] ProductDetailDto dto)
        {
            await _service.CreateOrUpdateProductAsync(dto);
            return Ok();
        }

        // PATCH: /Products/Stock
        [HttpPatch]
        [Route("Stock")]
        [RolesAuthorize(Roles.Employee, Roles.Admin)]
        [HttpPost]
        public async Task<ActionResult<ProductDetailDto>> StockProductAsync([FromBody] StockDto dto)
        {
            var productDetail = await _service.StockProductAsync(dto);
            return Ok(productDetail);
        }

        // GET: /Products/Name/Duplicate
        [Route("Name/Duplicate")]
        [HttpGet]
        public async Task<ActionResult<bool>> CheckDuplicatedProductNameAsync(string name)
        {
            var result = await _service.CheckDuplicatedProductNameAsync(name);
            return Ok(result);
        }

        // POST: /Products/Remove
        [HttpPost("/Remove")]
        [RolesAuthorize(Roles.Admin)]
        public async Task<ActionResult> RemoveProductAsync([FromBody] List<Guid> productIds)
        {
            await _service.RemoveProductAsync(productIds);
            return Ok();
        }
    }
}
