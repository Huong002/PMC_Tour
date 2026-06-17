'use client';

import React, { useEffect, useRef } from 'react';

export interface ConfirmDeleteConfig {
  /** Tiêu đề của đối tượng bị xóa, hiển thị trong modal */
  itemName: string;
  /** Loại đối tượng: 'tour' | 'user' | 'contact' | 'booking' | custom string */
  itemType?: string;
  /** Icon Material Symbol tùy chọn (mặc định: delete_forever) */
  icon?: string;
  /** Màu nhấn của nút xác nhận (mặc định: error/đỏ) */
  variant?: 'danger' | 'warning';
  /** Mô tả thêm hiển thị trong modal */
  description?: string;
}

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  config: ConfirmDeleteConfig | null;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_CONFIG = {
  danger: {
    iconBg: 'bg-error/10',
    iconColor: 'text-error',
    ringColor: 'ring-error/20',
    confirmBtn: 'bg-error hover:bg-error/90 focus:ring-error/30',
    badge: 'bg-error/10 text-error border-error/20',
    progressBar: 'bg-error',
    label: 'Xóa vĩnh viễn',
  },
  warning: {
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-600',
    ringColor: 'ring-amber-400/20',
    confirmBtn: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-300/40',
    badge: 'bg-amber-500/10 text-amber-700 border-amber-400/20',
    progressBar: 'bg-amber-500',
    label: 'Xác nhận',
  },
};

export function ConfirmDeleteModal({
  isOpen,
  config,
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const variant = config?.variant ?? 'danger';
  const v = VARIANT_CONFIG[variant];

  // Focus cancel button khi mở modal để tránh vô tình xóa
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => cancelBtnRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Đóng modal khi nhấn Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  if (!isOpen || !config) return null;

  const icon = config.icon || 'delete_forever';
  const typeLabel = config.itemType || 'mục';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        className={`
          relative bg-white rounded-3xl shadow-2xl w-full max-w-[420px]
          border border-outline-variant/20
          ring-4 ${v.ringColor}
          animate-[scale-in_0.2s_cubic-bezier(0.34,1.56,0.64,1)_forwards]
        `}
        style={{
          animation: 'modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}
      >
        {/* Top accent bar */}
        <div className={`h-1.5 rounded-t-3xl ${v.progressBar} opacity-80`} />

        <div className="p-8 space-y-5">
          {/* Icon circle */}
          <div className="flex justify-center">
            <div
              className={`
                w-20 h-20 rounded-full ${v.iconBg} flex items-center justify-center
                ring-8 ${v.ringColor}
              `}
            >
              <span className={`material-symbols-outlined text-[40px] ${v.iconColor}`}>
                {icon}
              </span>
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-2">
            <h3
              id="confirm-delete-title"
              className="text-xl font-extrabold text-on-surface tracking-tight"
            >
              {v.label} {typeLabel}?
            </h3>

            {/* Item name badge */}
            <div className="flex justify-center">
              <span
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold border ${v.badge} max-w-full`}
              >
                <span className="material-symbols-outlined text-[15px]">label</span>
                <span className="truncate max-w-[260px]">{config.itemName}</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-on-surface-variant leading-relaxed pt-1">
              {config.description ||
                `Hành động này sẽ ẩn ${typeLabel} khỏi hệ thống (soft delete). Bạn có thể khôi phục lại sau nếu cần.`}
            </p>
          </div>

          {/* Warning notice */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl px-4 py-3 flex items-start gap-3">
            <span className="material-symbols-outlined text-outline text-[18px] mt-0.5 shrink-0">
              info
            </span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Dữ liệu sẽ được lưu trữ ẩn trong cơ sở dữ liệu. Liên hệ quản trị viên để khôi phục.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button
              ref={cancelBtnRef}
              onClick={onCancel}
              disabled={isPending}
              className="
                flex-1 py-3.5 rounded-2xl border border-outline-variant
                font-bold text-sm text-on-surface
                hover:bg-surface-container-low active:scale-95
                transition-all duration-150
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-outline-variant
              "
            >
              Hủy bỏ
            </button>

            <button
              onClick={onConfirm}
              disabled={isPending}
              className={`
                flex-1 py-3.5 rounded-2xl text-white font-bold text-sm
                ${v.confirmBtn}
                active:scale-95 transition-all duration-150
                disabled:opacity-70 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
                shadow-lg shadow-error/20
                focus:outline-none focus:ring-4
              `}
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  {v.label}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* CSS animation keyframe */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
}
