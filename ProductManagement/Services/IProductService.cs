using ProductManagement.Dtos;
using ProductManagement.Dtos.ApiDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Services
{
    public interface IProductService
    {
        public Task<DataSourceResultDto<ProductDto>> GetProductsAsync(DataSourceRequestFilterDto<ProductDto> request);
        public Task<ProductDetailDto> GetProductDetailAsync(Guid productId);
        public Task CreateOrUpdateProductAsync(ProductDetailDto dto);
        public Task<ProductDetailDto> StockProductAsync(StockDto dto);
        public Task RemoveProductAsync(Guid productId);
        public Task<bool> CheckDuplicatedProductNameAsync(string name);

    }
}
