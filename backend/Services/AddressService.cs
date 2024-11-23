using AutoMapper;
using backend.Data;
using backend.DTOs.Address;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace backend.Services
{
    public interface IAddressService
    {
        Task<List<AddressDto>> GetAllAsync();
        Task<AddressDto> GetAddressByUserIdAsync(int userId);
        Task CreateAddressAsync(CreateAddressDto createAddressDto);
        Task<AddressDto> GetAddressByIdAsync(int addressId);
        Task UpdateAddressAsync(UpdateAddressDto updateAddressDto);
    }

    public class AddressService(IUsersService usersService, ApplicationDbContext context, IMapper mapper) : IAddressService
    {
        private readonly ApplicationDbContext _context = context;
        private readonly IUsersService _usersService = usersService;
        private readonly IMapper _mapper = mapper;

        public async Task<List<AddressDto>> GetAllAsync()
        {
            var addresses = await _context.Addresses.ToListAsync();
            return _mapper.Map<List<AddressDto>>(addresses);
        }

        //public async Task<AddressDto> GetByAddressIdAsync(int addressId)
        //{
        //    var address = await _context.Addresses.FindAsync(addressId);
        //    if (address == null)
        //        throw new KeyNotFoundException($"Address with ID {addressId} not found.");

        //    return _mapper.Map<AddressDto>(address);
        //}

        public async Task<AddressDto> GetAddressByUserIdAsync(int userId)
        {
            var user = await _context.Users.Include(u => u.Address).FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null || user.Address == null)
                throw new KeyNotFoundException($"No address found for user with ID {userId}.");

            return _mapper.Map<AddressDto>(user.Address);
        }


        // Create
        public async Task CreateAddressAsync(CreateAddressDto createAddressDto)
        {
            var user = await _usersService.GetUserById(createAddressDto.UserId);

            if (user == null)
                throw new Exception("User not found");

            var address = new Address
            {
                Country = createAddressDto.Country,
                City = createAddressDto.City,
                Street = createAddressDto.Street,
                Zipcode = createAddressDto.Zipcode,
                User = user
            };  

            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();

            user.Address = address;
            _context.Users.Update(user);

            await _context.SaveChangesAsync();
        }

        // Read by ID
        public async Task<AddressDto> GetAddressByIdAsync(int addressId)
        {
            var address = await _context.Addresses.FindAsync(addressId);
            return _mapper.Map<AddressDto>(address);
            
        }

        // Update
        public async Task UpdateAddressAsync(UpdateAddressDto updateAddressDto)
        {
            var address = await _context.Addresses.FindAsync(updateAddressDto.AddressId);
            if (address == null)
                throw new Exception("Address not found");

            address.Country = updateAddressDto.Country;
            address.City = updateAddressDto.City;
            address.Street = updateAddressDto.Street;
            address.Zipcode = updateAddressDto.Zipcode;

            await _context.SaveChangesAsync();
        }
    }
}
