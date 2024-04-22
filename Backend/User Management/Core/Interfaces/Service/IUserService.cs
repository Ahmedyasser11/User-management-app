using Core.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces.Service
{
    public interface IUserService
    {
        Task<Response<UserViewModel>> GetUserbyid(string id);
        Task<Response<IEnumerable<UserViewModel>>> GetAllusers();
        Task<Response<UserViewModel>> AddUser(FormViewModel ViewModel);
        Task<Response<string>> AddRoleToUser(string role, string userId);
        Task<Response<UserViewModel>> UpdateUser(FormViewModel ViewModel, string id);
        Task<Response<string>> DeleteUser(string id);
    }
}
