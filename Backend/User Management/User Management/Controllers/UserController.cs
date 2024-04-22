using Core.Interfaces.Service;
using Core.ViewModels;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace User_Management.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller

    {
        private readonly IUserService _UserService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserController(IUserService Service, IHttpContextAccessor httpContextAccessor)
        {
            _UserService = Service;
            _httpContextAccessor = httpContextAccessor;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("GetUser")]
        public async Task<Response<UserViewModel>> GetUserbyid()
        {
            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            Response<UserViewModel> h = new Response<UserViewModel>();

            if (string.IsNullOrEmpty(userId))
            {
                h.StatusCode = 401;
                h.Errors = new List<string>();
                h.Errors.Add("User ID not found in token.");
                h.Data = null;
            }
            return await _UserService.GetUserbyid(userId);
        }

        //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("GetAllUsers")]
        public async Task<Response<IEnumerable<UserViewModel>>> AllUsers()
        {
            return await _UserService.GetAllusers();
        }

        //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost("AddUser")]
        public async Task<Response<UserViewModel>> AddUser([FromBody] FormViewModel ViewModel)
        {

            Response<UserViewModel> h = new Response<UserViewModel>();
            h = await _UserService.AddUser(ViewModel);
            return h;
        }

        //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut]
        public async Task<Response<UserViewModel>> UpdateUser(string id ,[FromBody] FormViewModel ViewModel )
        {
            Response<UserViewModel> h = new Response<UserViewModel>();

            if (string.IsNullOrEmpty(id))
            {
                h.StatusCode = 400;
                h.Errors = new List<string>()
                {
                    "Invalid User Id."
                };
                h.Data = null;
            }
            return await _UserService.UpdateUser(ViewModel, id);
        }
        
        //[Authorize(Roles = "Admin", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpDelete]
        public async Task<Response<string>> DeleteUser(string id)
        {
            Response<string> h = new Response<string>();
            return await _UserService.DeleteUser(id);
        }

        //[Authorize(Roles = "Admin", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost("AddRoleToUser")]
        public async Task<Response<string>> AddRoleToUser(string userId, string roleName)
        {
            return await _UserService.AddRoleToUser( roleName, userId);
        }
    }
}
