using AutoMapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualBasic;
using Microsoft.AspNetCore.Identity;
using Core.Interfaces.Service;
using Core.Interfaces.Repository;
using Core.ViewModels;
using Core.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace Application.Services
{
    public class AuthService : IAuthService

    {
        private readonly IAuthRepo _AuthRepository;
        private readonly IConfiguration _configuration;
        private readonly IUserRepo _repo;

        public AuthService(IAuthRepo AuthRepository, IConfiguration configuration,IUserRepo R)
        {
            this._repo = R;
            this._AuthRepository = AuthRepository;
            this._configuration = configuration;
        }
        public async Task<Response<IEnumerable<Claim>>> login(LoginModel model)
        {
            var user = await _AuthRepository.ValidateCredentialsAsync(model.Username, model.pass);
            Response< IEnumerable < Claim >> l = new Response<IEnumerable<Claim>>();

            if (user == null) 
            {
                l.Errors = new List<string>() { "Invalid Username OR Password"};
                l.StatusCode = 401;
                l.Data = null;
                return l;
            
            }
            var claims = GetUserClaims(user);
            l.Data = claims.Result;
            l.StatusCode = 200;
            return l;
        }

        public async Task<Response<IEnumerable<Claim>>> Register(FormViewModel user)
        {
            var e = await _AuthRepository.RegisterAsync(user);
            Response<IEnumerable<Claim>> l = new Response<IEnumerable<Claim>>();
            if (e == null)
            {
                l.Errors = new List<string>() { "This Username is Already exist" };
                l.StatusCode = 400;
                l.Data = null;
                return l;
            }
            await _repo.AddRoleToUser("User", e.Id);
            var claims = GetUserClaims(e);
            l.Data = claims.Result;
            l.StatusCode = 200;
            return l;
        }

        public async Task<List<Claim>> GetUserClaims(IdentityUser userInfo)
        {

            List<Claim> myList = new List<Claim>();
            myList.Add(new Claim(ClaimTypes.NameIdentifier, userInfo.Id.ToString()));
            myList.Add(new Claim("username", userInfo.UserName));
            myList.Add(new Claim("Email", userInfo.Email));
            myList.Add(new Claim("MobilePhone", userInfo.PhoneNumber));
            var userRoles = await _AuthRepository.GetRolesAync(userInfo);


            foreach (var userRole in userRoles)
            {
                myList.Add(new Claim(ClaimTypes.Role, userRole));
            }
            return myList;
        }
        public string GenerateAccessToken(IEnumerable<Claim> claims)
        {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var tokeOptions = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(2),
                signingCredentials: signinCredentials
            );
            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
            return tokenString;
        }
    }
}
