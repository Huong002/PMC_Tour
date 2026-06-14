'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthGuard } from '../../components/layout/AuthGuard';
import { Sidebar } from '../../components/layout/Sidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { contactService, ContactMessageDto } from '../../services/contact.service';

export default function ContactsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // State for reply modal
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const handleSendReply = (email?: string) => {
    if (!replyBody.trim()) {
      alert('Vui lòng nhập nội dung phản hồi!');
      return;
    }
    setIsSendingReply(true);
    // Giả lập gửi email thành công
    setTimeout(() => {
      setIsSendingReply(false);
      setIsReplyOpen(false);
      setReplyBody('');
      alert(`Đã gửi email phản hồi thành công tới ${email}!`);
    }, 1500);
  };

  // Query Contacts list
  const { data: contactsResponse, isLoading: isListLoading } = useQuery({
    queryKey: ['contacts', searchTerm, filterStatus, page],
    queryFn: async () => {
      const res = await contactService.getAll({
        SearchTerm: searchTerm || undefined,
        Page: page,
        PageSize: pageSize,
      });
      return res.data;
    },
  });

  // Query selected contact details
  const { data: detailResponse, isLoading: isDetailLoading, refetch: refetchDetail } = useQuery({
    queryKey: ['contactDetail', selectedId],
    queryFn: async () => {
      if (!selectedId) return null;
      const res = await contactService.getById(selectedId);
      return res.data;
    },
    enabled: selectedId !== null,
  });

  // Trigger list refresh when a detail is fetched (to update IsRead indicator instantly)
  useEffect(() => {
    if (detailResponse) {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    }
  }, [detailResponse, queryClient]);

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => contactService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setSelectedId(null);
      alert('Đã xóa thư liên hệ thành công!');
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Có lỗi xảy ra khi xóa thư liên hệ.');
    }
  });

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa thư liên hệ của "${name}" không?`)) {
      deleteMutation.mutate(id);
    }
  };

  const rawItems = contactsResponse?.items || [];
  const totalCount = contactsResponse?.totalCount || 0;
  const totalPages = contactsResponse?.totalPages || 1;

  // Filter client-side additionally if needed, but the API handles the search.
  // We can filter status client-side or we can just filter rawItems for clean UX.
  const displayedItems = rawItems.filter(item => {
    if (filterStatus === 'unread') return !item.isRead;
    if (filterStatus === 'read') return item.isRead;
    return true;
  });

  return (
    <AuthGuard allowedRoles={['STAFF', 'ADMIN']}>
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Canvas Area */}
        <main className="flex-1 ml-64 p-margin-desktop bg-surface min-h-screen flex flex-col">
          {/* Header */}
          <AdminHeader
            title="Quản Lý Liên Hệ"
            description="Theo dõi và phản hồi các yêu cầu liên hệ, góp ý của khách hàng gửi về hệ thống."
            searchTerm={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val);
              setPage(1);
            }}
            searchPlaceholder="Tìm theo tên, email..."
          />

          {/* Main Content Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg flex-grow items-start">
            {/* Left Column: Messages List (7/12 cols) */}
            <div className="lg:col-span-7 flex flex-col h-full space-y-md">
              {/* Quick Filters */}
              <div className="bg-white p-sm rounded-2xl border border-outline-variant/30 shadow-soft flex items-center gap-xs">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filterStatus === 'all'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-variant/20'
                  }`}
                >
                  Tất cả ({totalCount})
                </button>
                <button
                  onClick={() => setFilterStatus('unread')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    filterStatus === 'unread'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-variant/20'
                  }`}
                >
                  Chưa đọc
                  {rawItems.some(i => !i.isRead) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => setFilterStatus('read')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filterStatus === 'read'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-variant/20'
                  }`}
                >
                  Đã đọc
                </button>
              </div>

              {/* List Container */}
              <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-soft overflow-hidden flex flex-col flex-grow min-h-[500px]">
                {isListLoading ? (
                  <div className="flex-grow flex flex-col justify-center items-center py-xl text-on-surface-variant gap-sm">
                    <span className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                    <span className="text-xs font-medium">Đang tải danh sách liên hệ...</span>
                  </div>
                ) : displayedItems.length > 0 ? (
                  <div className="divide-y divide-outline-variant/20 overflow-y-auto max-h-[600px] text-left">
                    {displayedItems.map((item) => {
                      const dateStr = new Date(item.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      const initial = item.name.charAt(0).toUpperCase();
                      const isSelected = selectedId === item.id;

                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedId(item.id)}
                          className={`p-md flex gap-md items-start cursor-pointer transition-all duration-200 border-l-4 ${
                            isSelected
                              ? 'bg-primary/5 border-l-primary'
                              : 'bg-white hover:bg-surface-container-low border-l-transparent'
                          }`}
                        >
                          {/* Avatar Circle */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                            item.isRead ? 'bg-slate-100 text-slate-500' : 'bg-primary-container text-white'
                          }`}>
                            {initial}
                          </div>

                          {/* Message Snippet */}
                          <div className="flex-grow overflow-hidden space-y-0.5">
                            <div className="flex justify-between items-baseline gap-sm">
                              <span className={`text-sm truncate ${item.isRead ? 'text-on-surface-variant font-medium' : 'text-on-surface font-extrabold'}`}>
                                {item.name}
                              </span>
                              <span className="text-[10px] text-outline shrink-0 font-medium">{dateStr}</span>
                            </div>
                            <p className={`text-xs truncate ${item.isRead ? 'text-outline font-medium' : 'text-primary font-bold'}`}>
                              {item.subject}
                            </p>
                            <p className="text-xs text-on-surface-variant/80 truncate line-clamp-1">
                              {item.message}
                            </p>
                          </div>

                          {/* Read/Unread Dot indicator */}
                          {!item.isRead && (
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white shrink-0 mt-2 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col justify-center items-center py-2xl text-on-surface-variant gap-sm">
                    <span className="material-symbols-outlined text-outline text-[48px]">mail_outline</span>
                    <p className="text-sm font-semibold">Không tìm thấy thư liên hệ nào</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-outline-variant/30 flex items-center justify-between mt-auto bg-surface-container-lowest">
                    <span className="text-xs text-on-surface-variant font-medium">
                      Tổng số: <strong>{totalCount}</strong> liên hệ
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-variant/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                      </button>
                      <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">
                        {page} / {totalPages}
                      </span>
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-variant/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Detailed View (5/12 cols) */}
            <div className="lg:col-span-5 text-left h-full">
              {selectedId ? (
                <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-soft p-xl space-y-xl min-h-[500px] flex flex-col justify-between">
                  {isDetailLoading ? (
                    <div className="flex-grow flex flex-col justify-center items-center gap-sm">
                      <span className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                      <span className="text-xs text-on-surface-variant">Đang mở nội dung thư...</span>
                    </div>
                  ) : detailResponse ? (
                    <div className="space-y-lg flex-grow flex flex-col justify-between">
                      {/* Sender Card Header */}
                      <div className="space-y-md">
                        <div className="flex items-center justify-between border-b border-outline-variant/25 pb-md">
                          <div className="flex items-center gap-md">
                            <div className="w-12 h-12 rounded-full bg-primary-container text-white flex items-center justify-center font-black text-lg">
                              {detailResponse.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-on-surface text-base">{detailResponse.name}</h4>
                              <div className="flex flex-col gap-0.5 mt-0.5">
                                <a
                                  href={`mailto:${detailResponse.email}`}
                                  className="text-xs text-primary font-bold hover:underline block"
                                >
                                  {detailResponse.email}
                                </a>
                                {detailResponse.phone && (
                                  <span className="text-xs text-outline font-medium block">
                                    SĐT: {detailResponse.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            detailResponse.isRead
                              ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                          }`}>
                            {detailResponse.isRead ? 'Đã đọc' : 'Chưa đọc'}
                          </span>
                        </div>

                        {/* Title and Date */}
                        <div className="space-y-xs">
                          <span className="text-[10px] text-outline uppercase font-extrabold tracking-wider block">Tiêu đề liên hệ</span>
                          <h3 className="font-title-lg text-title-lg text-primary font-extrabold leading-snug">
                            {detailResponse.subject}
                          </h3>
                          <span className="text-xs text-outline font-medium block">
                            Gửi ngày: {new Date(detailResponse.createdAt).toLocaleString('vi-VN', {
                              weekday: 'long',
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        {/* Message content */}
                        <div className="space-y-xs pt-xs">
                          <span className="text-[10px] text-outline uppercase font-extrabold tracking-wider block">Nội dung yêu cầu</span>
                          <div className="bg-surface-container-low p-md rounded-2xl border border-outline-variant/25 text-sm text-on-surface-variant font-medium leading-relaxed whitespace-pre-wrap min-h-[160px]">
                            {detailResponse.message}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-sm pt-md border-t border-outline-variant/25 mt-lg">
                        <button
                          onClick={() => {
                            setReplyBody(`Xin chào ${detailResponse.name},\n\nCảm ơn bạn đã gửi tin nhắn liên hệ tới VietTour về chủ đề "${detailResponse.subject}".\n\n[Nhập nội dung phản hồi của bạn tại đây]\n\nTrân trọng,\nĐội ngũ hỗ trợ VietTour`);
                            setIsReplyOpen(true);
                          }}
                          className="flex-1 bg-primary hover:bg-primary-container text-white font-bold py-3.5 rounded-2xl transition-bounce active:scale-95 text-xs flex justify-center items-center gap-1.5 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">reply</span>
                          Gửi phản hồi nhanh
                        </button>
                        <button
                          onClick={() => handleDelete(detailResponse.id, detailResponse.name)}
                          disabled={deleteMutation.isPending}
                          className="px-5 py-3.5 border border-rose-300 hover:bg-rose-600 hover:text-white text-rose-600 font-bold rounded-2xl transition-all active:scale-95 text-xs flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          Xóa thư
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-soft p-xl min-h-[500px] flex flex-col justify-center items-center text-center gap-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[64px] text-outline/60 animate-bounce">chat_bubble_outline</span>
                  <h4 className="font-extrabold text-title-lg text-primary">Nội dung thư liên hệ</h4>
                  <p className="text-xs text-on-surface-variant/80 max-w-[280px] font-medium leading-relaxed">
                    Chọn một tin nhắn từ danh sách bên trái để xem đầy đủ nội dung chi tiết và phản hồi khách hàng.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Reply Modal */}
          {isReplyOpen && detailResponse && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-md bg-black/40 backdrop-blur-sm transition-opacity">
              <div className="bg-white rounded-3xl p-xl max-w-[500px] w-full border border-outline-variant/30 shadow-natural space-y-md animate-fade-in text-left">
                <div className="flex items-center justify-between border-b border-outline-variant/25 pb-sm">
                  <h3 className="font-title-lg text-title-lg text-primary font-extrabold flex items-center gap-sm">
                    <span className="material-symbols-outlined">mail</span>
                    Soạn Thư Phản Hồi
                  </h3>
                  <button 
                    onClick={() => setIsReplyOpen(false)} 
                    className="p-1 rounded-full hover:bg-surface-variant/20 transition-all text-outline"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="space-y-sm text-xs">
                  <div>
                    <label className="font-bold text-outline uppercase tracking-wider block mb-1">Người nhận</label>
                    <div className="px-md py-3 bg-slate-50 border border-outline-variant/30 rounded-xl font-medium text-on-surface-variant">
                      <strong>{detailResponse.name}</strong> &lt;{detailResponse.email}&gt;
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-outline uppercase tracking-wider block mb-1">Tiêu đề email</label>
                    <div className="px-md py-3 bg-slate-50 border border-outline-variant/30 rounded-xl font-medium text-on-surface-variant">
                      Phản hồi liên hệ: {detailResponse.subject}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-outline uppercase tracking-wider block mb-1">Nội dung phản hồi</label>
                    <textarea
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      rows={8}
                      className="w-full px-md py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
                      placeholder="Nhập nội dung thư phản hồi..."
                    />
                  </div>
                </div>

                <div className="flex gap-sm border-t border-outline-variant/25 pt-md">
                  <button
                    onClick={() => setIsReplyOpen(false)}
                    disabled={isSendingReply}
                    className="flex-1 py-3 border border-outline hover:bg-surface-variant/20 font-bold rounded-2xl transition-all text-xs"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={() => handleSendReply(detailResponse.email)}
                    disabled={isSendingReply}
                    className="flex-1 bg-primary hover:bg-primary-container text-white font-bold py-3 rounded-2xl transition-bounce active:scale-95 text-xs flex justify-center items-center gap-1.5 shadow-sm"
                  >
                    {isSendingReply ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">send</span>
                        Gửi phản hồi
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
