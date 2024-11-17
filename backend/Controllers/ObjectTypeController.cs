using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/object-types")]
    [ApiController]
    public class ObjectTypeController(IObjectTypeService objectTypeService) : ControllerBase
    {
        private readonly IObjectTypeService _objectTypeService = objectTypeService;

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllObjectTypes()
        {
            var objectTypes = await _objectTypeService.GetAllObjectTypesAsync();
            return Ok(objectTypes);
        }
    }
}
