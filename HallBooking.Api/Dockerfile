FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["HallBooking.Api/HallBooking.Api.csproj", "HallBooking.Api/"]
COPY ["HallBooking.Application/HallBooking.Application.csproj", "HallBooking.Application/"]
COPY ["HallBooking.Domain/HallBooking.Domain.csproj", "HallBooking.Domain/"]
COPY ["HallBooking.Infrastructure/HallBooking.Infrastructure.csproj", "HallBooking.Infrastructure/"]
RUN dotnet restore "HallBooking.Api/HallBooking.Api.csproj"
COPY . .
WORKDIR "/src/HallBooking.Api"
RUN dotnet build "HallBooking.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "HallBooking.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HallBooking.Api.dll"]
