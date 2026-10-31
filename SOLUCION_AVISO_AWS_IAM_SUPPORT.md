# 🛡️ EXPLICACIÓN Y SOLUCIÓN: Aviso de AWS sobre "Support Center Console"

> **Tranquilidad ante todo:** Este aviso **NO rompe ni afecta en nada tu sitio web en Amazon S3**.  
> Tu Almanaque seguirá funcionando y viéndose perfectamente en internet para todos tus visitantes sin interrupciones.

---

## ❓ ¿Por qué Amazon AWS envió este aviso?
AWS envió este correo a todas las cuentas del mundo porque antes del **16 de noviembre de 2026** están modernizando los permisos internos de la consola para **abrir tickets de ayuda/soporte técnico**.

* **¿Tu sitio web en S3 usa esta API?**  
  **NO.** Tu sitio web solo usa almacenamiento estático de archivos web (`s3:GetObject`). Ningún visitante de tu web interactúa con el centro de soporte de AWS.
* **¿Cuándo te afectaría?**  
  Únicamente si creaste usuarios secundarios (subcuentas de IAM) y quieres que esos usuarios puedan escribirle al soporte técnico de Amazon desde la consola de AWS.
* **¿Si entras con tu correo principal (Cuenta Root de AWS)?**  
  **No tienes que hacer nada de nada**, porque la cuenta principal tiene permisos totales de forma automática y de por vida.

---

## 🛠️ Si usas un usuario de IAM y quieres dejarlo listo (Paso a paso en 2 minutos)

Si en tu cuenta de AWS creaste un usuario de IAM y quieres asegurarte de que nunca le salga el error `AccessDenied` al abrir el centro de soporte:

### Opción Rápida (1 solo clic - Recomendada por AWS):
1. Inicia sesión en la consola de AWS: [https://console.aws.amazon.com](https://console.aws.amazon.com).
2. En la barra de búsqueda superior escribe **IAM** y haz clic en **IAM**.
3. En el menú izquierdo, ve a **Usuarios** (Users) y haz clic en tu usuario.
4. En la pestaña **Permisos** (Permissions), haz clic en el botón azul **"Agregar permisos"** (Add permissions) &rarr; **"Asignar directivas directamente"** (Attach policies directly).
5. En el buscador de directivas escribe: `AWSSupportAccess`.
6. Marca la casilla de **`AWSSupportAccess`** y pulsa **Siguiente** &rarr; **Agregar permisos**.
7. ¡Listo! Ya quedó 100% blindado y aprobado por AWS para siempre.

---

### Opción Manual con el archivo incluido (`aws-support-iam-policy.json`):
Si en lugar de la directiva administrada prefieres crear tu propia política:
1. En la consola de IAM, haz clic en **Políticas** (Policies) &rarr; **Crear política** (Create policy).
2. Haz clic en la pestaña **JSON**.
3. Borra lo que haya y pega exactamente el contenido del archivo `aws-support-iam-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAWSSupportCenterConsoleOperations",
      "Effect": "Allow",
      "Action": [
        "support:Describe*",
        "support:CreateCase",
        "support:AddCommunicationToCase",
        "support:ResolveCase",
        "support:AddAttachmentsToSet",
        "support:DescribeAttachment"
      ],
      "Resource": "*"
    }
  ]
}
```
4. Haz clic en **Siguiente**, ponle como nombre `PoliticaSoporteConsola` y pulsa **Crear política**.
5. Asigna esa política a tu usuario de IAM.
