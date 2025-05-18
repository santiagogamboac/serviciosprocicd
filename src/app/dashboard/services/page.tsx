"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Package, Pencil, Trash2, Plus, Search, ArrowLeft, X } from "lucide-react"
import Link from "next/link"
import Modal from "@/app/components/Modal"

interface Service {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  isPopular?: boolean
}

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "viewer"
}

export default function ServicesPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "0",
    isPopular: false,
    features: [""],
  })
  const router = useRouter()
// Verificar autenticación y obtener servicios al cargar la página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const userData = await res.json()
          setCurrentUser(userData)

          // Si el usuario tiene rol "user", redirigir a la página principal
          if (userData.role === "user") {
            router.push("/")
          }
        } else {
          // No autenticado, redirigir al login
          router.push("/login")
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error)
        router.push("/login")
      }
    }

    checkAuth()
    fetchServices()
  }, [router])
//consumo del endpoint para obtener los servicios
  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services")
      if (res.ok) {
        const data = await res.json()
        setServices(data)
      } else {
        console.error("Error fetching services")
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures[index] = value
    setFormData((prev) => ({ ...prev, features: updatedFeatures }))
  }

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }))
  }

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const updatedFeatures = formData.features.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, features: updatedFeatures }))
    }
  }

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Filtrar características vacías
      const filteredFeatures = formData.features.filter((feature) => feature.trim() !== "")

      const serviceData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        features: filteredFeatures,
      }

      const res = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      })

      if (res.ok) {
        const newService = await res.json()
        setServices((prev) => [...prev, newService])
        setShowModal(false)
        resetForm()
      } else {
        console.error("Error adding service")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }
// Función para manejar la edición de un servicio
  const handleEditService = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      isPopular: service.isPopular || false,
      features: service.features.length > 0 ? service.features : [""],
    })
    setShowModal(true)
  }
// Función para manejar la actualización de un servicio
  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingService) return

    try {
      // Filtrar características vacías
      const filteredFeatures = formData.features.filter((feature) => feature.trim() !== "")

      const serviceData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        features: filteredFeatures,
      }

      const res = await fetch(`/api/services/${editingService.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      })

      if (res.ok) {
        const updatedService = await res.json()
        setServices((prev) => prev.map((service) => (service.id === updatedService.id ? updatedService : service)))
        setShowModal(false)
        resetForm()
      } else {
        console.error("Error updating service")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }
//Función para manejar la eliminación de un servicio
  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este servicio?")) return

    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setServices((prev) => prev.filter((service) => service.id !== serviceId))
      } else {
        console.error("Error deleting service")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }
// Función para restablecer el formulario y cerrar el modal
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "0",
      isPopular: false,
      features: [""],
    })
    setEditingService(null)
  }

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  const isAdmin = currentUser?.role === "admin"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver al Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{isAdmin ? "Gestión de Servicios" : "Listado de Servicios"}</h1>

          {isAdmin && (
            <button
              onClick={() => {
                resetForm()
                setShowModal(true)
              }}
              className="bg-primary text-black px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Añadir Servicio
            </button>
          )}
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar servicios..."
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    {service.isPopular && (
                      <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Popular</span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{service.description}</p>

                  <div className="text-lg font-bold text-primary mb-3">
                    ${service.price.toFixed(2)}
                    <span className="text-xs text-gray-500 font-normal">/mes</span>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-500 mb-1">Características:</p>
                    <ul className="text-sm text-gray-600 pl-5 list-disc">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="line-clamp-1">
                          {feature}
                        </li>
                      ))}
                      {service.features.length > 3 && (
                        <li className="text-gray-400">Y {service.features.length - 3} más...</li>
                      )}
                    </ul>
                  </div>

                  {isAdmin && (
                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleEditService(service)}
                        className="text-primary hover:text-primary/80 p-1"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500">No hay servicios disponibles</h3>
            <p className="text-gray-400 mt-2">
              {searchTerm ? "No se encontraron resultados para tu búsqueda." : "Añade servicios para comenzar."}
            </p>
          </div>
        )}
      </div>

      {/* Modal para añadir/editar servicio */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          resetForm()
        }}
        title={editingService ? "Editar Servicio" : "Añadir Servicio"}
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setShowModal(false)
                resetForm()
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="serviceForm"
              className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90"
            >
              {editingService ? "Actualizar" : "Añadir"}
            </button>
          </>
        }
      >
        <form id="serviceForm" onSubmit={editingService ? handleUpdateService : handleAddService} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Servicio
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Precio Mensual ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPopular"
              name="isPopular"
              checked={formData.isPopular}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="isPopular" className="ml-2 block text-sm text-gray-700">
              Marcar como servicio popular
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Características</label>

            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-grow border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                  placeholder="Ej: Soporte 24/7"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                  disabled={formData.features.length <= 1}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addFeature}
              className="mt-1 text-sm text-primary hover:text-primary/80 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Añadir característica
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

