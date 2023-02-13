using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Exceptions.BrandExceptions
{
    public class BrandIdInvalidException : Exception
    {
        public BrandIdInvalidException(string message) : base(message) { }
    }
}
