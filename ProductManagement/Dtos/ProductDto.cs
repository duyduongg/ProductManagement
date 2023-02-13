using System;

namespace ProductManagement.Dtos
{
    public class ProductDto : BaseDto
    {
        public double Price { get; set; }
        public int Stock { get; set; }
        public int WarrantyMonth { get; set; }
        public string Thumbnail { get; set; } = string.Empty;
        public Guid? CategoryId { get; set; }
        public Guid? BrandId { get; set; }
        public string Category { get; set; }
        public string Brand { get; set; }
    }
}
