import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

interface User {
    id: string;
    name: string;
    email: string;
    password: string; 
  }
  

// Ruta al archivo JSON de usuarios
const usersFilePath = path.join(process.cwd(), "src", "data", "users.json")

// Función para leer usuarios del archivo JSON
const getUsers = () => {
  try {
    // Verificar si el archivo existe
    if (!fs.existsSync(usersFilePath)) {
      // Si no existe, crear un archivo con datos iniciales
      const initialUsers = [
        {
          id: "1",
          name: "Admin User",
          email: "admin@pro.com",
          password: "admin123",
          role: "admin",
        },
        {
          id: "2",
          name: "Viewer User",
          email: "user@pro.com",
          password: "user123",
          role: "viewer",
        },
      ]
      fs.writeFileSync(usersFilePath, JSON.stringify(initialUsers, null, 2))
      return initialUsers
    }

    // Leer el archivo
    const fileData = fs.readFileSync(usersFilePath, "utf8")
    return JSON.parse(fileData)
  } catch (error) {
    console.error("Error reading users file:", error)
    return []
  }
}

// Función para escribir usuarios en el archivo JSON
const saveUsers = (users: User[]) => {
  try {
    // Asegurarse de que el directorio existe
    const dir = path.dirname(usersFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
    return true
  } catch (error) {
    console.error("Error writing users file:", error)
    return false
  }
}

export async function GET() {
  try {
    const users:User[] = getUsers()

    // Filtrar información sensible como contraseñas
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const safeUsers = users.map(({ password, ...user }) => user)

    return NextResponse.json(safeUsers)
  } catch (error) {
    console.error("Error getting users:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear un nuevo usuario
export async function POST(request: Request) {
  try {
    const { name, email, role, password = "password123" } = await request.json()

    // Validaciones básicas
    if (!name || !email || !role) {
      return NextResponse.json({ message: "Nombre, email y rol son requeridos" }, { status: 400 })
    }

    const users = getUsers()

    // Verificar si el email ya existe
    const existingUser = users.find((user: User) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ message: "El email ya está registrado" }, { status: 400 })
    }

    // Crear nuevo usuario
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password, // En producción, esto estaría hasheado
      role,
    }

    users.push(newUser)
    saveUsers(users)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = newUser

    return NextResponse.json(safeUser, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

