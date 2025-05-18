import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
// Este componente Footer proporciona información de contacto, enlaces rápidos y redes sociales para la empresa ServiciosPro.
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ServiciosPro</h3>
            <p className="text-gray-400 mb-4">
              Ofrecemos servicios profesionales para satisfacer todas tus necesidades para el cuidado de su motocicleta.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  Servicios
                </Link>
              </li>       
              <li>
                <Link href="/#testimonials" className="text-gray-400 hover:text-white transition-colors">
                  Testimonios
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Servicios */}
          <div>
            <h3 className="text-xl font-bold mb-4">Nuestros Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/premium" className="text-gray-400 hover:text-white transition-colors">
                  Servicio Premium
                </Link>
              </li>
              <li>
                <Link href="/services/basic" className="text-gray-400 hover:text-white transition-colors">
                  Servicio Básico
                </Link>
              </li>
              <li>
                <Link href="/services/enterprise" className="text-gray-400 hover:text-white transition-colors">
                  Servicio Empresarial
                </Link>
              </li>
              <li>
                <Link href="/services/custom" className="text-gray-400 hover:text-white transition-colors">
                  Soluciones Personalizadas
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-400">
                  Av. Principal 123
                  <br />
                  Ciudad, CP 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-400">+123 456 7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-400">info@servicios-pro.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} ServiciosPro. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

