using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Dtos
{
    public class BrandDto : BaseDto
    {
        public List<ProductDto> Products { get; set; }
    }
}
