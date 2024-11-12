using AutoMapper;
using backend.Data;
using backend.DTOs.Address;
using backend.Models;

namespace backend.Services
{
    public interface IAddressService
    {
        Task CreateAddressAsync(CreateAddressDto createAddressDto);
        Task<AddressDto> GetAddressByIdAsync(int addressId);
        Task<AddressDto> UpdateAddressAsync(UpdateAddressDto updateAddressDto);
    }

    public class AddressService(IUsersService usersService, ApplicationDbContext context, IMapper mapper) : IAddressService
    {
        private readonly ApplicationDbContext _context = context;
        private readonly IUsersService _usersService = usersService;
        private readonly IMapper _mapper = mapper;

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
        public async Task<AddressDto> UpdateAddressAsync(UpdateAddressDto updateAddressDto)
        {
            var address = await _context.Addresses.FindAsync(updateAddressDto.AddressId);
            if (address == null)
                throw new Exception("Address not found");

            address.Country = updateAddressDto.Country;
            address.City = updateAddressDto.City;
            address.Street = updateAddressDto.Street;
            address.Zipcode = updateAddressDto.Zipcode;

            await _context.SaveChangesAsync();
            return _mapper.Map<AddressDto>(address);
        }
    }
}
