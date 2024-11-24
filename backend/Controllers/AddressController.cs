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
                return Ok(new { Message = "Address info added successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateAddress([FromBody] UpdateAddressDto updateAddressDto)
        {
            try
            {
                await _addressService.UpdateAddressAsync(updateAddressDto);
                return Ok(new { Message = "Address updated successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _addressService.GetAllAsync());
        }

        [HttpGet("by-user/{userId}")]
        public async Task<IActionResult> GetAddressByUserId(int userId)
        {
            try
            {
                return Ok(await _addressService.GetAddressByUserIdAsync(userId));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Error = ex.Message });
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
    }
}
