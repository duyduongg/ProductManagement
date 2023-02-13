using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Models
{
    public class Brand : BaseEntity
    {
        public string Name { get; set; }
        public List<Product> Products { get; set; }
    }
}
