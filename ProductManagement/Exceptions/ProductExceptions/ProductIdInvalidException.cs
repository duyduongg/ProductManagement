using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Exceptions.ProductExceptions
{
    public class ProductIdInvalidException: Exception
    {
        public ProductIdInvalidException(string message) : base(message) { }
    }
}
