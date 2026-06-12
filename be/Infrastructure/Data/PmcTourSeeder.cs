using Core.Entities;
using Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public static class PmcTourSeeder
{
    private static readonly DateTime SeedDate = new(2024, 10, 1, 0, 0, 0, DateTimeKind.Utc);

    public static void SeedAll(ModelBuilder modelBuilder)
    {
        SeedRoles(modelBuilder);
        SeedUsers(modelBuilder);
        SeedUserRoles(modelBuilder);
        SeedTourTypes(modelBuilder);
        SeedTours(modelBuilder);
        SeedTourImages(modelBuilder);
        SeedItineraries(modelBuilder);
        SeedCustomers(modelBuilder);
        SeedBookings(modelBuilder);
        SeedReviews(modelBuilder);
    }

    private static void SeedRoles(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin", Description = "Quản trị viên hệ thống", CreatedAt = SeedDate },
            new Role { Id = 2, Name = "Staff", Description = "Nhân viên điều hành tour", CreatedAt = SeedDate },
            new Role { Id = 3, Name = "Customer", Description = "Khách hàng", CreatedAt = SeedDate }
        );
    }

    private static void SeedUsers(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Username = "minh.nguyen", Email = "minh.nguyen@viettour.com", PasswordHash = "$2a$11$K7Q5pY8xRzLmNvWq3sT6uO1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT", FullName = "Nguyễn Văn Minh", Phone = "+84 901 234 567", IsActive = true, CreatedAt = SeedDate },
            new User { Id = 2, Username = "lan.tran", Email = "lan.tran@viettour.com", PasswordHash = "$2a$11$K7Q5pY8xRzLmNvWq3sT6uO1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT", FullName = "Trần Thị Lan", Phone = "+84 902 345 678", IsActive = true, CreatedAt = SeedDate },
            new User { Id = 3, Username = "an.nguyen", Email = "an.nguyen@gmail.com", PasswordHash = "$2a$11$K7Q5pY8xRzLmNvWq3sT6uO1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT", FullName = "Nguyễn Văn An", Phone = "+84 903 456 789", IsActive = true, CreatedAt = SeedDate },
            new User { Id = 4, Username = "binh.tran", Email = "binh.tran@gmail.com", PasswordHash = "$2a$11$K7Q5pY8xRzLmNvWq3sT6uO1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT", FullName = "Trần Văn Bình", Phone = "+84 904 567 890", IsActive = false, CreatedAt = SeedDate },
            new User { Id = 5, Username = "minh.le", Email = "minh.le@gmail.com", PasswordHash = "$2a$11$K7Q5pY8xRzLmNvWq3sT6uO1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT", FullName = "Lê Văn Minh", Phone = "+84 905 678 901", IsActive = true, CreatedAt = SeedDate },
            new User { Id = 6, Username = "vu.pham", Email = "vu.pham@gmail.com", PasswordHash = "$2a$11$K7Q5pY8xRzLmNvWq3sT6uO1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT", FullName = "Phạm Văn Vũ", Phone = "+84 906 789 012", IsActive = true, CreatedAt = SeedDate },
            new User { Id = 7, Username = "anh.hoang", Email = "anh.hoang@gmail.com", PasswordHash = "$2a$11$K7Q5pY8xRzLmNvWq3sT6uO1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT", FullName = "Hoàng Thị Ánh", Phone = "+84 907 890 123", IsActive = true, CreatedAt = SeedDate },
            new User { Id = 8, Username = "thu.tran", Email = "thu.tran@gmail.com", PasswordHash = "$2a$11$K7Q5pY8xRzLmNvWq3sT6uO1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT", FullName = "Trần Thị Thu", Phone = "+84 908 901 234", IsActive = true, CreatedAt = SeedDate }
        );
    }

    private static void SeedUserRoles(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserRole>().HasData(
            new UserRole { UserId = 1, RoleId = 1 },
            new UserRole { UserId = 2, RoleId = 2 },
            new UserRole { UserId = 3, RoleId = 3 },
            new UserRole { UserId = 4, RoleId = 3 },
            new UserRole { UserId = 5, RoleId = 3 },
            new UserRole { UserId = 6, RoleId = 3 },
            new UserRole { UserId = 7, RoleId = 3 },
            new UserRole { UserId = 8, RoleId = 3 }
        );
    }

    private static void SeedTourTypes(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TourType>().HasData(
            new TourType { Id = 1, Name = "Trong nước", Slug = "trong-nuoc", Description = "Tour du lịch trong nước Việt Nam", Icon = "map", SortOrder = 2, CreatedAt = SeedDate },
            new TourType { Id = 2, Name = "Quốc tế", Slug = "quoc-te", Description = "Tour du lịch nước ngoài", Icon = "public", SortOrder = 2, CreatedAt = SeedDate },
            new TourType { Id = 3, Name = "Cao cấp", Slug = "cao-cap", Description = "Tour cao cấp – trải nghiệm đẳng cấp 5 sao", Icon = "star", SortOrder = 3, CreatedAt = SeedDate },
            new TourType { Id = 4, Name = "Sinh thái", Slug = "sinh-thai", Description = "Tour sinh thái – gần gũi thiên nhiên", Icon = "park", SortOrder = 4, CreatedAt = SeedDate },
            new TourType { Id = 5, Name = "Khám phá", Slug = "kham-pha", Description = "Tour phiêu lưu – trekking & trải nghiệm", Icon = "hiking", SortOrder = 5, CreatedAt = SeedDate },
            new TourType { Id = 6, Name = "Văn hóa - Lịch sử", Slug = "van-hoa-lich-su", Description = "Tour văn hóa – tìm hiểu lịch sử & di sản", Icon = "museum", SortOrder = 6, CreatedAt = SeedDate }
        );
    }

    private static void SeedTours(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Tour>().HasData(
            new Tour { Id = 1, TourTypeId = 3, Code = "VT-2024-001", Name = "Du Thuyền Cao Cấp Vịnh Hạ Long", Slug = "du-thuyen-cao-cap-vinh-ha-long", DurationDays = 5, DurationNights = 4, Location = "Quảng Ninh, Việt Nam", PriceAdult = 499m, PriceChild = 349m, PriceInfant = 0m, SalePrice = null, MaxPeople = 12, IsActive = true, IsFeatured = true, ShortDescription = "Khám phá làn nước xanh ngọc và những hòn đảo đá vôi hùng vĩ của Vịnh Hạ Long trên du thuyền 5 sao.", Description = "Hành trình khám phá Vịnh Hạ Long – Di sản Thiên nhiên Thế giới được UNESCO công nhận với hàng nghìn hòn đảo đá vôi sừng sững. Du thuyền cao cấp mang đến sự kết hợp hoàn hảo giữa phiêu lưu và thư giãn. Bạn sẽ khám phá những hang động bí ẩn, chèo kayak qua các đầm phá yên bình và thưởng thức ẩm thực đẳng cấp trên boong tàu khi ngắm hoàng hôn buông xuống.", Included = "Hướng dẫn viên tiếng Anh chuyên nghiệp, Toàn bộ bữa ăn theo lịch trình, Vé tham quan & danh lam thắng cảnh, Nghỉ đêm cabin du thuyền cao cấp", Excluded = "Chi phí cá nhân (giặt ủi, điện thoại), Tiền tip & phí phục vụ, Bảo hiểm du lịch, Vé máy bay quốc tế", Transportation = "Xe limousine + Du thuyền cao cấp", Hotel = "Cabin du thuyền 4★", CreatedBy = 1, CreatedAt = SeedDate },
            new Tour { Id = 2, TourTypeId = 1, Code = "VT-2024-002", Name = "Biển Xanh Đà Nẵng", Slug = "bien-xanh-da-nang", DurationDays = 3, DurationNights = 2, Location = "Đà Nẵng, Việt Nam", PriceAdult = 299m, PriceChild = 199m, PriceInfant = 0m, SalePrice = null, MaxPeople = 15, IsActive = true, IsFeatured = true, ShortDescription = "Tham quan Cầu Vàng nổi tiếng và thư giãn trên bãi biển Mỹ Khê trong xanh của miền Trung.", Description = "Khám phá Cầu Vàng huyền thoại và tận hưởng những bãi biển hoang sơ của miền Trung Việt Nam. Hành trình 3 ngày kết hợp tham quan di sản và nghỉ dưỡng biển. Dạo bước phố cổ Hội An về đêm, chinh phục Ngũ Hành Sơn và đắm mình trong làn gió biển Mỹ Khê.", Included = "Hướng dẫn viên chuyên nghiệp, Toàn bộ bữa ăn theo lịch trình, Vé tham quan & danh lam, Nghỉ dưỡng resort biển", Excluded = "Chi phí cá nhân, Tiền tip & phí phục vụ, Bảo hiểm du lịch, Vé máy bay quốc tế", Transportation = "Xe riêng", Hotel = "Resort biển 4★", CreatedBy = 1, CreatedAt = SeedDate },
            new Tour { Id = 3, TourTypeId = 5, Code = "VT-2024-003", Name = "Trekking Sapa - Ruộng Bậc Thang", Slug = "trekking-sapa-ruong-bac-thang", DurationDays = 4, DurationNights = 3, Location = "Lào Cai, Việt Nam", PriceAdult = 349m, PriceChild = 249m, PriceInfant = 0m, SalePrice = null, MaxPeople = 10, IsActive = true, IsFeatured = true, ShortDescription = "Hành trình xuyên qua những thửa ruộng bậc thang tuyệt đẹp và bản làng dân tộc vùng cao phía Bắc.", Description = "Cuộc hành trình qua những thửa ruộng bậc thang kỳ vĩ và bản làng dân tộc thiểu số miền Bắc Việt Nam. Trekking qua Lào Chải, Tả Van, giao lưu với đồng bào H'Mông, Dao Đỏ và chiêm ngưỡng khung cảnh hùng vĩ của đỉnh Fansipan.", Included = "HDV trekking chuyên nghiệp, Toàn bộ bữa ăn khi trekking, Nghỉ homestay, Cáp treo Fansipan", Excluded = "Chi phí cá nhân, Tiền tip, Bảo hiểm du lịch, Đồ uống có cồn", Transportation = "Xe limousine + Đi bộ", Hotel = "Khách sạn 3★ + Homestay", CreatedBy = 1, CreatedAt = SeedDate },
            new Tour { Id = 4, TourTypeId = 6, Code = "VT-2024-012", Name = "Sài Gòn Xưa & Nay", Slug = "sai-gon-xua-va-nay", DurationDays = 1, DurationNights = 0, Location = "TP. Hồ Chí Minh, Việt Nam", PriceAdult = 75m, PriceChild = 50m, PriceInfant = 0m, SalePrice = null, MaxPeople = 20, IsActive = false, IsFeatured = false, ShortDescription = "Khám phá các di tích lịch sử: Dinh Độc Lập, Nhà thờ Đức Bà, Bưu điện thành phố và Chợ Bến Thành.", Description = "Hành trình khám phá Sài Gòn – thành phố năng động nhất Việt Nam. Tham quan Dinh Độc Lập, Nhà thờ Đức Bà, Bưu điện Trung tâm, Chợ Bến Thành và thưởng thức cà phê vỉa hè đúng chất Sài Gòn.", Included = "HDV, Vé tham quan, Bữa trưa, Xe đưa đón", Excluded = "Chi phí cá nhân, Tiền tip", Transportation = "Xe máy lạnh", Hotel = "Không", CreatedBy = 1, CreatedAt = SeedDate },
            new Tour { Id = 5, TourTypeId = 4, Code = "VT-2024-015", Name = "Đà Lạt - Đồi Chè & Thông Reo", Slug = "da-lat-doi-che-thong-reo", DurationDays = 2, DurationNights = 1, Location = "Lâm Đồng, Việt Nam", PriceAdult = 210m, PriceChild = 150m, PriceInfant = 0m, SalePrice = null, MaxPeople = 15, IsActive = true, IsFeatured = false, ShortDescription = "Buổi sáng sương mờ trên Cao nguyên Trung Bộ, khám phá đồi chè và rừng thông bạt ngàn.", Description = "Khám phá Đà Lạt mộng mơ với khí hậu mát mẻ quanh năm, kiến trúc Pháp cổ kính, vườn hoa bất tận và những đồi chè xanh mướt. Tham quan Đồi Chè Cầu Đất, Nhà Thờ Domain, Hồ Xuân Hương và thưởng thức đặc sản địa phương.", Included = "HDV, Xe đưa đón, Bữa trưa, Thưởng trà", Excluded = "Chi phí cá nhân, Bữa tối", Transportation = "Xe riêng", Hotel = "Khách sạn 3★", CreatedBy = 1, CreatedAt = SeedDate },
            new Tour { Id = 6, TourTypeId = 5, Code = "VT-2024-022", Name = "Hà Giang - Cung Đường Đèo Mã Pí Lèng", Slug = "ha-giang-cung-duong-deo-ma-pi-leng", DurationDays = 4, DurationNights = 3, Location = "Hà Giang, Việt Nam", PriceAdult = 350m, PriceChild = 250m, PriceInfant = 0m, SalePrice = null, MaxPeople = 8, IsActive = true, IsFeatured = false, ShortDescription = "Chinh phục cung đường đèo huyền thoại Mã Pí Lèng qua những bản làng dân tộc thiểu số.", Description = "Trải nghiệm cảm giác phượt trên cung đường cực Bắc hùng vĩ, vượt qua đèo Mã Pí Lèng ngoạn mục, thăm bản làng người H'Mông và chiêm ngưỡng Công viên Địa chất Toàn cầu Cao nguyên đá Đồng Văn được UNESCO công nhận.", Included = "Xe máy + HDV, Homestay, Toàn bộ bữa ăn, Vé tham quan", Excluded = "Chi phí cá nhân, Đồ uống", Transportation = "Xe máy", Hotel = "Homestay", CreatedBy = 1, CreatedAt = SeedDate },
            new Tour { Id = 7, TourTypeId = 6, Code = "VT-2024-025", Name = "Phố Cổ Hội An - Di Sản Văn Hóa", Slug = "pho-co-hoi-an-di-san-van-hoa", DurationDays = 3, DurationNights = 2, Location = "Quảng Nam, Việt Nam", PriceAdult = 299m, PriceChild = 199m, PriceInfant = 0m, SalePrice = null, MaxPeople = 12, IsActive = true, IsFeatured = false, ShortDescription = "Đắm mình trong không gian đèn lồng huyền ảo của phố cổ Hội An, Di sản Văn hóa Thế giới.", Description = "Trải nghiệm vẻ đẹp huyền diệu của Hội An với workshop làm đèn lồng truyền thống, dạo thuyền trên sông Thu Bồn, ghé thăm các tiệm may đo thủ công và thưởng thức ẩm thực miền Trung đích thực. Kèm tour chụp ảnh hoàng hôn chuyên nghiệp.", Included = "HDV, Xe đưa đón, 3 bữa/ngày, Workshop thủ công", Excluded = "Chi phí cá nhân, Mua sắm", Transportation = "Xe riêng", Hotel = "Resort ven sông 4★", CreatedBy = 1, CreatedAt = SeedDate },
            new Tour { Id = 8, TourTypeId = 4, Code = "VT-2024-030", Name = "Tràng An - Chèo Đò & Hang Động", Slug = "trang-an-cheo-do-hang-dong", DurationDays = 1, DurationNights = 0, Location = "Ninh Bình, Việt Nam", PriceAdult = 120m, PriceChild = 80m, PriceInfant = 0m, SalePrice = null, MaxPeople = 25, IsActive = true, IsFeatured = false, ShortDescription = "Lướt thuyền qua những dãy núi đá vôi hùng vĩ của Tràng An và khám phá đền chùa cổ kính.", Description = "Chuyến đi trong ngày khởi hành từ Hà Nội đến 'Vịnh Hạ Long trên cạn' – Quần thể danh thắng Tràng An. Khám phá hang động đá vôi bằng thuyền tre truyền thống, thăm Cố đô Hoa Lư và leo lên Hang Múa ngắm toàn cảnh.", Included = "Xe đưa đón, HDV, Chèo đò, Bữa trưa", Excluded = "Chi phí cá nhân, Đồ uống", Transportation = "Xe máy lạnh + Thuyền tre", Hotel = "Không", CreatedBy = 1, CreatedAt = SeedDate }
        );
    }

    private static void SeedTourImages(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TourImage>().HasData(
            new TourImage { Id = 1, TourId = 1, ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuB2kMf1N3_Rz7UCmKFDXXOH1Ebqo3_y3ap0Aw2RTfL0rsdGqmnN3k2PN8OMXKhGRoc_m0Rjeyfk_eI4NvAgvU3p0qkj-UJ5gsibYJVHEZnGCh50VnQT8I1NbrwmnrDTp-6H-8h_ccm7KbaexOpYqWI_4UlYOQkIWzfyqZCRBONyEXDlxneuwGZ3ZaVQDPACTdiLinLzR2Cdq0MEgCnjqSFC6zmK7GCIVoY7ioQne96tH2rxabaxcodyyo0uGTYABuIuj4Z_ldeNnCQ", AltText = "Du Thuyền Cao Cấp Vịnh Hạ Long", SortOrder = 1, CreatedAt = SeedDate },
            new TourImage { Id = 2, TourId = 2, ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD0-xI_5NNTewujqvo97PfB2MaNvVOOXXW1hcSaDHKMs4asSx1FOq4BxJ-u1wdMYspozCf6a1rkpZaRXX-A4v-bVhBqaC85MlHS9XStk4QKCv2j2jGRH1NOTKQftpfNXaNZrdyrzWrwvbQrzvMvlM1N_F-Fw5xgH5uytrLqx6cTFLfvh_aOl0532mFPYnUDc_T0pQXmp2lwv9CLreHZrRAXgYRqRHuXVBwpAdvSJ1nTZ5xyJBoEUuODCw1v3Gg9ouykMJIs4E17B-Q", AltText = "Biển Xanh Đà Nẵng", SortOrder = 1, CreatedAt = SeedDate },
            new TourImage { Id = 3, TourId = 3, ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCZX6EEXXoSz07_jUo7zLg-TXJ5nfRVbgoO8r_jw8qOoLT_6ylUePyUDUMRX-97DPUX8SeZ7vA_KBibZfMkj_t47T81wMuFbX_gPoQ-7YT5OlxK2a4mHH_006vAbahGHvh2T_trOByovh3EenGXzZHkgC6356-6x3esfScMDP1N6BF2-4vbnWzBGi9U5nhyPeapvXspe0iwnz3nprsyt57JURn7KmDWkyZrp63gfk0ozUR0Qzyzs8mccLIpPx2WwDPChkklO5RDb4w", AltText = "Trekking Sapa - Ruộng Bậc Thang", SortOrder = 1, CreatedAt = SeedDate },
            new TourImage { Id = 4, TourId = 4, ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAUxqccO2c2MPgsylrVClFBeP1QUA2yqoOJqNV22EgAh0JKXwGtBhZZ2hOTOUXPzlL7Fkv-mOobxe9CyTp1OuqibdnWf0a8KPE2vB7XHbEGcxbnmuCZc6WRUiB4Y_EqMPchEo-eJDbJSpJ8kPFRMWIjYw92W92tKhV8Bago765gicsvSrCyrndRTTWpItYUzZ2cCfTN9hCe4263tnB3ICyQrnP7nD-Fl3Ps7q1jz8iBxXkzbfa1QhY99AmMEdLpkUr31Xy3C4zPPhk", AltText = "Sài Gòn Xưa & Nay", SortOrder = 1, CreatedAt = SeedDate },
            new TourImage { Id = 5, TourId = 5, ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDDpRnYwJuAgDXUvec1_57yBjGriY7pU19tx3L7tPrUNh4obmkJkfU9iAopCP1HXugSOUpLjQuuj6e5uuKfd052Mj6WhvBRtk4MgVEAKKUuNk8WuirswwdzS2lFDDQqgJx10rsPPjY6JdciCsu4xXkeDpILoEBvyf_skVHcjYOjVLciEX-0h9sjitjQqNWHV4t5KT6qrvfDgLafy-MHtxINJx5yqg-A9sj2ic0Ar65BODPVoxKfx4b2qCnRLS0f630pYbx2W7a9XhU", AltText = "Đà Lạt - Đồi Chè & Thông Reo", SortOrder = 1, CreatedAt = SeedDate },
            new TourImage { Id = 6, TourId = 6, ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCw31B29BQiu-WFQ75W9Fo34Fq6que1RDarubVXF7ClsszWHZWckQmq1_T-wtoROox-5EePZpboEncve7Ldvvu2OCcI9VieJIVhKWGIpwAl_L4Szc13wnwT7-ZjZdMnwUO6oqAl8KxXjHmk8qMgfyDz9Aoe1akFO36SbSezra_ndj-R-NQIA2xjd2WlVlxhdaI3WxuZ97GZbTWhk_Chr9sD60qXpn8VeiOYez5-3nMG3-ZMNT5_2w8_KIwC0OqvYIyizGV5hRhc3BQ", AltText = "Hà Giang - Cung Đường Đèo", SortOrder = 1, CreatedAt = SeedDate },
            new TourImage { Id = 7, TourId = 7, ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXu2BWHLkLgKrBVdux3vw_5YWjmtOMA8TprVIALYDQNdUg8u2tvPHDBcr8wo_SnSihIhtd7ObU6XTMDljHAak2vqeJWU7m5bbmlyb5cwXNmNmfBRXAfbifWnbWBn2MBmPVhQUFsSF2iBmlcwF_yY1hhZlpqoj8ee3S1Oe8aRklPf3Xsi5s4DVZ72FSCNXmJwa1XbobWuGR4f7Z1ud0IKt28S8f7UJOAnMk2RA4amYT0mu0ReaYLiBaTF7jHh_x0j_P0y6MXGVkVwc1c", AltText = "Phố Cổ Hội An", SortOrder = 1, CreatedAt = SeedDate },
            new TourImage { Id = 8, TourId = 8, ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCcV9rq3xqVY9BNbREoZmXT4Ooh54folb-k0IVqD8Xa80RoMcbsvaTH1tMSaYj1smq6BOw7VCALXYeT1YRuXuZCs1YJIGeHM-W2GHsjeF4Yl0GQOBy2do1LzbeCvnpUz8TlnAcUzyY9RI_3WHARL--TB50TJYbOeJ2arHE-ybqcW2az_AL5e-OK4MJtLCh76g-GFJ1JWoRGx27mIep2bjSVMXyZ79Pq-kmo3oFBv3NV3bmHsAkff3tqRSJ_oKYJbYVRv7iHpdry_AY", AltText = "Tràng An - Chèo Đò & Hang Động", SortOrder = 1, CreatedAt = SeedDate }
        );
    }

    private static void SeedItineraries(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Itinerary>().HasData(
            new Itinerary { Id = 1, TourId = 1, DayNumber = 1, Title = "Ngày 1: Đón khách & Khởi hành Du thuyền", Description = "Đón khách tại Phố Cổ Hà Nội, khởi hành đi Vịnh Hạ Long. Lên du thuyền, nhận phòng cabin và thưởng thức bữa trưa chào mừng khi du thuyền lướt vào vịnh.", Activities = "Check-in du thuyền, Bữa trưa chào mừng, Tiệc ngắm hoàng hôn", CreatedAt = SeedDate },
            new Itinerary { Id = 2, TourId = 1, DayNumber = 2, Title = "Ngày 2: Khám phá Hang Sửng Sốt & Chèo Kayak", Description = "Sáng tham quan Hang Sửng Sốt – hang động lớn nhất vịnh. Chiều chèo kayak tại Hang Luồn, tắm biển tại đảo Ti Tốp.", Activities = "Tham quan Hang Sửng Sốt, Chèo kayak, Bơi lội, Lớp nấu ăn", CreatedAt = SeedDate },
            new Itinerary { Id = 3, TourId = 1, DayNumber = 3, Title = "Ngày 3: Làng Chài Nổi & Trang Trại Ngọc Trai", Description = "Tham quan làng chài nổi tìm hiểu đời sống ngư dân truyền thống. Khám phá trang trại nuôi cấy ngọc trai địa phương.", Activities = "Tham quan làng chài, Tour ngọc trai, Bữa sáng muộn, Rời tàu", CreatedAt = SeedDate },
            new Itinerary { Id = 4, TourId = 2, DayNumber = 1, Title = "Ngày 1: Đến Đà Nẵng & Ngũ Hành Sơn", Description = "Chào mừng đến Đà Nẵng! Nhận phòng khách sạn ven biển và tham quan Ngũ Hành Sơn huyền thoại, khám phá hang động linh thiêng và chùa Phật giáo.", Activities = "Đón sân bay, Check-in khách sạn, Tham quan Ngũ Hành Sơn", CreatedAt = SeedDate },
            new Itinerary { Id = 5, TourId = 2, DayNumber = 2, Title = "Ngày 2: Bà Nà Hills & Cầu Vàng", Description = "Đi cáp treo lên Bà Nà Hills. Dạo bước trên Cầu Vàng nổi tiếng được nâng đỡ bởi đôi bàn tay khổng lồ và tham quan Làng Pháp.", Activities = "Cáp treo, Chụp ảnh Cầu Vàng, Bữa trưa Làng Pháp", CreatedAt = SeedDate },
            new Itinerary { Id = 6, TourId = 2, DayNumber = 3, Title = "Ngày 3: Phố Cổ Hội An & Tiễn khách", Description = "Khám phá đèn lồng và nhà cổ Hội An vào buổi sáng, sau đó đưa ra sân bay khởi hành.", Activities = "Dạo phố Hội An, Chụp ảnh đèn lồng, Đưa ra sân bay", CreatedAt = SeedDate },
            new Itinerary { Id = 7, TourId = 3, DayNumber = 1, Title = "Ngày 1: Hà Nội đến Sapa & Bản Cát Cát", Description = "Sáng đi xe limousine lên Sapa. Chiều trekking xuống bản Cát Cát của người H'Mông đen, xem biểu diễn văn nghệ truyền thống.", Activities = "Xe limousine, Trekking Cát Cát, Biểu diễn văn nghệ", CreatedAt = SeedDate },
            new Itinerary { Id = 8, TourId = 3, DayNumber = 2, Title = "Ngày 2: Trekking Thung Lũng Mường Hoa", Description = "Trekking cả ngày qua những thửa ruộng bậc thang tuyệt đẹp của thung lũng Mường Hoa. Ghé thăm bản Lào Chải, Tả Van và ăn trưa cùng gia đình địa phương.", Activities = "Trekking Mường Hoa, Thăm Lào Chải, Ăn trưa homestay, Tả Van", CreatedAt = SeedDate },
            new Itinerary { Id = 9, TourId = 3, DayNumber = 3, Title = "Ngày 3: Cáp Treo Đỉnh Fansipan", Description = "Đi cáp treo lên đỉnh Fansipan – Nóc nhà Đông Dương. Chiều tự do khám phá thị trấn Sapa và chợ địa phương.", Activities = "Cáp treo Fansipan, Chụp ảnh đỉnh, Chợ Sapa", CreatedAt = SeedDate }
        );
    }

    private static void SeedCustomers(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>().HasData(
            new Customer { Id = 3, FullName = "Nguyễn Văn An", Email = "an.nguyen@gmail.com", Phone = "+84 903 456 789", Nationality = "Việt Nam", IsActive = true, CreatedAt = SeedDate },
            new Customer { Id = 4, FullName = "Trần Văn Bình", Email = "binh.tran@gmail.com", Phone = "+84 904 567 890", Nationality = "Việt Nam", IsActive = false, CreatedAt = SeedDate },
            new Customer { Id = 5, FullName = "Lê Văn Minh", Email = "minh.le@gmail.com", Phone = "+84 905 678 901", Nationality = "Việt Nam", IsActive = true, CreatedAt = SeedDate },
            new Customer { Id = 6, FullName = "Phạm Văn Vũ", Email = "vu.pham@gmail.com", Phone = "+84 906 789 012", Nationality = "Việt Nam", IsActive = true, CreatedAt = SeedDate },
            new Customer { Id = 7, FullName = "Hoàng Thị Ánh", Email = "anh.hoang@gmail.com", Phone = "+84 907 890 123", Nationality = "Việt Nam", IsActive = true, CreatedAt = SeedDate },
            new Customer { Id = 8, FullName = "Trần Thị Thu", Email = "thu.tran@gmail.com", Phone = "+84 908 901 234", Nationality = "Việt Nam", IsActive = true, CreatedAt = SeedDate }
        );
    }

    private static void SeedBookings(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Booking>().HasData(
            new Booking { Id = 101, BookingCode = "REG-101", CustomerId = 3, TourId = 1, BookingDate = new DateTime(2024, 10, 12, 9, 0, 0, DateTimeKind.Utc), StartDate = new DateTime(2024, 11, 15, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2024, 11, 20, 0, 0, 0, DateTimeKind.Utc), NumAdults = 2, NumChildren = 0, TotalPrice = 599m, FinalPrice = 599m, Status = BookingStatus.Confirmed, CreatedBy = 3, CreatedAt = new DateTime(2024, 10, 12, 9, 0, 0, DateTimeKind.Utc) },
            new Booking { Id = 102, BookingCode = "REG-102", CustomerId = 4, TourId = 3, BookingDate = new DateTime(2024, 10, 14, 10, 15, 0, DateTimeKind.Utc), StartDate = new DateTime(2024, 12, 5, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2024, 12, 9, 0, 0, 0, DateTimeKind.Utc), NumAdults = 1, NumChildren = 0, TotalPrice = 345m, FinalPrice = 345m, Status = BookingStatus.Pending, CreatedBy = 4, CreatedAt = new DateTime(2024, 10, 14, 10, 15, 0, DateTimeKind.Utc) },
            new Booking { Id = 103, BookingCode = "REG-103", CustomerId = 5, TourId = 5, BookingDate = new DateTime(2024, 10, 15, 14, 30, 0, DateTimeKind.Utc), StartDate = new DateTime(2024, 8, 20, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2024, 8, 22, 0, 0, 0, DateTimeKind.Utc), NumAdults = 1, NumChildren = 0, TotalPrice = 210m, FinalPrice = 210m, Status = BookingStatus.Completed, CreatedBy = 5, CreatedAt = new DateTime(2024, 10, 15, 14, 30, 0, DateTimeKind.Utc) },
            new Booking { Id = 104, BookingCode = "REG-104", CustomerId = 6, TourId = 7, BookingDate = new DateTime(2024, 10, 16, 11, 0, 0, DateTimeKind.Utc), StartDate = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2024, 9, 4, 0, 0, 0, DateTimeKind.Utc), NumAdults = 1, NumChildren = 0, TotalPrice = 120m, FinalPrice = 120m, Status = BookingStatus.Cancelled, CreatedBy = 6, CreatedAt = new DateTime(2024, 10, 16, 11, 0, 0, DateTimeKind.Utc) },
            new Booking { Id = 105, BookingCode = "REG-105", CustomerId = 7, TourId = 4, BookingDate = new DateTime(2024, 10, 9, 8, 30, 0, DateTimeKind.Utc), StartDate = new DateTime(2024, 11, 10, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2024, 11, 10, 0, 0, 0, DateTimeKind.Utc), NumAdults = 1, NumChildren = 0, TotalPrice = 75m, FinalPrice = 75m, Status = BookingStatus.Pending, CreatedBy = 7, CreatedAt = new DateTime(2024, 10, 9, 8, 30, 0, DateTimeKind.Utc) },
            new Booking { Id = 106, BookingCode = "REG-106", CustomerId = 8, TourId = 2, BookingDate = new DateTime(2024, 10, 3, 16, 0, 0, DateTimeKind.Utc), StartDate = new DateTime(2024, 12, 20, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2024, 12, 23, 0, 0, 0, DateTimeKind.Utc), NumAdults = 2, NumChildren = 0, TotalPrice = 299m, FinalPrice = 299m, Status = BookingStatus.Confirmed, CreatedBy = 8, CreatedAt = new DateTime(2024, 10, 3, 16, 0, 0, DateTimeKind.Utc) },
            new Booking { Id = 107, BookingCode = "REG-107", CustomerId = 3, TourId = 1, BookingDate = new DateTime(2024, 10, 12, 0, 0, 0, DateTimeKind.Utc), StartDate = new DateTime(2024, 12, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2024, 12, 6, 0, 0, 0, DateTimeKind.Utc), NumAdults = 2, NumChildren = 0, TotalPrice = 998m, FinalPrice = 998m, Status = BookingStatus.Pending, Notes = "Đang chờ duyệt", CreatedBy = 3, CreatedAt = new DateTime(2024, 10, 12, 0, 0, 0, DateTimeKind.Utc) },
            new Booking { Id = 108, BookingCode = "REG-108", CustomerId = 4, TourId = 3, BookingDate = new DateTime(2024, 10, 14, 0, 0, 0, DateTimeKind.Utc), StartDate = new DateTime(2024, 12, 10, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2024, 12, 14, 0, 0, 0, DateTimeKind.Utc), NumAdults = 1, NumChildren = 0, TotalPrice = 349m, FinalPrice = 349m, Status = BookingStatus.Pending, CreatedBy = 4, CreatedAt = new DateTime(2024, 10, 14, 0, 0, 0, DateTimeKind.Utc) }
        );
    }

    private static void SeedReviews(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Review>().HasData(
            new Review { Id = 1, TourId = 1, CustomerId = 3, Rating = 5, Comment = "Một trải nghiệm tuyệt vời không thể nào quên. Nhân viên phục vụ chu đáo, đồ ăn tinh tế, và thức dậy ngắm những hòn đảo đá vôi bên ngoài cửa sổ cabin là giấc mơ thành hiện thực.", Status = ReviewStatus.Approved, IsActive = true, CreatedAt = new DateTime(2024, 9, 20, 0, 0, 0, DateTimeKind.Utc) },
            new Review { Id = 2, TourId = 2, CustomerId = 8, Rating = 5, Comment = "Cầu Vàng thật ngoạn mục! Chuyến đi 3 ngày hoàn hảo với bãi biển tuyệt đẹp và đồ ăn ngon. Hướng dẫn viên rất am hiểu và nhiệt tình.", Status = ReviewStatus.Approved, IsActive = true, CreatedAt = new DateTime(2024, 9, 15, 0, 0, 0, DateTimeKind.Utc) },
            new Review { Id = 3, TourId = 3, CustomerId = 5, Rating = 5, Comment = "Trekking qua những thửa ruộng bậc thang thật khó quên. Homestay ấm cúng, và hướng dẫn viên người H'Mông đã dạy chúng tôi rất nhiều về cuộc sống địa phương.", Status = ReviewStatus.Approved, IsActive = true, CreatedAt = new DateTime(2024, 10, 5, 0, 0, 0, DateTimeKind.Utc) },
            new Review { Id = 4, TourId = 6, CustomerId = 6, Rating = 5, Comment = "Chuyến phượt xe máy tuyệt nhất trong đời! Đèo Mã Pí Lèng đẹp đến nghẹt thở. Hướng dẫn viên đảm bảo an toàn và thoải mái xuyên suốt hành trình.", Status = ReviewStatus.Approved, IsActive = true, CreatedAt = new DateTime(2024, 8, 10, 0, 0, 0, DateTimeKind.Utc) },
            new Review { Id = 5, TourId = 7, CustomerId = 3, Rating = 5, Comment = "Hội An về đêm thật huyền diệu. Workshop làm đèn lồng rất vui, và chúng tôi đã có những bức ảnh đẹp nhất. Rất đáng để trải nghiệm!", Status = ReviewStatus.Approved, IsActive = true, CreatedAt = new DateTime(2024, 9, 28, 0, 0, 0, DateTimeKind.Utc) }
        );
    }
}
