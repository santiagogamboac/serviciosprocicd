import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { User } from "@/types/user"

// Ruta al archivo JSON de usuarios
const usersFilePath = path.join(process.cwd(), "src", "data", "users.json")
// Función para leer usuarios desde el archivo JSON
const getUsers = () => {
  try {
    if (!fs.existsSync(usersFilePath)) {
      return []
    }

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
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
    return true
  } catch (error) {
    console.error("Error writing users file:", error)
    return false
  }
}

// GET - Obtener un usuario por ID
export async function GET(request: Request, { params }: { params:Promise< { id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const users = getUsers()
    const user = users.find((u: User) => u.id === id)

    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 })
    }

    // Filtrar información sensible
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error("Error getting user:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT - Actualizar un usuario
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const { name, email, role } = await request.json()

    // Validaciones básicas
    if (!name || !email || !role) {
      return NextResponse.json({ message: "Nombre, email y rol son requeridos" }, { status: 400 })
    }

    const users = getUsers()
    const userIndex = users.findIndex((u: User) => u.id === id)

    if (userIndex === -1) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 })
    }

    // Verificar si el email ya existe en otro usuario
    const emailExists = users.some((u: User, index: number) => u.email === email && index !== userIndex)

    if (emailExists) {
      return NextResponse.json({ message: "El email ya está registrado por otro usuario" }, { status: 400 })
    }

    // Actualizar usuario
    const updatedUser = {
      ...users[userIndex],
      name,
      email,
      role,
    }

    users[userIndex] = updatedUser
    saveUsers(users)

    // Devolver usuario sin contraseña
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = updatedUser

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar un usuario
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const users = getUsers()
    const userIndex = users.findIndex((u: User) => u.id === id)

    if (userIndex === -1) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 })
    }

    // Eliminar usuario
    users.splice(userIndex, 1)
    saveUsers(users)

    return NextResponse.json({ message: "Usuario eliminado correctamente" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

