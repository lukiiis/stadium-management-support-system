using AutoMapper;
using backend.Data;
using backend.DTOs.Address;
using backend.DTOs.ObjectType;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IObjectTypeService
    {
        Task<IEnumerable<ObjectTypeDto>> GetAllObjectTypesAsync();
    }
    public class ObjectTypesService(IMapper mapper, ApplicationDbContext context) : IObjectTypeService
    {
        private readonly ApplicationDbContext _context = context;
        private readonly IMapper _mapper = mapper;
        public async Task<IEnumerable<ObjectTypeDto>> GetAllObjectTypesAsync()
        {
            var objects = await _context.ObjectTypes.ToListAsync();
            return _mapper.Map<IEnumerable<ObjectTypeDto>>(objects);
        }
    }
}
