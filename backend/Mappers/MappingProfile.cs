using AutoMapper;
using backend.DTOs.Address;
using backend.DTOs.ObjectType;
using backend.DTOs.Reservation;
using backend.DTOs.ReservationTimesheet;
using backend.DTOs.Tournament;
using backend.DTOs.User;
using backend.DTOs.UserTournament;
using backend.Models;

namespace backend.Mappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Tournament, TournamentDto>();
            CreateMap<CreateTournamentDto, Tournament>();

            CreateMap<Reservation, ReservationDto>()
                .ForMember(dest => dest.PaymentStatus, opt => opt.MapFrom(src => src.PaymentStatus.ToString()));
            CreateMap<CreateReservationDto, Reservation>();

            CreateMap<Address, AddressDto>();
            CreateMap<CreateAddressDto, Address>();

            CreateMap<ObjectType, ObjectTypeDto>();

            CreateMap<ReservationTimesheet, ReservationTimesheetDto>();
            CreateMap<CreateReservationTimesheetDto, ReservationTimesheet>();

            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address));

            CreateMap<UserTournament, UserTournamentDto>()
                .ForMember(dest => dest.PaymentStatus, opt => opt.MapFrom(src => src.PaymentStatus.ToString()));
        }
    }
}
