#!/usr/bin/env python3
import xmlrpc.client

# Configuración
ODOO_URL = 'http://localhost:30017'
ODOO_DB = 'odoo17_db'

# Intentar conectar con la contraseña actual que sabemos que funciona desde la web
# Primero voy a probar con 'admin' para cambiarla a 'admin123'

def change_password():
    try:
        # Conectar con XML-RPC
        common = xmlrpc.client.ServerProxy(f'{ODOO_URL}/xmlrpc/2/common')
        
        print("[INFO] Probando autenticacion con contrasena actual...")
        
        # Probar con diferentes contraseñas posibles
        passwords_to_try = ['admin', 'admin123', '123', 'password', '']
        
        uid = None
        current_password = None
        
        for pwd in passwords_to_try:
            print(f"   Probando: {pwd}")
            uid = common.authenticate(ODOO_DB, 'admin', pwd, {})
            if uid:
                current_password = pwd
                print(f"[OK] Autenticacion exitosa con: {pwd}")
                break
        
        if not uid:
            print("[ERROR] No se pudo autenticar con ninguna contrasena")
            return False
        
        print(f"[INFO] UID obtenido: {uid}")
        
        # Ahora cambiar la contraseña usando el método change_password
        models = xmlrpc.client.ServerProxy(f'{ODOO_URL}/xmlrpc/2/object')
        
        # Cambiar contraseña
        print("[INFO] Cambiando contrasena a 'admin123'...")
        result = models.execute_kw(
            ODOO_DB, uid, current_password,
            'res.users', 'write',
            [[uid], {'password': 'admin123'}]
        )
        
        if result:
            print("[OK] Contrasena cambiada exitosamente!")
            
            # Verificar que la nueva contraseña funciona
            print("[INFO] Verificando nueva contrasena...")
            new_uid = common.authenticate(ODOO_DB, 'admin', 'admin123', {})
            if new_uid:
                print("[OK] Verificacion exitosa! La contrasena es ahora 'admin123'")
                return True
            else:
                print("[ERROR] Error: La nueva contrasena no funciona")
                return False
        else:
            print("[ERROR] Error al cambiar la contrasena")
            return False
            
    except Exception as e:
        print(f"[ERROR] Error: {e}")
        return False

if __name__ == "__main__":
    change_password()
