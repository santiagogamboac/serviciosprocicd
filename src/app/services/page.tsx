"use client"
import { useEffect, useState } from "react"
import { Package, Check } from "lucide-react"
import Link from "next/link"

interface Service {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  isPopular?: boolean
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
//función para obtener los servicios desde el endpoint
  useEffect(() => {
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

    fetchServices()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ofrecemos una amplia gama de servicios profesionales diseñados para ayudarte a alcanzar tus objetivos
            empresariales.
          </p>
        </div>

        {services.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500">No hay servicios disponibles</h3>
            <p className="text-gray-400 mt-2">Vuelve pronto para ver nuestras ofertas.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden border ${service.isPopular ? "border-primary" : "border-gray-100"}`}
    >
      {service.isPopular && (
        <div className="bg-primary text-white text-center py-2 text-sm font-medium">Más Popular</div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{service.name}</h3>
        <div className="text-3xl font-bold text-primary mb-4">
          ${service.price.toFixed(2)}
          <span className="text-sm text-gray-500 font-normal">/mes</span>
        </div>

        <p className="text-gray-600 mb-6">{service.description}</p>

        <ul className="space-y-3 mb-6">
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>

        <Link
          href={`/contact?service=${service.id}`}
          className="block w-full bg-primary text-black text-center py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
        >
          Contratar Servicio
        </Link>
      </div>
    </div>
  )
}

