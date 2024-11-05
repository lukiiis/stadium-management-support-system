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
        public DbSet<ObjectType> ObjectTypes { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<ReservationTimesheet> ReservationTimesheets { get; set; }
        public DbSet<Tournament> Tournaments { get; set; }
        public DbSet<UserTournament> UsersTournaments { get; set; }

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
                eb.Property(u => u.CreatedAt).HasColumnName("created_at").HasColumnType("date").HasDefaultValue(DateTime.Today);
                eb.Property(u => u.Wallet).HasColumnName("wallet").HasColumnType("decimal(12,2)");
                eb.Property(u => u.Salary).HasColumnName("salary").HasColumnType("decimal(12,2)");
                eb.Property(u => u.Position).HasColumnName("position").HasMaxLength(100);
                eb.Property(u => u.AddressId).HasColumnName("address_id");
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

                //user foreign key
                eb.HasOne(a => a.User)
                    .WithOne(u => u.Address)
                    .HasForeignKey<User>(u => u.AddressId).IsRequired(false);
            });

            modelBuilder.Entity<UserTournament>(eb =>
            {
                eb.ToTable("users_tournaments");

                eb.HasKey(ut => new { ut.UserId, ut.TournamentId });

                eb.HasOne(ut => ut.User)
                      .WithMany(u => u.UserTournaments)
                      .HasForeignKey(ut => ut.UserId);

                eb.HasOne(ut => ut.Tournament)
                      .WithMany(t => t.UserTournaments)
                      .HasForeignKey(ut => ut.TournamentId);

                eb.Property(ut => ut.UserId).HasColumnName("user_id").ValueGeneratedOnAdd();
                eb.Property(ut => ut.TournamentId).HasColumnName("tournament_id").ValueGeneratedOnAdd();
                eb.Property(ut => ut.PaymentStatus).HasConversion<string>().HasColumnName("payment_status").IsRequired();
                eb.Property(ut => ut.JoinedAt).HasColumnType("timestamp").HasColumnName("joined_at").HasDefaultValue(DateTime.Today);
            });

            modelBuilder.Entity<Tournament>(eb =>
            {
                eb.ToTable("tournaments");

                eb.HasKey(ut => ut.TournamentId);
                eb.Property(a => a.TournamentId).HasColumnName("tournament_id").ValueGeneratedOnAdd();
                eb.Property(a => a.Sport).HasColumnName("sport").HasMaxLength(250).IsRequired();
                eb.Property(a => a.MaxSlots).HasColumnName("max_slots").IsRequired();
                eb.Property(a => a.OccupiedSlots).HasColumnName("occupied_slots").HasDefaultValue(0);
                eb.Property(ut => ut.StartDate).HasColumnType("timestamp").HasColumnName("start_date").HasDefaultValue(DateTime.Today);
                eb.Property(a => a.Description).HasColumnName("description").HasMaxLength(2000).IsRequired();
            });

            modelBuilder.Entity<Reservation>(eb =>
            {
                eb.ToTable("reservations");

                eb.HasKey(ut => ut.ReservationId);
                eb.Property(a => a.ReservationId).HasColumnName("reservation_id").ValueGeneratedOnAdd();
                eb.Property(u => u.ReservationStart).HasColumnName("reservation_start").HasColumnType("time").IsRequired();
                eb.Property(u => u.ReservationEnd).HasColumnName("reservation_end").HasColumnType("time").IsRequired();
                eb.Property(u => u.ReservationDate).HasColumnName("reservation_date").HasColumnType("date").IsRequired();
                eb.Property(ut => ut.PaymentStatus).HasConversion<string>().HasColumnName("payment_status").IsRequired();
                eb.Property(u => u.ReservedAt).HasColumnName("reserved_at").HasColumnType("timestamp").HasDefaultValue(DateTime.Today);
                eb.Property(ut => ut.Price).HasColumnName("price").HasColumnType("decimal(12,2)").IsRequired();

                eb.HasOne(r => r.ObjectType)
                    .WithMany(ot => ot.Reservations)
                    .HasForeignKey(r => r.ObjectId);

                eb.Property(u => u.ObjectId).HasColumnName("object_id").IsRequired();
                eb.Property(u => u.UserId).HasColumnName("user_id").IsRequired();
            });

            modelBuilder.Entity<ObjectType>(eb =>
            {
                eb.ToTable("object_type");

                eb.HasKey(ut => ut.ObjectId);
                eb.Property(a => a.ObjectId).HasColumnName("object_id").ValueGeneratedOnAdd();
                eb.Property(a => a.Type).HasColumnName("type").HasMaxLength(50).IsRequired();
                eb.Property(a => a.Description).HasColumnName("description").HasMaxLength(3000).IsRequired();
                eb.Property(a => a.ImageUrl).HasColumnName("image_url").HasMaxLength(1000);
            });

            modelBuilder.Entity<ReservationTimesheet>(eb =>
            {
                eb.ToTable("reservation_timesheets");

                eb.HasKey(ut => ut.TimesheetId);
                eb.Property(a => a.TimesheetId).HasColumnName("timesheet_id").ValueGeneratedOnAdd();
                eb.Property(u => u.Date).HasColumnName("date").HasColumnType("date").IsRequired();
                eb.Property(u => u.StartTime).HasColumnName("start_time").HasColumnType("time").IsRequired();
                eb.Property(u => u.EndTime).HasColumnName("end_time").HasColumnType("time").IsRequired();

                eb.HasOne(rt => rt.ObjectType)
                    .WithMany(ot => ot.ReservationTimesheets)
                    .HasForeignKey(rt => rt.ObjectId);

                eb.Property(u => u.ObjectId).HasColumnName("object_id").IsRequired();
            });
        }
        public DbSet<backend.Models.Tournament> Tournament { get; set; } = default!;
    }
}
