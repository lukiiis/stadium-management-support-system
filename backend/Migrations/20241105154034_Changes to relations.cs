using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Changestorelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_reservation_timesheets_object_type_ObjectTypeObjectId",
                table: "reservation_timesheets");

            migrationBuilder.DropForeignKey(
                name: "FK_reservations_object_type_ObjectTypeObjectId",
                table: "reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_users_tournaments_tournaments_TournamentId",
                table: "users_tournaments");

            migrationBuilder.DropForeignKey(
                name: "FK_users_tournaments_users_UserId",
                table: "users_tournaments");

            migrationBuilder.DropIndex(
                name: "IX_reservations_ObjectTypeObjectId",
                table: "reservations");

            migrationBuilder.DropIndex(
                name: "IX_reservation_timesheets_ObjectTypeObjectId",
                table: "reservation_timesheets");

            migrationBuilder.DropColumn(
                name: "ObjectTypeObjectId",
                table: "reservations");

            migrationBuilder.DropColumn(
                name: "ObjectTypeObjectId",
                table: "reservation_timesheets");

            migrationBuilder.RenameColumn(
                name: "TournamentId",
                table: "users_tournaments",
                newName: "tournament_id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "users_tournaments",
                newName: "user_id");

            migrationBuilder.RenameIndex(
                name: "IX_users_tournaments_TournamentId",
                table: "users_tournaments",
                newName: "IX_users_tournaments_tournament_id");

            migrationBuilder.CreateIndex(
                name: "IX_reservations_object_id",
                table: "reservations",
                column: "object_id");

            migrationBuilder.CreateIndex(
                name: "IX_reservation_timesheets_object_id",
                table: "reservation_timesheets",
                column: "object_id");

            migrationBuilder.AddForeignKey(
                name: "FK_reservation_timesheets_object_type_object_id",
                table: "reservation_timesheets",
                column: "object_id",
                principalTable: "object_type",
                principalColumn: "object_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_reservations_object_type_object_id",
                table: "reservations",
                column: "object_id",
                principalTable: "object_type",
                principalColumn: "object_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_users_tournaments_tournaments_tournament_id",
                table: "users_tournaments",
                column: "tournament_id",
                principalTable: "tournaments",
                principalColumn: "tournament_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_users_tournaments_users_user_id",
                table: "users_tournaments",
                column: "user_id",
                principalTable: "users",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_reservation_timesheets_object_type_object_id",
                table: "reservation_timesheets");

            migrationBuilder.DropForeignKey(
                name: "FK_reservations_object_type_object_id",
                table: "reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_users_tournaments_tournaments_tournament_id",
                table: "users_tournaments");

            migrationBuilder.DropForeignKey(
                name: "FK_users_tournaments_users_user_id",
                table: "users_tournaments");

            migrationBuilder.DropIndex(
                name: "IX_reservations_object_id",
                table: "reservations");

            migrationBuilder.DropIndex(
                name: "IX_reservation_timesheets_object_id",
                table: "reservation_timesheets");

            migrationBuilder.RenameColumn(
                name: "tournament_id",
                table: "users_tournaments",
                newName: "TournamentId");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "users_tournaments",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_users_tournaments_tournament_id",
                table: "users_tournaments",
                newName: "IX_users_tournaments_TournamentId");

            migrationBuilder.AddColumn<int>(
                name: "ObjectTypeObjectId",
                table: "reservations",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ObjectTypeObjectId",
                table: "reservation_timesheets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_reservations_ObjectTypeObjectId",
                table: "reservations",
                column: "ObjectTypeObjectId");

            migrationBuilder.CreateIndex(
                name: "IX_reservation_timesheets_ObjectTypeObjectId",
                table: "reservation_timesheets",
                column: "ObjectTypeObjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_reservation_timesheets_object_type_ObjectTypeObjectId",
                table: "reservation_timesheets",
                column: "ObjectTypeObjectId",
                principalTable: "object_type",
                principalColumn: "object_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_reservations_object_type_ObjectTypeObjectId",
                table: "reservations",
                column: "ObjectTypeObjectId",
                principalTable: "object_type",
                principalColumn: "object_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_users_tournaments_tournaments_TournamentId",
                table: "users_tournaments",
                column: "TournamentId",
                principalTable: "tournaments",
                principalColumn: "tournament_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_users_tournaments_users_UserId",
                table: "users_tournaments",
                column: "UserId",
                principalTable: "users",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
