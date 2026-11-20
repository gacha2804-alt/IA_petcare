import resend
from app.core.config import settings

resend.api_key = settings.RESEND_API_KEY

def send_verification_email(nombre: str, correo: str, token: str) -> bool:
    """Envía un correo de verificación al usuario recién registrado."""
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"

    try:
        resend.Emails.send({
            "from": "PetCare <onboarding@resend.dev>",
            "to": correo,
            "subject": "🐾 Verifica tu cuenta en PetCare",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #16a34a;">🐾 PetCare</h1>
                    <p style="color: #6b7280;">Plataforma para el cuidado preventivo de tus mascotas</p>
                </div>

                <h2 style="color: #111827;">¡Hola, {nombre}!</h2>
                <p style="color: #374151; font-size: 16px;">
                    Gracias por registrarte en PetCare. Para activar tu cuenta y comenzar
                    a gestionar la salud de tus mascotas, confirma tu correo electrónico:
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{verification_url}"
                       style="background-color: #16a34a; color: white; padding: 14px 32px;
                              text-decoration: none; border-radius: 8px; font-size: 16px;
                              font-weight: bold; display: inline-block;">
                        ✅ Verificar mi cuenta
                    </a>
                </div>

                <p style="color: #6b7280; font-size: 14px;">
                    Este enlace expira en <strong>24 horas</strong>.<br>
                    Si no creaste esta cuenta, puedes ignorar este correo.
                </p>

                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                    PetCare — Cuidado preventivo para tus mascotas 🐾
                </p>
            </div>
            """
        })
        return True
    except Exception as e:
        print(f"❌ Error enviando correo de verificación: {e}")
        return False
