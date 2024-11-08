using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddsIsTournamenttoReservationTimesheetchangesTournamenttablewithStartDateandEndDateaddsrel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "joined_at",
                table: "users_tournaments",
                type: "timestamp",
                nullable: true,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "timestamp",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Local));

            migrationBuilder.AlterColumn<bool>(
                name: "enabled",
                table: "users",
                type: "boolean",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at",
                table: "users",
                type: "date",
                nullable: true,
                defaultValueSql: "CURRENT_DATE",
                oldClrType: typeof(DateTime),
                oldType: "date",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Local));

            migrationBuilder.AlterColumn<DateOnly>(
                name: "start_date",
                table: "tournaments",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1),
                oldClrType: typeof(DateTime),
                oldType: "timestamp",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Local));

            migrationBuilder.AddColumn<DateOnly>(
                name: "end_date",
                table: "tournaments",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<int>(
                name: "object_id",
                table: "tournaments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<DateTime>(
                name: "reserved_at",
                table: "reservations",
                type: "timestamp",
                nullable: true,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "timestamp",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Local));

            migrationBuilder.AddColumn<bool>(
                name: "is_tournament",
                table: "reservation_timesheets",
                type: "boolean",
                nullable: true,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_tournaments_object_id",
                table: "tournaments",
                column: "object_id");

            migrationBuilder.AddForeignKey(
                name: "FK_tournaments_object_type_object_id",
                table: "tournaments",
                column: "object_id",
                principalTable: "object_type",
                principalColumn: "object_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tournaments_object_type_object_id",
                table: "tournaments");

            migrationBuilder.DropIndex(
                name: "IX_tournaments_object_id",
                table: "tournaments");

            migrationBuilder.DropColumn(
                name: "end_date",
                table: "tournaments");

            migrationBuilder.DropColumn(
                name: "object_id",
                table: "tournaments");

            migrationBuilder.DropColumn(
                name: "is_tournament",
                table: "reservation_timesheets");

            migrationBuilder.AlterColumn<DateTime>(
                name: "joined_at",
                table: "users_tournaments",
                type: "timestamp",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Local),
                oldClrType: typeof(DateTime),
                oldType: "timestamp",
                oldNullable: true,
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<bool>(
                name: "enabled",
                table: "users",
                type: "boolean",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at",
                table: "users",
                type: "date",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Local),
                oldClrType: typeof(DateTime),
                oldType: "date",
                oldNullable: true,
                oldDefaultValueSql: "CURRENT_DATE");

            migrationBuilder.AlterColumn<DateTime>(
                name: "start_date",
                table: "tournaments",
                type: "timestamp",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Local),
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.AlterColumn<DateTime>(
                name: "reserved_at",
                table: "reservations",
                type: "timestamp",
                nullable: true,
                defaultValue: new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Local),
                oldClrType: typeof(DateTime),
                oldType: "timestamp",
                oldNullable: true,
                oldDefaultValueSql: "CURRENT_TIMESTAMP");
        }
    }
}
