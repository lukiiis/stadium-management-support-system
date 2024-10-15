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
        public DbSet<Client> Clients { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Employee> Employees { get; set; }
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

                //client foreign key
                eb.HasOne(u => u.Client).WithOne(c => c.User).HasForeignKey<Client>(c => c.UserId);
                //admin foreign key
                eb.HasOne(u => u.Admin).WithOne(a => a.User).HasForeignKey<Admin>(a => a.UserId);
                //employee foreign key
                eb.HasOne(u => u.Employee).WithOne(e => e.User).HasForeignKey<Employee>(e => e.UserId);
            });

            modelBuilder.Entity<Admin>(eb =>
            {
                eb.ToTable("admins");
                eb.HasKey(a => a.AdminId);
                eb.Property(a => a.AdminId).HasColumnName("admin_id").ValueGeneratedOnAdd();
                eb.Property(a => a.Seniority).HasColumnName("seniority").HasMaxLength(100).IsRequired();
                eb.Property(a => a.Salary).HasColumnName("salary").HasColumnType("decimal(12,2)").IsRequired();
                eb.Property(c => c.UserId).HasColumnName("user_id");
            });

            modelBuilder.Entity<Employee>(eb =>
            {
                eb.ToTable("employees");
                eb.HasKey(e => e.EmployeeId);
                eb.Property(e => e.EmployeeId).HasColumnName("employee_id").ValueGeneratedOnAdd();
                eb.Property(e => e.Position).HasColumnName("position").HasMaxLength(100).IsRequired();
                eb.Property(a => a.Salary).HasColumnName("salary").HasColumnType("decimal(12,2)").IsRequired();
                eb.Property(c => c.UserId).HasColumnName("user_id");
            });

            modelBuilder.Entity<Client>(eb =>
            {
                eb.ToTable("clients");
                eb.HasKey(c => c.ClientId);
                eb.Property(c => c.ClientId).HasColumnName("client_id").ValueGeneratedOnAdd();
                eb.Property(c => c.Wallet).HasColumnName("wallet").HasColumnType("decimal(12,2)").HasDefaultValue(0);
                eb.Property(c => c.AddressId).HasColumnName("address_id");
                eb.Property(c => c.UserId).HasColumnName("user_id");
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
                eb.HasOne(a => a.Client).WithOne(c => c.Address).HasForeignKey<Client>(c => c.AddressId).IsRequired(false);
            });
        }
    }
}
