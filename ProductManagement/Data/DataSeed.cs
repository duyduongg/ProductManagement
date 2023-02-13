using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProductManagement.Models;
using ProductManagement.Shared.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductManagement.Data
{
    public static class DataSeed
    {
        public static List<Brand> Brands = new List<Brand>
        {
            new Brand
            {
                Name = "HyperX",
            },
            new Brand
            {
                Name = "Steelseries"
            },
            new Brand
            {
                Name = "Akko"
            },
            new Brand
            {
                Name = "Leopold"
            },
            new Brand
            {
                Name = "iKBC"
            },
            new Brand
            {
                Name = "Razer"
            },
            new Brand
            {
                Name = "Corsair"
            }
        };

        public static Dictionary<Category, List<Product>> Categories = new Dictionary<Category, List<Product>>
        {
            { 
                new Category { Name = "Mouse" },
                new List<Product>
                {
                    new Product
                    {
                        Name = "Chuột HyperX Pulsefire Haste Black Wireless",
                        Price = 1890000,
                        NumberRating = 25,
                        Rating = 4.5m,
                        WarrantyMonth = 12,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Chuột Steelseries Rival 600",
                        Price = 1390000,
                        NumberRating = 326,
                        Rating = 3.5m,
                        WarrantyMonth = 12,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Chuột gaming Corsair Harpoon Pro RGB",
                        Price = 450000,
                        NumberRating = 165,
                        Rating = 4.0m,
                        WarrantyMonth = 12,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Chuột Corsair DarkCore RGB Pro SE Wireless",
                        Price = 2490000,
                        NumberRating = 424,
                        Rating = 3.5m,
                        WarrantyMonth = 12,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Chuột Corsair M55 RGB Pro White",
                        Price = 790000,
                        NumberRating = 137,
                        Rating = 1.5m,
                        WarrantyMonth = 12,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Chuột Akko AG325",
                        Price = 490000,
                        NumberRating = 3215,
                        Rating = 3.0m,
                        WarrantyMonth = 12,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Chuột Akko AG325 One Piece - Chopper",
                        Price = 650000,
                        NumberRating = 13,
                        Rating = 4.5m,
                        WarrantyMonth = 12,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Chuột Razer Deathadder Essential",
                        Price = 490000,
                        NumberRating = 1563,
                        Rating = 3.5m,
                        WarrantyMonth = 12,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Chuột Razer Viper Mini",
                        Price = 690000,
                        NumberRating = 1676,
                        Rating = 1.0m,
                        WarrantyMonth = 12,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Chuột Razer Basilisk X HyperSpeed",
                        Price = 1090000,
                        NumberRating = 64,
                        Rating = 1.5m,
                        WarrantyMonth = 12,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Chuột Razer Viper Mercury",
                        Price = 1740000,
                        NumberRating = 436,
                        Rating = 4.0m,
                        WarrantyMonth = 12,
                        Stock = 30
                    }
                }
            },
            {
                new Category {Name = "Keyboard"},
                new List<Product>
                {
                    new Product
                    {
                        Name = "Bàn phím cơ Akko 3108SP Pink Akko Switch V2",
                        Price = 790000,
                        NumberRating = 987,
                        Rating = 4.5m,
                        WarrantyMonth = 24,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Bàn phím Leopold FC900R Bluetooth White Blue Star",
                        Price = 3200000,
                        NumberRating = 423,
                        Rating = 4.5m,
                        WarrantyMonth = 24,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Bàn phím iKBC CD87 Vintage",
                        Price = 1700000,
                        NumberRating = 432,
                        Rating = 4.5m,
                        WarrantyMonth = 24,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Bàn phím iKBC CD87 PD",
                        Price = 1590000,
                        NumberRating = 25312,
                        Rating = 4.5m,
                        WarrantyMonth = 24,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Bàn phím cơ iKBC W210 Wireless - Black Edition",
                        Price = 2090000,
                        NumberRating = 567,
                        Rating = 4.5m,
                        WarrantyMonth = 24,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Bàn phím cơ iKBC W210 Wireless",
                        Price = 1850000,
                        NumberRating = 5368,
                        Rating = 4.5m,
                        WarrantyMonth = 24,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Bàn phím Razer Blackwidow V3 Tenkeyless",
                        Price = 1990000,
                        NumberRating = 312,
                        Rating = 4.5m,
                        WarrantyMonth = 24,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Bàn phím Razer DeathStalker V2 Pro TKL",
                        Price = 4690000,
                        NumberRating = 234,
                        Rating = 4.5m,
                        WarrantyMonth = 24,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Bàn phím Razer Huntsman V2",
                        Price = 4390000,
                        NumberRating = 533,
                        Rating = 4.5m,
                        WarrantyMonth = 24,
                        Stock = 30
                    },
                    new Product
                    {
                        Name = "Bàn phím Steelseries Apex 3",
                        Price = 1640000,
                        NumberRating = 869,
                        Rating = 4.5m,
                        WarrantyMonth = 24,
                        Stock = 30
                    }
                }
            }
        };



        public static async Task SeedData(this ShopDbContext context)
        {
            if (!await context.Brands.AnyAsync())
            {
                await context.AddRangeAsync(Brands);
            }
            await context.SaveChangesAsync();

            await SeedProduct(context);
        }

        public static async Task SeedProduct(ShopDbContext context)
        {
            var brands = await context.Brands.ToListAsync();
            if (!await context.Categories.AnyAsync())
            {
                foreach (KeyValuePair<Category, List<Product>> entry in Categories)
                {
                    await context.AddAsync(entry.Key);
                    foreach(Product product in entry.Value)
                    {
                        var brand = brands.FirstOrDefault(b => product.Name.Contains(b.Name));
                        product.Brand = brand;
                        product.Category = entry.Key;
                    }
                    await context.AddRangeAsync(entry.Value);
                }
            }
            await context.SaveChangesAsync();
        }
    }
}
