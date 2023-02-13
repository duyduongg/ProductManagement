using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Exceptions.ProductExceptions
{
    public class ProductInformationInvalidException : Exception
    {
        public ProductInformationInvalidException(string message): base(message) { }
    }
}
