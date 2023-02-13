﻿using ProductManagement.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Services
{
    public interface IBrandService
    {
        public Task<ICollection<BrandDto>> GetBrandsAsync(); 
    }
}
