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
            CreateMap<TournamentCreateDto, Tournament>();


            CreateMap<Address, AddressDto>();
            CreateMap<ObjectType, ObjectTypeDto>();
            CreateMap<Reservation, ReservationDto>()
                .ForMember(dest => dest.PaymentStatus, opt => opt.MapFrom(src => src.PaymentStatus.ToString()));
            CreateMap<ReservationTimesheet, ReservationTimesheetDto>();     
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));
            CreateMap<UserTournament, UserTournamentDto>()
                .ForMember(dest => dest.PaymentStatus, opt => opt.MapFrom(src => src.PaymentStatus.ToString()));
        }
    }
}
