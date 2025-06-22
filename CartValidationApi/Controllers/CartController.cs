using Microsoft.AspNetCore.Mvc;
using CartValidationApi.Models;

namespace CartValidationApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly Dictionary<string, int> _skuLimits = new()
        {
            { "WGT-A", 5 },
            { "WGT-B", 2 }
        };

        /// <summary>
        /// Validate cart items based on quantity limits
        /// </summary>
        [HttpPost("validate")]
        [ProducesResponseType(typeof(ValidateCartResponse), 200)]
        public IActionResult ValidateCart([FromBody] ValidateCartRequest request)
        {
            foreach (var item in request.Items)
            {
                if (_skuLimits.TryGetValue(item.Sku, out var maxQty) && item.Quantity > maxQty)
                {
                    return Ok(new ValidateCartResponse
                    {
                        IsValid = false,
                        Message = $"Exceeded max quantity for SKU: {item.Sku}"
                    });
                }
            }

            return Ok(new ValidateCartResponse 
            { 
                IsValid = true, 
                Message = "Cart is valid." 
            });
        }
    }
}