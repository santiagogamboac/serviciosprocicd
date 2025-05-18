"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, Eye, Users, Package } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "viewer"
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)

          // Si el usuario tiene rol "user", redirigir a la página principal
          if (userData.role === "user") {
            router.push("/")
          }
        } else {
          // No autenticado, redirigir al login
          router.push("/login")
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null // El useEffect redirigirá al login
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            {user.role === "admin" ? (
              <Shield className="h-8 w-8 text-primary" />
            ) : (
              <Eye className="h-8 w-8 text-primary" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Bienvenido, {user.name}</h1>
            <p className="text-gray-600">Rol: {user.role === "admin" ? "Administrador" : "Visualizador"}</p>
          </div>
        </div>

        <p className="text-gray-700">
          {user.role === "admin"
            ? "Como administrador, tienes acceso completo a todas las funcionalidades de la plataforma."
            : "Como visualizador, puedes ver toda la información pero no puedes realizar cambios."}
        </p>
      </div>

      {/* Contenido específico según el rol */}
      {user.role === "admin" ? <AdminDashboard /> : <ViewerDashboard />}
    </div>
  )
}
// AdminDashboard y ViewerDashboard son componentes separados para cada rol
function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Panel de Administración</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/dashboard/users"
            className="border rounded-lg p-6 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="bg-primary/10 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Gestión de Usuarios</h3>
              <p className="text-gray-600 text-sm">Administra los usuarios de la plataforma</p>
            </div>
          </Link>

          <Link
            href="/dashboard/services"
            className="border rounded-lg p-6 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="bg-primary/10 p-3 rounded-full">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Gestión de Servicios</h3>
              <p className="text-gray-600 text-sm">Administra los servicios ofrecidos</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Estadísticas</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="text-2xl font-bold text-primary mb-1">24</div>
            <div className="text-gray-600 text-sm">Usuarios Registrados</div>
          </div>
        </div>
      </div>
    </div>
  )
}
// ViewerDashboard es un componente separado para el rol "viewer"
// Este componente muestra un panel de visualización con estadísticas y un listado de usuarios
function ViewerDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users")
        if (res.ok) {
          const data = await res.json()
          setUsers(data)
        } else {
          console.error("Error fetching users")
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Panel de Visualización</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/dashboard/users"
            className="border rounded-lg p-6 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="bg-primary/10 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Usuarios</h3>
              <p className="text-gray-600 text-sm">Ver listado de usuarios</p>
            </div>
          </Link>

          <Link
            href="/dashboard/services"
            className="border rounded-lg p-6 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="bg-primary/10 p-3 rounded-full">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Servicios</h3>
              <p className="text-gray-600 text-sm">Ver catálogo de servicios</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Añadiendo estadísticas para el rol "viewer" */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Estadísticas</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="text-2xl font-bold text-primary mb-1">24</div>
            <div className="text-gray-600 text-sm">Usuarios Registrados</div>
          </div>       
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Listado de Usuarios</h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "user"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role === "admin" ? "Administrador" : user.role === "user" ? "Usuario" : "Visualizador"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                      No se encontraron usuarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

