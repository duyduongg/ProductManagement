using IdentityServer.Configuration;
using IdentityServer.Models;
using IdentityServer.Services;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;

namespace IdentityServer.Controllers
{
    public class AccountController : Controller
    {
        private readonly AppSettings _appSetting;
        private readonly ILoginService<User> _loginService;
        private readonly IIdentityServerInteractionService _interaction;

        public AccountController(ILoginService<User> loginService, IOptions<AppSettings> appSetting, IIdentityServerInteractionService interaction)
        {
            _appSetting = appSetting.Value;
            _loginService = loginService;
            _interaction = interaction;
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(AccountViewModel model)
        {
            if(ModelState.IsValid)
            {
                var user = await _loginService.FindByUserName(model.UserName);
                if(user != null)
                {
                    bool isValid = _loginService.ValidateCredentials(user, model.Password);
                    if (!isValid)
                    {
                        ModelState.AddModelError("", "Wrong password");

                    }
                    else
                    {
                        return await Login(model.ReturnUrl, user);
                    }
                }
                else
                {
                    ModelState.AddModelError("", "Username not found");
                }

            }

            ViewData["ReturnUrl"] = model.ReturnUrl;

            return View(new AccountViewModel
            {
                ReturnUrl = model.ReturnUrl
            });
        }

        [HttpGet]
        public async Task<IActionResult> Logout(string logoutId)
        {
            if(User?.Identity.IsAuthenticated == true)
            {
                await _loginService.LogoutAsync();
            }

            var logout = await _interaction.GetLogoutContextAsync(logoutId);
            return Redirect(logout.PostLogoutRedirectUri);
        }

        [HttpGet]
        public IActionResult Login(string returnUrl)
        {
            return View(new AccountViewModel() { ReturnUrl = returnUrl });
        }

        private AuthenticationProperties SetAuthProps(string returnUrl, int tokenLifetime = 120)
        {
            return new AuthenticationProperties
            {
                ExpiresUtc = DateTime.UtcNow.AddMinutes(tokenLifetime),
                AllowRefresh = true,
                RedirectUri = returnUrl
            };
        }

        private async Task<IActionResult> Login(string returnUrl, User user)
        {
            var tokenLifetime = _appSetting.TokenLifeTimeMinute;
            var props = SetAuthProps(returnUrl, tokenLifetime);
            await _loginService.LoginAsync(user, props);
            return Redirect(returnUrl);
        }
    }
}
