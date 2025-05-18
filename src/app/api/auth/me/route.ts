import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const JWT_SECRET = "secreto_super_seguro"

export async function GET() {
  try {
 // Verificar si el token existe en las cookies
    const cookieStore = cookies()
    const token = (await cookieStore).get("token")?.value
    console.log(token)
    if (!token) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 })
    }

    // En caso de recibir un token invalido devuelve error
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      return NextResponse.json(decoded)
    } catch (error) {
      console.error("Error al verificar token:", error)
      return NextResponse.json({ message: "Token inválido" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error al verificar autenticación:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

