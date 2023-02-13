using Microsoft.EntityFrameworkCore;
using ProductManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ProductManagement.Data
{
    public class ShopDbContext : DbContext
    {
        public DbSet<Brand> Brands { get; private set; }
        public DbSet<Category> Categories { get; private set; }
        public DbSet<Product> Products { get; private set; }
        public ShopDbContext(DbContextOptions<ShopDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configuring Brand
            builder.Entity<Brand>().HasKey(b => b.Id);
            builder.Entity<Brand>()
                .HasMany(b => b.Products)
                .WithOne(p => p.Brand)
                .HasForeignKey(p => p.BrandId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            // Configuring Category
            builder.Entity<Category>().HasKey(c => c.Id);
            builder.Entity<Category>()
                .HasMany(c => c.Products)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull);


            // Configuring Product
            builder.Entity<Product>().HasKey(m => m.Id);
            builder.Entity<Product>().Property(p => p.Name).HasMaxLength(250).IsRequired();
            builder.Entity<Product>().Property(p => p.Price).IsRequired();
            builder.Entity<Product>().Property(p => p.Rating).HasPrecision(2, 1).HasDefaultValue(0.0);
            builder.Entity<Product>().Property(p => p.NumberRating).HasDefaultValue(0);
            builder.Entity<Product>().Property(p => p.Stock).IsRequired().HasDefaultValue(0);
            builder.Entity<Product>().Property(p => p.WarrantyMonth).IsRequired().HasDefaultValue(0);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var now = DateTime.UtcNow.ToLocalTime();
            foreach (var changedEntity in ChangeTracker.Entries())
            {
                if (changedEntity.Entity is BaseEntity entity)
                {
                    switch (changedEntity.State)
                    {
                        case EntityState.Added:
                            entity.CreatedDate = now;
                            entity.ModifiedDate = now;
                            break;
                        case EntityState.Modified:
                            Entry(entity).Property(x => x.CreatedDate).IsModified = false;
                            entity.ModifiedDate = now;
                            break;
                    }
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
