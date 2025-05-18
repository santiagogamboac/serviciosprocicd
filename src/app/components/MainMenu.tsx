import Link from "next/link"
import Image from "next/image"
// Sección principal del menú
// Este componente proporciona una introducción a los servicios ofrecidos, junto con un botón de llamada a la acción para explorar más.
export default function MainMenu() {
  return (
    <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left order-2 md:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
              Servicios Profesionales para tu Moto
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-lg mx-auto md:mx-0">
            Ofrecemos servicios de alta calidad diseñados para
            el cuidado especializado de tu moto.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <Link
                href="/services"
                className="bg-primary text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-md font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base w-full sm:w-auto text-center"
              >
                Explorar Servicios
              </Link>
              <Link
                href="/contact"
                className="bg-white text-primary border border-primary px-5 py-2.5 sm:px-6 sm:py-3 rounded-md font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base w-full sm:w-auto text-center mt-3 sm:mt-0"
              >
                Contactar
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 mb-6 md:mb-0">
          <div className="relative w-full max-w-[450px] mx-auto md:max-w-[600px] aspect-[4/3]">
    <Image
      src="/images/moto.jpg"
      alt="Servicios Profesionales"
      fill
      sizes="(min-width: 768px) 50vw, 100vw"
      className="rounded-lg shadow-xl object-cover object-center"
    />
  </div>
          </div>
        </div>
      </div>

      {/* Decoración de fondo (opcional) */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent z-10 hidden md:block"></div>
    </section>
  )
}

