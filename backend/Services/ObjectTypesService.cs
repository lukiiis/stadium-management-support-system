using AutoMapper;
using backend.Data;
using backend.DTOs.Address;
using backend.DTOs.ObjectType;

namespace backend.Services
{
    public interface IObjectTypeService
    {
        Task<IEnumerable<ObjectTypeDto>> GetAllObjectTypesAsync();
    }
    public class ObjectTypesService(IMapper mapper, ApplicationDbContext context) : IObjectTypeService
    {
        public Task<IEnumerable<ObjectTypeDto>> GetAllObjectTypesAsync()
        {
            throw new NotImplementedException();
        }
    }
}
