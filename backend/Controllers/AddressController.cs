using backend.DTOs.Address;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/addresses")]
    [ApiController]
    public class AddressController(IAddressService addressService) : ControllerBase
    {
        private readonly IAddressService _addressService = addressService;

        [HttpPost("create")]
        public async Task<IActionResult> CreateAddress([FromBody] CreateAddressDto createAddressDto)
        {
            try
            {
                await _addressService.CreateAddressAsync(createAddressDto);
                return Ok("Address info added successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{addressId}")]
        public async Task<IActionResult> GetAddressById(int addressId)
        {
            var address = await _addressService.GetAddressByIdAsync(addressId);
            if (address == null)
            {
                return NotFound("Address not found");
            }
            return Ok(address);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateAddress([FromBody] UpdateAddressDto updateAddressDto)
        {
            try
            {
                var updatedAddress = await _addressService.UpdateAddressAsync(updateAddressDto);
                return Ok(updatedAddress);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
