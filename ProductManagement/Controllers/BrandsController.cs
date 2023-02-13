using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductManagement.Dtos;
using ProductManagement.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class BrandsController : ControllerBase
    {
        private readonly IBrandService _service;
        public BrandsController(IBrandService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<BrandDto>>> GetBrandsAsync()
        {
            var result = await _service.GetBrandsAsync();
            return Ok(result);
        }
    }
}
