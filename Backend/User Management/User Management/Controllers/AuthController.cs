using Core.Interfaces.Service;
using Core.Models;
using Core.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace User_Management.Controllers
{
    public class AuthController : Controller
    {
        private readonly IAuthService _AuthService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthController(IAuthService AuthService, IHttpContextAccessor httpContextAccessor)
        {
            this._AuthService = AuthService;
            _httpContextAccessor = httpContextAccessor;
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<Response<AuthenticatedResponse>> Login([FromBody] LoginModel login)
        {
            var user = await _AuthService.login(login);
            Response<AuthenticatedResponse> response = new Response<AuthenticatedResponse>();
            if (user.Data != null)
            {
                var accessToken = _AuthService.GenerateAccessToken(user.Data);
                response.Data = new AuthenticatedResponse()
                {
                    Token = accessToken,
                };
                var userId = user.Data.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                response.StatusCode = user.StatusCode;
            }
            else
            {
                response.Data = null;
                response.StatusCode = user.StatusCode;
                response.Errors = user.Errors;
            }
            return response;
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<Response<AuthenticatedResponse>> Register([FromBody] FormViewModel register)
        {
            var user = await _AuthService.Register(register);

            Response<AuthenticatedResponse> response = new Response<AuthenticatedResponse>();
            if (user.Data != null)
            {
                var accessToken = _AuthService.GenerateAccessToken(user.Data);
                response.Data = new AuthenticatedResponse()
                {
                    Token = accessToken,
                   
                };

                var userId = user.Data.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                response.StatusCode = user.StatusCode;

            }
            else
            {
                response.Data = null;
                response.StatusCode = user.StatusCode;
                response.Errors = user.Errors;
            }
            return response;
        }

    }
}
