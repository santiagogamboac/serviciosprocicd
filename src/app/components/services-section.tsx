import { Shield, Zap, BarChart } from "lucide-react"

export default function ServicesSection() {
  const services = [
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Servicio Básico",
      description:
        "Mantenimiento esencial para motociclistas que buscan un servicio mensual accesible y eficiente.",
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Plan Regular",
      description:
        "Este plan mejora el rendimiento y la seguridad de la moto con servicios adicionales.",
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: "Plan Premium",
      description:
        "Garantiza un rendimiento óptimo y un acabado impecable con mantenimiento avanzado.",
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ofrecemos una amplia gama de servicios profesionales diseñados para ayudarte a alcanzar tus objetivos
            empresariales.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
              <button className="mt-4 text-primary font-medium hover:underline">Saber más</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

