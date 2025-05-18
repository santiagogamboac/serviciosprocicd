import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { User } from "@/types/user";

const filePath = path.join(process.cwd(), "src","data", "users.json");
const SECRET = "secreto_super_seguro"; 

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const user = users.find((u:User) => u.email === email && u.password === password);

  // Si el usuario no existe devuelve mensaje de error
  if (!user) {
    return NextResponse.json({ message: "Credenciales incorrectas" }, { status: 401 });
  }

  // Si existe devuelve el token encriptado
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1h" });

  return NextResponse.json({ token, user });
}
