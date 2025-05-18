import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// Ruta al archivo JSON de servicios
const servicesFilePath = path.join(process.cwd(), "src", "data", "services.json")

// Definición del tipo Service
interface Service {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  isPopular?: boolean
}

// Función para leer servicios del archivo JSON
const getServices = () => {
  try {
    // Verificar si el archivo existe
    if (!fs.existsSync(servicesFilePath)) {
      // Si no existe, crear un archivo con datos iniciales
      const initialServices = [
        {
          id: "1",
          name: "Servicio Básico",
          description:
            "Paquete esencial con todas las herramientas necesarias para comenzar a optimizar tus operaciones empresariales.",
          price: 29.99,
          features: ["Soporte por email", "Acceso a la plataforma básica", "Actualizaciones mensuales", "1 usuario"],
        },
        {
          id: "2",
          name: "Servicio Premium",
          description:
            "Soluciones completas con soporte prioritario y funcionalidades avanzadas para maximizar el rendimiento de tu negocio.",
          price: 99.99,
          features: [
            "Soporte prioritario 24/7",
            "Acceso a todas las funcionalidades",
            "Actualizaciones semanales",
            "5 usuarios",
            "Reportes avanzados",
            "API completa",
          ],
          isPopular: true,
        },
        {
          id: "3",
          name: "Servicio Empresarial",
          description:
            "Solución escalable diseñada específicamente para empresas con necesidades complejas y equipos grandes.",
          price: 199.99,
          features: [
            "Soporte dedicado",
            "Funcionalidades personalizadas",
            "Actualizaciones en tiempo real",
            "Usuarios ilimitados",
            "Integración con sistemas existentes",
            "Consultoría estratégica",
            "Seguridad avanzada",
          ],
        },
      ]

      // Crear directorio si no existe
      const dir = path.dirname(servicesFilePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      fs.writeFileSync(servicesFilePath, JSON.stringify(initialServices, null, 2))
      return initialServices
    }

    // Leer el archivo
    const fileData = fs.readFileSync(servicesFilePath, "utf8")
    return JSON.parse(fileData)
  } catch (error) {
    console.error("Error reading services file:", error)
    return []
  }
}

// Función para escribir servicios en el archivo JSON
const saveServices = (services: Service[]) => {
  try {
    // Asegurarse de que el directorio existe
    const dir = path.dirname(servicesFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(servicesFilePath, JSON.stringify(services, null, 2))
    return true
  } catch (error) {
    console.error("Error writing services file:", error)
    return false
  }
}

// GET - Obtener todos los servicios
export async function GET() {
  try {
    const services = getServices()
    return NextResponse.json(services)
  } catch (error) {
    console.error("Error getting services:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear un nuevo servicio
export async function POST(request: Request) {
  try {
    const { name, description, price, features, isPopular } = await request.json()

    // Validaciones básicas
    if (!name || !description || price === undefined || !features) {
      return NextResponse.json({ message: "Faltan campos requeridos" }, { status: 400 })
    }

    const services = getServices()

    // Crear nuevo servicio
    const newService: Service = {
      id: uuidv4(),
      name,
      description,
      price: Number(price),
      features,
      isPopular,
    }

    // Guardar en el archivo
    services.push(newService)
    saveServices(services)

    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

