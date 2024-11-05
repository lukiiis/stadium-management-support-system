using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddsReservationsReservationTimesheetsObjectTypeTournamentUserTournamenttables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at",
                table: "users",
                type: "date",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Local),
                oldClrType: typeof(DateTime),
                oldType: "date",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 10, 22, 0, 0, 0, 0, DateTimeKind.Local));

            migrationBuilder.CreateTable(
                name: "object_type",
                columns: table => new
                {
                    object_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    description = table.Column<string>(type: "character varying(3000)", maxLength: 3000, nullable: false),
                    image_url = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_object_type", x => x.object_id);
                });

            migrationBuilder.CreateTable(
                name: "tournaments",
                columns: table => new
                {
                    tournament_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    sport = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    max_slots = table.Column<int>(type: "integer", nullable: false),
                    occupied_slots = table.Column<int>(type: "integer", nullable: true, defaultValue: 0),
                    start_date = table.Column<DateTime>(type: "timestamp", nullable: true, defaultValue: new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Local)),
                    description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tournaments", x => x.tournament_id);
                });

            migrationBuilder.CreateTable(
                name: "reservation_timesheets",
                columns: table => new
                {
                    timesheet_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    date = table.Column<DateOnly>(type: "date", nullable: false),
                    start_time = table.Column<TimeOnly>(type: "time", nullable: false),
                    end_time = table.Column<TimeOnly>(type: "time", nullable: false),
                    object_id = table.Column<int>(type: "integer", nullable: false),
                    ObjectTypeObjectId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reservation_timesheets", x => x.timesheet_id);
                    table.ForeignKey(
                        name: "FK_reservation_timesheets_object_type_ObjectTypeObjectId",
                        column: x => x.ObjectTypeObjectId,
                        principalTable: "object_type",
                        principalColumn: "object_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "reservations",
                columns: table => new
                {
                    reservation_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    reservation_start = table.Column<TimeOnly>(type: "time", nullable: false),
                    reservation_end = table.Column<TimeOnly>(type: "time", nullable: false),
                    reservation_date = table.Column<DateOnly>(type: "date", nullable: false),
                    payment_status = table.Column<string>(type: "text", nullable: false),
                    reserved_at = table.Column<DateTime>(type: "timestamp", nullable: true, defaultValue: new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Local)),
                    price = table.Column<double>(type: "numeric(12,2)", nullable: false),
                    object_id = table.Column<int>(type: "integer", nullable: false),
                    ObjectTypeObjectId = table.Column<int>(type: "integer", nullable: false),
                    user_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reservations", x => x.reservation_id);
                    table.ForeignKey(
                        name: "FK_reservations_object_type_ObjectTypeObjectId",
                        column: x => x.ObjectTypeObjectId,
                        principalTable: "object_type",
                        principalColumn: "object_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_reservations_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "users_tournaments",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    TournamentId = table.Column<int>(type: "integer", nullable: false),
                    payment_status = table.Column<string>(type: "text", nullable: false),
                    joined_at = table.Column<DateTime>(type: "timestamp", nullable: true, defaultValue: new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Local))
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users_tournaments", x => new { x.UserId, x.TournamentId });
                    table.ForeignKey(
                        name: "FK_users_tournaments_tournaments_TournamentId",
                        column: x => x.TournamentId,
                        principalTable: "tournaments",
                        principalColumn: "tournament_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_users_tournaments_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_reservation_timesheets_ObjectTypeObjectId",
                table: "reservation_timesheets",
                column: "ObjectTypeObjectId");

            migrationBuilder.CreateIndex(
                name: "IX_reservations_ObjectTypeObjectId",
                table: "reservations",
                column: "ObjectTypeObjectId");

            migrationBuilder.CreateIndex(
                name: "IX_reservations_user_id",
                table: "reservations",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_users_tournaments_TournamentId",
                table: "users_tournaments",
                column: "TournamentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "reservation_timesheets");

            migrationBuilder.DropTable(
                name: "reservations");

            migrationBuilder.DropTable(
                name: "users_tournaments");

            migrationBuilder.DropTable(
                name: "object_type");

            migrationBuilder.DropTable(
                name: "tournaments");

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at",
                table: "users",
                type: "date",
                nullable: true,
                defaultValue: new DateTime(2024, 10, 22, 0, 0, 0, 0, DateTimeKind.Local),
                oldClrType: typeof(DateTime),
                oldType: "date",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Local));
        }
    }
}
