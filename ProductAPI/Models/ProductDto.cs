namespace ProductAPI.Models
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public List<ProductDto> Products { get; set; } = new List<ProductDto>();
    }

    public class ProductDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public required string Description { get; set; }
        public int CategoryId { get; set; }
    }
} 