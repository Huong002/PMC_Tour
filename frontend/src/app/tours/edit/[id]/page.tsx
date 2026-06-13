'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthGuard } from '../../../../components/layout/AuthGuard';
import { Sidebar } from '../../../../components/layout/Sidebar';
import { tourService } from '../../../../services/tour.service';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export default function EditTourPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const tourId = Number(params.id);

  const [formData, setFormData] = useState({
    name: '',
    tourTypeId: 1,
    location: '',
    priceAdult: 0,
    priceChild: 0,
    durationDays: 1,
    durationNights: 0,
    maxPeople: 10,
    isActive: true,
    isFeatured: false,
    imageUrl: '',
    description: '',
  });

  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch tour hiện tại
  const { data: tourResponse, isLoading, isError } = useQuery({
    queryKey: ['tourEdit', tourId],
    queryFn: () => tourService.getById(tourId),
    enabled: !!tourId,
  });

  // Đổ dữ liệu vào form khi fetch xong
  useEffect(() => {
    const tour = (tourResponse as any)?.data;
    if (!tour) return;

    setFormData({
      name: tour.name || '',
      tourTypeId: tour.tourTypeId || 1,
      location: tour.location || '',
      priceAdult: tour.priceAdult || 0,
      priceChild: tour.priceChild || 0,
      durationDays: tour.durationDays || 1,
      durationNights: tour.durationNights || 0,
      maxPeople: tour.maxPeople || 10,
      isActive: tour.isActive ?? true,
      isFeatured: tour.isFeatured ?? false,
      imageUrl: tour.images?.[0]?.imageUrl || '',
      description: tour.description || '',
    });

    // Đổ lịch trình nếu có
    if (tour.itineraries?.length > 0) {
      setItinerary(
        tour.itineraries.map((it: any) => ({
          day: it.dayNumber,
          title: it.title || `Ngày ${it.dayNumber}`,
          description: it.description || '',
        }))
      );
    } else {
      setItinerary([{ day: 1, title: 'Ngày 1 - Khởi hành', description: 'Mô tả hoạt động ngày đầu tiên.' }]);
    }
  }, [tourResponse]);

  // Mutation cập nhật
  const updateMutation = useMutation({
    mutationFn: (body: any) => tourService.update(tourId, body),
    onSuccess: () => {
      setSaveSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['adminTours'] });
      queryClient.invalidateQueries({ queryKey: ['tourEdit', tourId] });
      setTimeout(() => router.push('/tours/manage'), 1500);
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tour!');
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : ['priceAdult', 'priceChild', 'durationDays', 'durationNights', 'maxPeople', 'tourTypeId'].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file ảnh quá lớn (tối đa 5MB)');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleItineraryChange = (index: number, field: 'title' | 'description', value: string) => {
    setItinerary((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addItineraryDay = () => {
    const newDay = itinerary.length + 1;
    setItinerary((prev) => [
      ...prev,
      { day: newDay, title: `Ngày ${newDay} - Hoạt động`, description: 'Mô tả chi tiết các hoạt động.' },
    ]);
    setFormData((prev) => ({ ...prev, durationDays: newDay, durationNights: newDay - 1 }));
  };

  const removeItineraryDay = (index: number) => {
    if (itinerary.length <= 1) return;
    const newItinerary = itinerary
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, day: i + 1 }));
    setItinerary(newItinerary);
    setFormData((prev) => ({
      ...prev,
      durationDays: newItinerary.length,
      durationNights: newItinerary.length - 1,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      tourTypeId: formData.tourTypeId,
      location: formData.location,
      priceAdult: formData.priceAdult,
      priceChild: formData.priceChild,
      durationDays: formData.durationDays,
      durationNights: formData.durationNights,
      maxPeople: formData.maxPeople,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      description: formData.description,
      imageUrl: formData.imageUrl || undefined,
    };
    updateMutation.mutate(body);
  };

  // ---------- RENDER ----------
  if (isLoading) {
    return (
      <AuthGuard allowedRoles={['STAFF', 'ADMIN']}>
        <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
          <Sidebar />
          <main className="flex-grow ml-64 p-margin-desktop flex items-center justify-center">
            <div className="flex flex-col items-center gap-md text-on-surface-variant">
              <span className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
              <span className="font-label-md">Đang tải thông tin tour...</span>
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  if (isError || !tourResponse) {
    return (
      <AuthGuard allowedRoles={['STAFF', 'ADMIN']}>
        <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
          <Sidebar />
          <main className="flex-grow ml-64 p-margin-desktop flex items-center justify-center">
            <div className="text-center space-y-md">
              <span className="material-symbols-outlined text-error text-[64px]">error</span>
              <p className="font-title-lg text-error">Không tìm thấy tour</p>
              <Link href="/tours/manage" className="bg-primary text-white px-lg py-2.5 rounded-xl font-bold inline-flex items-center gap-xs">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Quay lại danh sách
              </Link>
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={['STAFF', 'ADMIN']}>
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
        <Sidebar />

        <main className="flex-grow ml-64 p-margin-desktop bg-surface min-h-screen">
          {/* Header */}
          <header className="mb-xl flex justify-between items-center">
            <div className="text-left">
              <div className="flex items-center gap-sm mb-xs">
                <Link
                  href="/tours/manage"
                  className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors font-label-md"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Quản lý tour
                </Link>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface font-semibold font-label-md">Chỉnh sửa</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-primary">
                Chỉnh Sửa Tour
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                Cập nhật thông tin cho tour{' '}
                <span className="font-bold text-on-surface">#{tourId}</span>
              </p>
            </div>

            {/* Save button top */}
            <button
              form="edit-tour-form"
              type="submit"
              disabled={updateMutation.isPending || saveSuccess}
              className={`px-xl py-2.5 rounded-xl font-bold active:scale-95 transition-all text-white flex items-center gap-xs shadow-md ${
                saveSuccess
                  ? 'bg-tertiary'
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {updateMutation.isPending ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Đang lưu...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Đã lưu!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </header>

          {/* Form */}
          <form id="edit-tour-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter pb-xl text-left">

            {/* ===== CỘT TRÁI - Thông tin chung ===== */}
            <div className="lg:col-span-7 space-y-gutter">

              {/* Card: Thông tin cơ bản */}
              <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 space-y-md">
                <h3 className="font-title-lg text-title-lg text-primary border-b border-outline-variant/30 pb-sm font-bold flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[20px]">info</span>
                  Thông tin cơ bản
                </h3>

                {/* Tên tour */}
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-outline">Tên Tour <span className="text-error">*</span></label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md font-bold"
                    placeholder="Ví dụ: Du thuyền Hạng sang Vịnh Hạ Long"
                    required
                    type="text"
                  />
                </div>

                {/* Loại tour + Địa điểm */}
                <div className="grid grid-cols-2 gap-md">
                  <div className="space-y-xs">
                    <label className="font-label-md text-label-md text-outline">Loại Tour</label>
                    <select
                      name="tourTypeId"
                      value={formData.tourTypeId}
                      onChange={handleInputChange}
                      className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                    >
                      <option value={1}>Trong nước</option>
                      <option value={2}>Quốc tế</option>
                      <option value={3}>Cao cấp</option>
                      <option value={4}>Sinh thái</option>
                      <option value={5}>Khám phá</option>
                      <option value={6}>Văn hóa - Lịch sử</option>
                    </select>
                  </div>
                  <div className="space-y-xs">
                    <label className="font-label-md text-label-md text-outline">Địa Điểm <span className="text-error">*</span></label>
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                      placeholder="Hà Nội, Đà Nẵng..."
                      required
                      type="text"
                    />
                  </div>
                </div>

                {/* Giá */}
                <div className="grid grid-cols-2 gap-md">
                  <div className="space-y-xs">
                    <label className="font-label-md text-label-md text-outline">Giá Người Lớn (đ) <span className="text-error">*</span></label>
                    <input
                      name="priceAdult"
                      value={formData.priceAdult}
                      onChange={handleInputChange}
                      className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                      min={0}
                      required
                      type="number"
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="font-label-md text-label-md text-outline">Giá Trẻ Em (đ)</label>
                    <input
                      name="priceChild"
                      value={formData.priceChild}
                      onChange={handleInputChange}
                      className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                      min={0}
                      type="number"
                    />
                  </div>
                </div>

                {/* Số ngày / đêm / khách */}
                <div className="grid grid-cols-3 gap-md">
                  <div className="space-y-xs">
                    <label className="font-label-md text-label-md text-outline">Số Ngày</label>
                    <input
                      name="durationDays"
                      value={formData.durationDays}
                      onChange={handleInputChange}
                      className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                      min={1}
                      required
                      type="number"
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="font-label-md text-label-md text-outline">Số Đêm</label>
                    <input
                      name="durationNights"
                      value={formData.durationNights}
                      onChange={handleInputChange}
                      className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                      min={0}
                      type="number"
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="font-label-md text-label-md text-outline">Tối Đa Khách</label>
                    <input
                      name="maxPeople"
                      value={formData.maxPeople}
                      onChange={handleInputChange}
                      className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                      min={1}
                      required
                      type="number"
                    />
                  </div>
                </div>

                {/* Checkboxes trạng thái */}
                <div className="flex items-center gap-xl pt-xs">
                  <label className="flex items-center gap-xs cursor-pointer select-none group">
                    <input
                      id="isActiveCheckbox"
                      name="isActive"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary bg-surface border-outline-variant rounded focus:ring-primary"
                    />
                    <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">
                      Cho phép hiển thị & đăng ký
                    </span>
                  </label>
                  <label className="flex items-center gap-xs cursor-pointer select-none group">
                    <input
                      id="isFeaturedCheckbox"
                      name="isFeatured"
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary bg-surface border-outline-variant rounded focus:ring-primary"
                    />
                    <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">
                      Tour nổi bật (Featured)
                    </span>
                  </label>
                </div>

                {/* Mô tả */}
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-outline">Mô tả Tour</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-md py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                    placeholder="Mô tả những điểm hấp dẫn của tour..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Card: Lịch trình */}
              <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30">
                <div className="flex justify-between items-center border-b border-outline-variant/30 pb-sm mb-md">
                  <h3 className="font-title-lg text-title-lg text-primary font-bold flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[20px]">route</span>
                    Lịch trình chi tiết
                  </h3>
                  <button
                    type="button"
                    onClick={addItineraryDay}
                    className="bg-primary/10 hover:bg-primary/25 text-primary px-3 py-1.5 rounded-lg text-label-sm font-bold transition-all flex items-center gap-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Thêm ngày
                  </button>
                </div>

                <div className="space-y-md max-h-[500px] overflow-y-auto pr-xs">
                  {itinerary.map((day, index) => (
                    <div
                      key={day.day}
                      className="p-md bg-surface rounded-xl border border-outline-variant/30 space-y-sm relative"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary font-label-md flex items-center gap-xs">
                          <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {day.day}
                          </span>
                          Ngày {day.day}
                        </span>
                        {itinerary.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItineraryDay(index)}
                            className="text-error hover:bg-error/10 p-1 rounded-full transition-all"
                            title="Xóa ngày"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        )}
                      </div>

                      <div className="space-y-xs">
                        <label className="font-label-sm text-label-sm text-outline">Tiêu đề ngày</label>
                        <input
                          value={day.title}
                          onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                          className="w-full px-md py-2 rounded-lg border border-outline-variant bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md"
                          placeholder="Ví dụ: Đón khách & Nhận phòng"
                          type="text"
                        />
                      </div>

                      <div className="space-y-xs">
                        <label className="font-label-sm text-label-sm text-outline">Hoạt động trong ngày</label>
                        <textarea
                          value={day.description}
                          onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                          className="w-full px-md py-2 rounded-lg border border-outline-variant bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md"
                          placeholder="Chi tiết các hoạt động..."
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== CỘT PHẢI - Hình ảnh & Preview ===== */}
            <div className="lg:col-span-5 space-y-gutter">

              {/* Card: Hình ảnh */}
              <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 space-y-md">
                <h3 className="font-title-lg text-title-lg text-primary border-b border-outline-variant/30 pb-sm font-bold flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[20px]">image</span>
                  Hình ảnh Tour
                </h3>

                {/* Drag drop zone */}
                <div
                  onClick={() => document.getElementById('tour-edit-image-input')?.click()}
                  className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-surface-container-low/50 relative overflow-hidden group ${
                    formData.imageUrl ? 'min-h-[280px] border-primary/30' : 'min-h-[220px] border-outline-variant/60 hover:border-primary/60'
                  }`}
                >
                  {formData.imageUrl ? (
                    <>
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-white text-[36px]">upload_file</span>
                        <span className="text-white text-sm font-bold">Nhấp để đổi ảnh</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-2 p-lg">
                      <span className="material-symbols-outlined text-outline text-[48px] group-hover:text-primary group-hover:scale-110 transition-all">
                        add_photo_alternate
                      </span>
                      <p className="font-label-md text-sm text-on-surface font-semibold">
                        Nhấp để chọn ảnh từ máy tính
                      </p>
                      <p className="text-xs text-outline font-medium">
                        Hỗ trợ PNG, JPG, JPEG, WEBP (Tối đa 5MB)
                      </p>
                    </div>
                  )}
                </div>

                <input
                  id="tour-edit-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="space-y-xs">
                  <label className="font-label-sm text-label-sm text-outline uppercase tracking-wide">
                    Hoặc nhập URL ảnh trực tiếp
                  </label>
                  <input
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://... hoặc để trống"
                    className="w-full px-md py-2.5 rounded-xl border border-outline-variant bg-surface focus:border-primary outline-none text-xs font-medium"
                    type="text"
                  />
                </div>
              </div>

              {/* Card: Preview nhanh */}
              <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 space-y-sm">
                <h3 className="font-title-md text-title-md text-on-surface-variant border-b border-outline-variant/30 pb-sm font-bold flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[18px]">preview</span>
                  Xem trước nhanh
                </h3>
                <div className="rounded-xl overflow-hidden border border-outline-variant/20">
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="preview"
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-sm space-y-xs bg-surface">
                    <p className="font-bold text-on-surface text-sm line-clamp-2">
                      {formData.name || 'Tên tour...'}
                    </p>
                    <div className="flex items-center gap-xs text-on-surface-variant text-xs">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      <span>{formData.location || 'Địa điểm...'}</span>
                    </div>
                    <div className="flex items-center gap-xs text-on-surface-variant text-xs">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>{formData.durationDays} Ngày {formData.durationNights} Đêm</span>
                    </div>
                    <div className="flex items-center justify-between pt-xs border-t border-outline-variant/20">
                      <span className="font-bold text-primary text-sm">
                        {formData.priceAdult.toLocaleString('vi-VN')}đ
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        formData.isActive
                          ? 'bg-tertiary/10 text-tertiary'
                          : 'bg-error/10 text-error'
                      }`}>
                        {formData.isActive ? 'Đang hoạt động' : 'Tạm ngưng'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card: Hành động */}
              <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 space-y-sm">
                <button
                  form="edit-tour-form"
                  type="submit"
                  disabled={updateMutation.isPending || saveSuccess}
                  className={`w-full py-3 rounded-xl font-bold active:scale-95 transition-all text-white flex items-center justify-center gap-xs shadow-md ${
                    saveSuccess ? 'bg-tertiary' : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {updateMutation.isPending ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Đang lưu...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      Đã lưu thành công!
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Lưu thay đổi
                    </>
                  )}
                </button>
                <Link
                  href="/tours/manage"
                  className="w-full py-3 rounded-xl font-bold border border-outline text-on-surface-variant hover:bg-surface transition-all flex items-center justify-center gap-xs text-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                  Hủy & quay lại
                </Link>
              </div>
            </div>
          </form>
        </main>
      </div>
    </AuthGuard>
  );
}
