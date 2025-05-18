import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = "secreto_super_seguro";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Si no existe el token lo redirecciona al inicio de sesion
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // En caso de recibir un token invalido devuelve error
  try {
    const decoded = jwt.verify(token, SECRET) as { role: string };

    if (req.nextUrl.pathname.startsWith("/admin") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch (error) {
    console.log("Error al verificar token:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"]
};
