﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using backend.Data;

#nullable disable

namespace backend.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
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
                        .HasDefaultValue(new DateTime(2024, 10, 22, 0, 0, 0, 0, DateTimeKind.Local))
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

            modelBuilder.Entity("backend.Models.User", b =>
                {
                    b.HasOne("backend.Models.Address", "Address")
                        .WithOne("User")
                        .HasForeignKey("backend.Models.User", "AddressId");

                    b.Navigation("Address");
                });

            modelBuilder.Entity("backend.Models.Address", b =>
                {
                    b.Navigation("User");
                });
#pragma warning restore 612, 618
        }
    }
}
