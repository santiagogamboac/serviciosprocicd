"use client"
import type { ReactNode } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}
// Este componente Modal proporciona una ventana emergente que se puede abrir y cerrar, mostrando contenido dinámico y un pie de página opcional.
export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-gray-500/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-4">{title}</h3>

        <div className="mb-6">{children}</div>

        {footer && <div className="flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}
