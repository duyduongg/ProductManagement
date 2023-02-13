using ProductManagement.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Utils
{
    public static class Helper
    {
        public static bool CheckGuidValidity(Guid? id)
        {
            Guid temp;
            if(id.HasValue && id != Guid.Empty && Guid.TryParse(id.ToString(), out temp))
            {
                return true;
            }
            return false;
        }
    }
}
