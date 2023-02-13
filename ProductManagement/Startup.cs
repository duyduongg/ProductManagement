using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using ProductManagement.Configuration;
using ProductManagement.Data;
using ProductManagement.Extensions;
using ProductManagement.Middleware;
using ProductManagement.Models;
using ProductManagement.Services;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;

namespace ProductManagement
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddRazorPages();

            services.Configure<AppSettings>(Configuration);
            var applicationSettings = Configuration.Get<AppSettings>();
            var migrationAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    builder =>
                    {
                        builder
                        .WithOrigins(applicationSettings.ProductUiUrl)
                        .AllowCredentials()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                    });
            });

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Product.API", Version = "v1" });
                var jwtSecurityScheme = new OpenApiSecurityScheme
                {
                    BearerFormat = "JWT",
                    Name = "JWT Authentication",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = JwtBearerDefaults.AuthenticationScheme,
                    Reference = new OpenApiReference
                    {
                        Id = JwtBearerDefaults.AuthenticationScheme,
                        Type = ReferenceType.SecurityScheme,
                    }
                };
                c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    { jwtSecurityScheme, Array.Empty<string>() }
                });
            });
            //services.AddMemoryCache();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.Authority = applicationSettings.IdentityServerUrl;
                options.RequireHttpsMetadata = false;
                options.Audience = "product";
            });

            services.AddSingleton<IAuthenticationService, AuthenticationService>();

            services.Configure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = SetUser()
                };
            });

            services.AddDbContext<ShopDbContext>(options =>
            {
                options.UseSqlServer(applicationSettings.ConnectionString, sqlOption => sqlOption.MigrationsAssembly(migrationAssembly));
            });

            services.AddTransient<IProductService, ProductService>();
            services.AddTransient<IBrandService, BrandService>();
            services.AddTransient<ICategoryService, CategoryService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Product.API v1"));
            }

            app.UseMiddleware<ExceptionHandlingMiddleware>();

            app.UseRouting();
            app.UseCors(x => x
                .WithOrigins(Configuration.Get<AppSettings>().ProductUiUrl)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                .WithExposedHeaders("Accept-Ranges", "Content-Encoding", "Content-Length", "Content-Range"));


            app.UseStaticFiles();

            app.UseAuthentication();
            app.UseAuthorization();

            UpdateDatabase(app).RunAwait();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        private async Task UpdateDatabase(IApplicationBuilder applicationBuilder)
        {
            using (var serviceScope = applicationBuilder.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                var appContext = serviceScope.ServiceProvider.GetRequiredService<ShopDbContext>();
                await appContext.Database.MigrateAsync();
                await appContext.SeedData();
            }
        }

        private static Func<TokenValidatedContext, Task> SetUser()
        {
            return ctx =>
            {
                var accessToken = ctx.SecurityToken as JwtSecurityToken;
                if (ctx.HttpContext.Request != null)
                {
                    var authService = ctx.HttpContext.RequestServices.GetRequiredService<IAuthenticationService>();
                    authService.SetUser(accessToken);
                }
                return Task.CompletedTask;
            };
        }
    }
}
