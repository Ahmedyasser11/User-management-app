using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity;
using Core.Interfaces.Service;
using Core.Interfaces.Repository;
using Core.ViewModels;


namespace Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepo _repo;
        private readonly IMapper _mapper;

        public UserService (IUserRepo repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<Response<UserViewModel>> GetUserbyid(string id)
        {
            var user = await _repo.GetById(id);
            UserViewModel ViewModel = _mapper.Map<UserViewModel>(user);
            Response<UserViewModel> response = new Response<UserViewModel>();
            response.StatusCode = 404;

            if (user != null)
            {
                response.StatusCode = 200;
                response.Data = ViewModel;
                return response;
            }
            else
                return response;
        }

        public async Task<Response<IEnumerable<UserViewModel>>> GetAllusers()
        {
            var users = await _repo.GetAllusers();
            IEnumerable<UserViewModel> ViewModel = _mapper.Map<IEnumerable<UserViewModel>>(users);
            Response<IEnumerable<UserViewModel>> response = new Response<IEnumerable<UserViewModel>>();
            
            response.Data = ViewModel;
            response.StatusCode = 200;
            return response;
        }


        public async Task<Response<UserViewModel>> AddUser( FormViewModel ViewModel)
        {
            IdentityUser model = _mapper.Map<IdentityUser>(ViewModel);

            model.PasswordHash = _repo.HashPassword(model, ViewModel.Password);     
            await _repo.Insert(model);

            Response<UserViewModel> response = new();
            
            var user = await _repo.GetById(model.Id);
            await _repo.AddRoleToUser("User", user.Id);
            UserViewModel ret = _mapper.Map<UserViewModel>(user);

            response.Data = ret;
            response.StatusCode = 200;
            return response;
        }

        public async Task<Response<string>> DeleteUser(string id)
        {
            IdentityUser Model = await _repo.GetById(id);
            Response<string> response = new Response<string>();
            if (Model == null)
            {
                response.Errors = new List<string>() { "User Does Not Exist" };
                response.StatusCode = 400;
                return response;
            }
            await _repo.Delete(Model);
            response.Data = "User Deleted Successfully";
            response.StatusCode = 200;
            return response;
        }

        public async Task<Response<UserViewModel>> UpdateUser(FormViewModel ViewModel, string id)
        {

            IdentityUser Model = await _repo.GetById(id);

            if (Model.UserName != ViewModel.Username)
              Model.UserName = ViewModel.Username;
            if (Model.PhoneNumber != ViewModel.PhoneNumber)
              Model.PhoneNumber = ViewModel.PhoneNumber;
            if (Model.Email != ViewModel.Email)
              Model.Email = ViewModel.Email;
            Model.PasswordHash = _repo.HashPassword(Model, ViewModel.Password);

            await _repo.Update(Model);
            return await GetUserbyid(id);

    }

        public async Task<Response<string>> AddRoleToUser(string role, string userId)
        {
            
            var user = await _repo.GetById(userId);
            Response<string> response = new Response<string>();  
            if (user == null)
            {
                response.Data = null;
                response.Errors = new List<string>
                {
                    "User Not Found"
                };
                response.StatusCode = 400;
                return response;
            }
            await _repo.AddRoleToUser(role, userId);
            response.Data = "Role Added Successfully";
            response.StatusCode = 200;
            return response;
        }
    }
}
