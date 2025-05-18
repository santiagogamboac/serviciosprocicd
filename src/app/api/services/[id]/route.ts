import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

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
      return []
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
    fs.writeFileSync(servicesFilePath, JSON.stringify(services, null, 2))
    return true
  } catch (error) {
    console.error("Error writing services file:", error)
    return false
  }
}

// GET - Obtener un servicio por ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id

    const services = getServices()
    const service = services.find((s: Service) => s.id === id)

    if (!service) {
      return NextResponse.json({ message: "Servicio no encontrado" }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error getting service:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT - Actualizar un servicio
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id

    const { name, description, price, features, isPopular } = await request.json()

    // Validaciones básicas
    if (!name || !description || price === undefined || !features) {
      return NextResponse.json({ message: "Faltan campos requeridos" }, { status: 400 })
    }

    const services = getServices()
    const serviceIndex = services.findIndex((s: Service) => s.id === id)

    if (serviceIndex === -1) {
      return NextResponse.json({ message: "Servicio no encontrado" }, { status: 404 })
    }

    // Actualizar servicio
    const updatedService: Service = {
      ...services[serviceIndex],
      name,
      description,
      price: Number(price),
      features,
      isPopular,
    }

    services[serviceIndex] = updatedService
    saveServices(services)

    return NextResponse.json(updatedService)
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar un servicio
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id

    const services = getServices()
    const serviceIndex = services.findIndex((s: Service) => s.id === id)

    if (serviceIndex === -1) {
      return NextResponse.json({ message: "Servicio no encontrado" }, { status: 404 })
    }

    // Eliminar servicio
    services.splice(serviceIndex, 1)
    saveServices(services)

    return NextResponse.json({ message: "Servicio eliminado correctamente" })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

