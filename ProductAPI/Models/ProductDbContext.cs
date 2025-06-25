using Microsoft.EntityFrameworkCore;

namespace ProductAPI.Models
{
    public class ProductDbContext : DbContext
    {
        public ProductDbContext(DbContextOptions<ProductDbContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId);

            // Seed data
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "בשר" },
                new Category { Id = 2, Name = "דגים" },
                new Category { Id = 3, Name = "חלב" },
                new Category { Id = 4, Name = "גבינות" },
                new Category { Id = 5, Name = "ירקות" },
                new Category { Id = 6, Name = "פירות" },
                new Category { Id = 7, Name = "לחם" },
                new Category { Id = 8, Name = "משקאות" },
                new Category { Id = 9, Name = "מתוקים" },
                new Category { Id = 10, Name = "תבלינים" }
            );
            modelBuilder.Entity<Product>().HasData(
                // בשר (Meat)
                new Product { Id = 1, Name = "נקניקיות", Price = 25, Description = "נקניקיות טריות באיכות גבוהה", CategoryId = 1 },
                new Product { Id = 2, Name = "שקיים", Price = 45, Description = "שקיים טריים ואיכותיים", CategoryId = 1 },
                new Product { Id = 3, Name = "חזה עוף", Price = 35, Description = "חזה עוף טרי ללא עור", CategoryId = 1 },
                new Product { Id = 4, Name = "בשר טחון", Price = 55, Description = "בשר טחון טרי 80% שומן", CategoryId = 1 },
                new Product { Id = 5, Name = "סטייק בקר", Price = 120, Description = "סטייק בקר איכותי", CategoryId = 1 },
                
                // דגים (Fish)
                new Product { Id = 6, Name = "סלמון", Price = 85, Description = "פילה סלמון טרי ואיכותי", CategoryId = 2 },
                new Product { Id = 7, Name = "דניס", Price = 65, Description = "דג דניס טרי מהים", CategoryId = 2 },
                new Product { Id = 8, Name = "אמנון", Price = 45, Description = "דג אמנון טרי", CategoryId = 2 },
                new Product { Id = 9, Name = "טונה", Price = 75, Description = "פילה טונה טרי", CategoryId = 2 },
                
                // חלב (Dairy)
                new Product { Id = 10, Name = "קוסם", Price = 15, Description = "גבינת קוסם רכה וטעימה", CategoryId = 3 },
                new Product { Id = 11, Name = "חלב 3%", Price = 8, Description = "חלב טרי 3% שומן", CategoryId = 3 },
                new Product { Id = 12, Name = "שמנת חמוצה", Price = 12, Description = "שמנת חמוצה טבעית", CategoryId = 3 },
                new Product { Id = 13, Name = "יוגורט טבעי", Price = 10, Description = "יוגורט טבעי ללא תוספים", CategoryId = 3 },
                new Product { Id = 14, Name = "חמאה", Price = 18, Description = "חמאה טרייה 82% שומן", CategoryId = 3 },
                
                // גבינות (Cheeses)
                new Product { Id = 15, Name = "חלק גבינות", Price = 35, Description = "מגוון גבינות איכותיות", CategoryId = 4 },
                new Product { Id = 16, Name = "אמלקיק", Price = 28, Description = "גבינה קשה איכותית", CategoryId = 4 },
                new Product { Id = 17, Name = "כטו", Price = 22, Description = "גבינה רכה וקרמית", CategoryId = 4 },
                new Product { Id = 18, Name = "גבינה צהובה", Price = 32, Description = "גבינה צהובה איכותית", CategoryId = 4 },
                new Product { Id = 19, Name = "גבינת מוצרלה", Price = 25, Description = "גבינת מוצרלה טרייה", CategoryId = 4 },
                new Product { Id = 20, Name = "גבינת ריקוטה", Price = 20, Description = "גבינת ריקוטה רכה", CategoryId = 4 },
                
                // ירקות (Vegetables)
                new Product { Id = 21, Name = "גזר", Price = 8, Description = "גזר טרי ומתוק", CategoryId = 5 },
                new Product { Id = 22, Name = "עגבניות", Price = 12, Description = "עגבניות טריות מהגן", CategoryId = 5 },
                new Product { Id = 23, Name = "מלפפונים", Price = 8, Description = "מלפפונים טריים", CategoryId = 5 },
                new Product { Id = 24, Name = "פלפל אדום", Price = 15, Description = "פלפל אדום מתוק", CategoryId = 5 },
                new Product { Id = 25, Name = "בצל", Price = 6, Description = "בצל טרי", CategoryId = 5 },
                new Product { Id = 26, Name = "חסה", Price = 7, Description = "חסה טרייה ופריכה", CategoryId = 5 },
                new Product { Id = 27, Name = "תרד", Price = 10, Description = "תרד טרי ובריא", CategoryId = 5 },
                new Product { Id = 28, Name = "ברוקולי", Price = 18, Description = "ברוקולי טרי", CategoryId = 5 },
                new Product { Id = 29, Name = "כרובית", Price = 12, Description = "כרובית טרייה", CategoryId = 5 },
                new Product { Id = 30, Name = "תפוח אדמה", Price = 8, Description = "תפוחי אדמה טריים", CategoryId = 5 },
                new Product { Id = 31, Name = "בטטה", Price = 14, Description = "בטטה מתוקה", CategoryId = 5 },
                new Product { Id = 32, Name = "שום", Price = 9, Description = "שום טרי", CategoryId = 5 },
                new Product { Id = 33, Name = "ג'ינג'ר", Price = 16, Description = "ג'ינג'ר טרי", CategoryId = 5 },
                new Product { Id = 34, Name = "פלפל צהוב", Price = 13, Description = "פלפל צהוב מתוק", CategoryId = 5 },
                new Product { Id = 35, Name = "פלפל ירוק", Price = 11, Description = "פלפל ירוק טרי", CategoryId = 5 },
                
                // פירות (Fruits)
                new Product { Id = 36, Name = "תפוחים", Price = 12, Description = "תפוחים טריים ומתוקים", CategoryId = 6 },
                new Product { Id = 37, Name = "בננות", Price = 8, Description = "בננות טריות", CategoryId = 6 },
                new Product { Id = 38, Name = "ענבים", Price = 18, Description = "ענבים מתוקים", CategoryId = 6 },
                new Product { Id = 39, Name = "תפוזים", Price = 10, Description = "תפוזים טריים", CategoryId = 6 },
                new Product { Id = 40, Name = "אבוקדו", Price = 15, Description = "אבוקדו בשל וטעים", CategoryId = 6 },
                new Product { Id = 41, Name = "תות שדה", Price = 25, Description = "תות שדה טרי ומתוק", CategoryId = 6 },
                
                // לחם (Bread)
                new Product { Id = 42, Name = "לחם לבן", Price = 8, Description = "לחם לבן טרי", CategoryId = 7 },
                new Product { Id = 43, Name = "לחם מלא", Price = 12, Description = "לחם מלא בריא", CategoryId = 7 },
                new Product { Id = 44, Name = "בגט", Price = 6, Description = "בגט טרי ופריך", CategoryId = 7 },
                new Product { Id = 45, Name = "לחם שיפון", Price = 14, Description = "לחם שיפון כהה", CategoryId = 7 },
                new Product { Id = 46, Name = "לחמניות", Price = 10, Description = "לחמניות טריות", CategoryId = 7 },
                
                // משקאות (Beverages)
                new Product { Id = 47, Name = "מים מינרליים", Price = 5, Description = "מים מינרליים טבעיים", CategoryId = 8 },
                new Product { Id = 48, Name = "מיץ תפוזים", Price = 12, Description = "מיץ תפוזים טבעי", CategoryId = 8 },
                new Product { Id = 49, Name = "קפה שחור", Price = 15, Description = "קפה שחור איכותי", CategoryId = 8 },
                new Product { Id = 50, Name = "תה ירוק", Price = 8, Description = "תה ירוק בריא", CategoryId = 8 },
                new Product { Id = 51, Name = "שוקו", Price = 18, Description = "שוקו חם וטעים", CategoryId = 8 },
                
                // מתוקים (Sweets)
                new Product { Id = 52, Name = "שוקולד חלב", Price = 22, Description = "שוקולד חלב איכותי", CategoryId = 9 },
                new Product { Id = 53, Name = "עוגיות", Price = 16, Description = "עוגיות טריות", CategoryId = 9 },
                new Product { Id = 54, Name = "גלידה", Price = 25, Description = "גלידה קרמית", CategoryId = 9 },
                new Product { Id = 55, Name = "סוכריות", Price = 8, Description = "סוכריות צבעוניות", CategoryId = 9 },
                new Product { Id = 56, Name = "עוגה", Price = 45, Description = "עוגה טרייה", CategoryId = 9 },
                
                // תבלינים (Spices)
                new Product { Id = 57, Name = "מלח", Price = 5, Description = "מלח ים טבעי", CategoryId = 10 },
                new Product { Id = 58, Name = "פלפל שחור", Price = 12, Description = "פלפל שחור טחון", CategoryId = 10 },
                new Product { Id = 59, Name = "כורכום", Price = 15, Description = "כורכום טחון", CategoryId = 10 },
                new Product { Id = 60, Name = "פפריקה", Price = 10, Description = "פפריקה מתוקה", CategoryId = 10 },
                new Product { Id = 61, Name = "אורגנו", Price = 8, Description = "אורגנו יבש", CategoryId = 10 }
            );
        }

        public void EnsureDatabaseCreated()
        {
            Database.EnsureCreated();
        }
    }
} 