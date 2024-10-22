using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Address> Addresses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(eb =>
            {
                eb.ToTable("users");

                eb.HasKey(u => u.UserId);
                eb.Property(u => u.UserId).HasColumnName("user_id").ValueGeneratedOnAdd();

                eb.Property(u => u.FirstName).HasColumnName("first_name").HasMaxLength(200).IsRequired();
                eb.Property(u => u.LastName).HasColumnName("last_name").HasMaxLength(200).IsRequired();
                eb.Property(u => u.Age).HasColumnName("age").HasMaxLength(3).IsRequired();
                eb.Property(u => u.Phone).HasColumnName("phone").HasMaxLength(9).IsRequired();
                eb.Property(u => u.Email).HasColumnName("email").HasMaxLength(200).IsRequired();
                eb.Property(u => u.Password).HasColumnName("password").HasMaxLength(250).IsRequired();
                eb.Property(u => u.Role).HasConversion<string>().HasColumnName("role").IsRequired();
                eb.Property(u => u.CreatedAt).HasColumnName("created_at").HasColumnType("date");
            });

            modelBuilder.Entity<Address>(eb =>
            {
                eb.ToTable("addresses");
                eb.HasKey(a => a.AddressId);
                eb.Property(a => a.AddressId).HasColumnName("address_id").ValueGeneratedOnAdd();
                eb.Property(a => a.Country).HasColumnName("country").HasMaxLength(100).IsRequired();
                eb.Property(a => a.City).HasColumnName("city").HasMaxLength(250).IsRequired();
                eb.Property(a => a.Street).HasColumnName("street").HasMaxLength(250).IsRequired();
                eb.Property(a => a.Zipcode).HasColumnName("zipcode").HasMaxLength(50).IsRequired();
                
                //client foreign key
                eb.HasOne(a => a.User).WithOne(u => u.Address).HasForeignKey<User>(u => u.AddressId).IsRequired(false);
            });
        }
    }
}
