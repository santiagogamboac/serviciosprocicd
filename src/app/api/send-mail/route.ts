import nodemailer from "nodemailer"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, name, message } = await req.json()

    // Configurar el transporte de Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Puedes usar otros servicios como Outlook, Yahoo, etc.
      auth: {
        user: "santiagogamboacely@gmail.com", // Reemplaza con tu correo
        pass: "cobfrxkuroegfhcz", // Usa una contraseña de aplicación
      },
    })

    // Correo para el cliente
    const mailOptionsClient = {
      from: '"ServiciosPro" <santiagogambocely@gmail.com>', // Remitente
      to: email, 
      subject: "Hemos recibido tu mensaje",
      text: `Hola ${name},\n\nGracias por contactarnos. Hemos recibido tu mensaje:\n\n"${message}"\n\nNos pondremos en contacto contigo pronto.\n\nSaludos,\nEl equipo de ServiciosPro`,
      html: `  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
    <h2 style="color: #4CAF50; text-align: center;">¡Gracias por contactarnos!</h2>
    <p>Hola <strong>${name}</strong>,</p>
    <p>Hemos recibido tu mensaje y queremos agradecerte por tomarte el tiempo de escribirnos. Aquí está el mensaje que nos enviaste:</p>
    <blockquote style="border-left: 4px solid #4CAF50; padding-left: 10px; color: #555; margin: 10px 0;">
      ${message}
    </blockquote>
    <p>Nos pondremos en contacto contigo lo antes posible para responder a tus inquietudes.</p>
    <p style="margin-top: 20px;">Saludos cordiales,</p>
    <p><strong>El equipo de ServiciosPro</strong></p>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    <p style="font-size: 12px; color: #888; text-align: center;">
      Este es un correo generado automáticamente. Por favor, no respondas a este mensaje.
    </p>
  </div>`,
    }
  // Correo para ti (administrador)
  const mailOptionsAdmin = {
    from: '"ServiciosPro" <santiagogamboacely@gmail.com>', // Remitente
    to: "tucorreo@gmail.com", // Tu correo
    subject: "Nuevo mensaje de contacto",
    text: `Has recibido un nuevo mensaje de contacto:\n\nNombre: ${name}\nCorreo: ${email}\nMensaje: ${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #4CAF50; text-align: center;">Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Correo:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <blockquote style="border-left: 4px solid #4CAF50; padding-left: 10px; color: #555; margin: 10px 0;">
          ${message}
        </blockquote>
        <p style="margin-top: 20px;">Revisa esta información y responde al cliente lo antes posible.</p>
      </div>
    `,
  }

    // Enviar el correo
    await transporter.sendMail(mailOptionsClient)
    //Enviar correo al administrador
    await transporter.sendMail(mailOptionsAdmin)
    return NextResponse.json({ success: true, message: "Correo enviado correctamente" })
  } catch (error) {
    console.error("Error enviando correo:", error)
    return NextResponse.json({ success: false, message: "Error enviando correo" }, { status: 500 })
  }
}