"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Pencil, Trash2, UserPlus, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Modal from "@/app/components/Modal"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "viewer"
}

export default function UsersPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
  })
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const userData = await res.json()
          setCurrentUser(userData)

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
      }
    }

    checkAuth()
    fetchUsers()
  }, [router])
//Función para obtener los usuarios desde la API
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const newUser = await res.json()
        setUsers((prev) => [...prev, newUser])
        setShowAddModal(false)
        setFormData({ name: "", email: "", role: "user" })
      } else {
        console.error("Error adding user")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    })
    setShowAddModal(true)
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingUser) return

    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const updatedUser = await res.json()
        setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
        setShowAddModal(false)
        setEditingUser(null)
        setFormData({ name: "", email: "", role: "user" })
      } else {
        console.error("Error updating user")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }
//Función para eliminar un usuario
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== userId))
      } else {
        console.error("Error deleting user")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  const isAdmin = currentUser?.role === "admin"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver al Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{isAdmin ? "Gestión de Usuarios" : "Listado de Usuarios"}</h1>

          {isAdmin && (
            <button
              onClick={() => {
                setEditingUser(null)
                setFormData({ name: "", email: "", role: "user" })
                setShowAddModal(true)
              }}
              className="bg-primary text-black px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Añadir Usuario
            </button>
          )}
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                {isAdmin && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
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
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-primary hover:text-primary/80 mr-3"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 4 : 3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="md:hidden">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white p-4 mb-4 rounded shadow">
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
              <div className="mt-2">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.role === "admin" ? "bg-purple-100 text-purple-800" : 
                  user.role === "user" ? "bg-blue-100 text-blue-800" : 
                  "bg-green-100 text-green-800"
                }`}>
                  {user.role === "admin" ? "Administrador" : user.role === "user" ? "Usuario" : "Visualizador"}
                </span>
              </div>
              {isAdmin && (
                <div className="mt-3 flex justify-end gap-3">
                  <button onClick={() => handleEditUser(user)} className="text-primary hover:text-primary/80">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    
      {isAdmin && (
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setEditingUser(null)
          }}
          title={editingUser ? "Editar Usuario" : "Añadir Usuario"}
          footer={
            <>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false)
                  setEditingUser(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="userForm"
                className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90"
              >
                {editingUser ? "Actualizar" : "Añadir"}
              </button>
            </>
          }
        >
          <form id="userForm" onSubmit={editingUser ? handleUpdateUser : handleAddUser} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                required
              >
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
                <option value="viewer">Visualizador</option>
              </select>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

