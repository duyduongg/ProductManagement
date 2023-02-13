using IdentityServer.Configuration;
using IdentityServer.Data;
using IdentityServer.Models;
using IdentityServer.Services;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using ProductManagement.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace IdentityServer
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
            services.AddControllersWithViews();
            services.AddRazorPages();

            services.Configure<AppSettings>(Configuration);
            var applicationSettings = Configuration.Get<AppSettings>();
            var migrationAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;

            services.AddDbContext<UserDbContext>(options =>
            options.UseSqlServer(applicationSettings.ConnectionString, sqlOptions => sqlOptions.MigrationsAssembly(migrationAssembly)));

            services.AddIdentity<User, IdentityRole>()
                .AddEntityFrameworkStores<UserDbContext>()
                .AddDefaultTokenProviders();

            services.AddCors(options => options.AddPolicy("Cors Policy", builder =>
            {
                builder
                .WithOrigins(applicationSettings.ProductUiUrl)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
            }));


            services.AddIdentityServer(x =>
            {
                x.IssuerUri = "null";
                x.Authentication.CookieLifetime = TimeSpan.FromHours(2);
            })
                .AddDeveloperSigningCredential()
                .AddConfigurationStore(options =>
                options.ConfigureDbContext = builder => builder.UseSqlServer(applicationSettings.ConnectionString,
                    sqlOptions => sqlOptions.MigrationsAssembly(migrationAssembly)))
                .AddOperationalStore(options =>
                options.ConfigureDbContext = builder => builder.UseSqlServer(applicationSettings.ConnectionString,
                    sqlOptions => sqlOptions.MigrationsAssembly(migrationAssembly)))
                .AddAspNetIdentity<User>()
                .AddProfileService<ProfileService>();

            services.AddTransient<ILoginService<User>, LoginService>();

            services.AddTransient<IUserService, UserService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }


            app.UseStaticFiles();

            app.UseHttpsRedirection();
            app.UseCookiePolicy(new CookiePolicyOptions { MinimumSameSitePolicy = Microsoft.AspNetCore.Http.SameSiteMode.Lax });

            app.UseRouting();

            app.UseCors(x => x
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .WithExposedHeaders("Accept-Range", "Content-Encoding", "Content-Length", "Content-Range", "Content-Type"));

            app.UseAuthorization();
            app.UseAuthentication();
            app.UseIdentityServer();

            UpdateDatabase(app).RunAwait();
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });

            //app.UseSwagger();
            //app.UseSwaggerUI(c =>
            //{
            //    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Demo.API");
            //});
        }
        private async Task UpdateDatabase(IApplicationBuilder builder)
        {
            using (var serviceScope = builder.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                var appContext = serviceScope.ServiceProvider.GetRequiredService<UserDbContext>();
                await appContext.Database.MigrateAsync();

                await appContext.SeedData();

                var configContext = serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();
                await configContext.Database.MigrateAsync();

                var applicationSettings = Configuration.Get<AppSettings>();
                await configContext.SeedConfiguration(applicationSettings);

                var persistentGrantContext = serviceScope.ServiceProvider.GetRequiredService<PersistedGrantDbContext>();
                await persistentGrantContext.Database.MigrateAsync();
            }
        }
    }
}
