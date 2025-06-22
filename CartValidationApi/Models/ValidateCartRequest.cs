
namespace CartValidationApi.Models
{
    public class ValidateCartRequest
    {
        public string CustomerId { get; set; }
        public string CartId { get; set; }
        public List<CartLineItem> Items { get; set; }
    }
}

