import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
//Sección de contacto
// Esta sección proporciona información de contacto, incluyendo dirección, teléfono, correo electrónico y horario de atención.
export default function ContactInfo() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contáctanos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para responder tus preguntas y ayudarte a encontrar la solución perfecta para tu negocio.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full mb-4">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="font-bold mb-2">Dirección</h3>
            <p className="text-gray-600">
              Av. Principal 123
              <br />
              Ciudad, CP 12345
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full mb-4">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="font-bold mb-2">Teléfono</h3>
            <p className="text-gray-600">
              +123 456 7890
              <br />
              +123 456 7891
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="font-bold mb-2">Email</h3>
            <p className="text-gray-600">
              info@servicios-pro.com
              <br />
              soporte@servicios-pro.com
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-bold mb-2">Horario</h3>
            <p className="text-gray-600">
              Lun - Vie: 9:00 - 18:00
              <br />
              Sáb: 10:00 - 14:00
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/contact"
            className="inline-flex bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Contactar Ahora
          </Link>
        </div>
      </div>
    </section>
  )
}

