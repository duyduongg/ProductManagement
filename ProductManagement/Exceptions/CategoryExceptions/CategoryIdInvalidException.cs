using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Exceptions.CategoryExceptions
{
    public class CategoryIdInvalidException : Exception
    {
        public CategoryIdInvalidException(string message) : base(message) { }
    }
}
