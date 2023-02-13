using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Dtos
{
    public class ProductDetailDto : ProductDto
    {
        public decimal Rating { get; set; }
        public int NumberRating { get; set; }
        public List<string> Images { get; set; }
    }
}
