using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Models
{
    public class Product : BaseEntity
    {
        public string Name { get; set; }
        public double Price { get; set; }
        public decimal Rating { get; set; }
        public int NumberRating { get; set; }
        public int WarrantyMonth { get; set; }
        public int Stock { get; set; }
        public Brand Brand { get; set; }
        public Guid BrandId { get; set; }
        public Category Category { get; set; }
        public Guid CategoryId { get; set; }
    }
}
