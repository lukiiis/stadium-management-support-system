﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using backend.Data;

#nullable disable

namespace backend.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241105154034_Changes to relations")]
    partial class Changestorelations
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("backend.Models.Address", b =>
                {
                    b.Property<int>("AddressId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("address_id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("AddressId"));

                    b.Property<string>("City")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("character varying(250)")
                        .HasColumnName("city");

                    b.Property<string>("Country")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("country");

                    b.Property<string>("Street")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("character varying(250)")
                        .HasColumnName("street");

                    b.Property<string>("Zipcode")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)")
                        .HasColumnName("zipcode");

                    b.HasKey("AddressId");

                    b.ToTable("addresses", (string)null);
                });

            modelBuilder.Entity("backend.Models.ObjectType", b =>
                {
                    b.Property<int>("ObjectId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("object_id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ObjectId"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(3000)
                        .HasColumnType("character varying(3000)")
                        .HasColumnName("description");

                    b.Property<string>("ImageUrl")
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)")
                        .HasColumnName("image_url");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)")
                        .HasColumnName("type");

                    b.HasKey("ObjectId");

                    b.ToTable("object_type", (string)null);
                });

            modelBuilder.Entity("backend.Models.Reservation", b =>
                {
                    b.Property<int>("ReservationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("reservation_id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ReservationId"));

                    b.Property<int>("ObjectId")
                        .HasColumnType("integer")
                        .HasColumnName("object_id");

                    b.Property<string>("PaymentStatus")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("payment_status");

                    b.Property<double>("Price")
                        .HasColumnType("decimal(12,2)")
                        .HasColumnName("price");

                    b.Property<DateOnly>("ReservationDate")
                        .HasColumnType("date")
                        .HasColumnName("reservation_date");

                    b.Property<TimeOnly>("ReservationEnd")
                        .HasColumnType("time")
                        .HasColumnName("reservation_end");

                    b.Property<TimeOnly>("ReservationStart")
                        .HasColumnType("time")
                        .HasColumnName("reservation_start");

                    b.Property<DateTime?>("ReservedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp")
                        .HasDefaultValue(new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Local))
                        .HasColumnName("reserved_at");

                    b.Property<int>("UserId")
                        .HasColumnType("integer")
                        .HasColumnName("user_id");

                    b.HasKey("ReservationId");

                    b.HasIndex("ObjectId");

                    b.HasIndex("UserId");

                    b.ToTable("reservations", (string)null);
                });

            modelBuilder.Entity("backend.Models.ReservationTimesheet", b =>
                {
                    b.Property<int>("TimesheetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("timesheet_id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("TimesheetId"));

                    b.Property<DateOnly>("Date")
                        .HasColumnType("date")
                        .HasColumnName("date");

                    b.Property<TimeOnly>("EndTime")
                        .HasColumnType("time")
                        .HasColumnName("end_time");

                    b.Property<int>("ObjectId")
                        .HasColumnType("integer")
                        .HasColumnName("object_id");

                    b.Property<TimeOnly>("StartTime")
                        .HasColumnType("time")
                        .HasColumnName("start_time");

                    b.HasKey("TimesheetId");

                    b.HasIndex("ObjectId");

                    b.ToTable("reservation_timesheets", (string)null);
                });

            modelBuilder.Entity("backend.Models.Tournament", b =>
                {
                    b.Property<int>("TournamentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("tournament_id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("TournamentId"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(2000)
                        .HasColumnType("character varying(2000)")
                        .HasColumnName("description");

                    b.Property<int>("MaxSlots")
                        .HasColumnType("integer")
                        .HasColumnName("max_slots");

                    b.Property<int?>("OccupiedSlots")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasDefaultValue(0)
                        .HasColumnName("occupied_slots");

                    b.Property<string>("Sport")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("character varying(250)")
                        .HasColumnName("sport");

                    b.Property<DateTime?>("StartDate")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp")
                        .HasDefaultValue(new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Local))
                        .HasColumnName("start_date");

                    b.HasKey("TournamentId");

                    b.ToTable("tournaments", (string)null);
                });

            modelBuilder.Entity("backend.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("user_id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("UserId"));

                    b.Property<int?>("AddressId")
                        .HasColumnType("integer")
                        .HasColumnName("address_id");

                    b.Property<int>("Age")
                        .HasMaxLength(3)
                        .HasColumnType("integer")
                        .HasColumnName("age");

                    b.Property<DateTime?>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("date")
                        .HasDefaultValue(new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Local))
                        .HasColumnName("created_at");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)")
                        .HasColumnName("email");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)")
                        .HasColumnName("first_name");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)")
                        .HasColumnName("last_name");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("character varying(250)")
                        .HasColumnName("password");

                    b.Property<int>("Phone")
                        .HasMaxLength(9)
                        .HasColumnType("integer")
                        .HasColumnName("phone");

                    b.Property<string>("Position")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("position");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("role");

                    b.Property<double?>("Salary")
                        .HasColumnType("decimal(12,2)")
                        .HasColumnName("salary");

                    b.Property<double?>("Wallet")
                        .HasColumnType("decimal(12,2)")
                        .HasColumnName("wallet");

                    b.HasKey("UserId");

                    b.HasIndex("AddressId")
                        .IsUnique();

                    b.ToTable("users", (string)null);
                });

            modelBuilder.Entity("backend.Models.UserTournament", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("user_id");

                    b.Property<int>("TournamentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("tournament_id");

                    b.Property<DateTime?>("JoinedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp")
                        .HasDefaultValue(new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Local))
                        .HasColumnName("joined_at");

                    b.Property<string>("PaymentStatus")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("payment_status");

                    b.HasKey("UserId", "TournamentId");

                    b.HasIndex("TournamentId");

                    b.ToTable("users_tournaments", (string)null);
                });

            modelBuilder.Entity("backend.Models.Reservation", b =>
                {
                    b.HasOne("backend.Models.ObjectType", "ObjectType")
                        .WithMany("Reservations")
                        .HasForeignKey("ObjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Models.User", "User")
                        .WithMany("Reservations")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ObjectType");

                    b.Navigation("User");
                });

            modelBuilder.Entity("backend.Models.ReservationTimesheet", b =>
                {
                    b.HasOne("backend.Models.ObjectType", "ObjectType")
                        .WithMany("ReservationTimesheets")
                        .HasForeignKey("ObjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ObjectType");
                });

            modelBuilder.Entity("backend.Models.User", b =>
                {
                    b.HasOne("backend.Models.Address", "Address")
                        .WithOne("User")
                        .HasForeignKey("backend.Models.User", "AddressId");

                    b.Navigation("Address");
                });

            modelBuilder.Entity("backend.Models.UserTournament", b =>
                {
                    b.HasOne("backend.Models.Tournament", "Tournament")
                        .WithMany("UserTournaments")
                        .HasForeignKey("TournamentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Models.User", "User")
                        .WithMany("UserTournaments")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Tournament");

                    b.Navigation("User");
                });

            modelBuilder.Entity("backend.Models.Address", b =>
                {
                    b.Navigation("User");
                });

            modelBuilder.Entity("backend.Models.ObjectType", b =>
                {
                    b.Navigation("ReservationTimesheets");

                    b.Navigation("Reservations");
                });

            modelBuilder.Entity("backend.Models.Tournament", b =>
                {
                    b.Navigation("UserTournaments");
                });

            modelBuilder.Entity("backend.Models.User", b =>
                {
                    b.Navigation("Reservations");

                    b.Navigation("UserTournaments");
                });
#pragma warning restore 612, 618
        }
    }
}
