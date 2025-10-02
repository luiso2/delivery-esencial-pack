-- Script SQL para crear transportista de prueba en Odoo 17
-- Base de datos: odoo17_db
-- Tabla: res_partner

-- Verificar si existe el campo x_auth_token (para tokens)
-- Si no existe, crearlo primero
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'res_partner' 
        AND column_name = 'x_auth_token'
    ) THEN
        ALTER TABLE res_partner ADD COLUMN x_auth_token VARCHAR(255);
        ALTER TABLE res_partner ADD COLUMN x_token_expiry TIMESTAMP;
    END IF;
END $$;

-- Eliminar transportista de prueba si existe
DELETE FROM res_partner 
WHERE carrier_phone = '53512345678' 
AND is_delivery_carrier = true;

-- Crear transportista de prueba principal
INSERT INTO res_partner (
    name,
    display_name,
    is_company,
    active,
    is_delivery_carrier,
    carrier_phone,
    carrier_pin,
    carrier_state,
    carrier_vehicle_type,
    carrier_code,
    phone,
    mobile,
    email,
    street,
    city,
    create_date,
    write_date,
    create_uid,
    write_uid
) VALUES (
    'Pedro Delivery Test',
    'Pedro Delivery Test',
    false,
    true,
    true,
    '53512345678',
    '1234',
    'available',
    'car',
    'PD001',
    '53512345678',
    '53512345678',
    'pedro.delivery@test.com',
    'Calle 23 #456',
    'La Habana',
    NOW(),
    NOW(),
    2,  -- admin user id
    2   -- admin user id
);

-- Crear transportistas adicionales de prueba
INSERT INTO res_partner (
    name, display_name, is_company, active, is_delivery_carrier,
    carrier_phone, carrier_pin, carrier_state, carrier_vehicle_type, carrier_code,
    create_date, write_date, create_uid, write_uid
) VALUES 
(
    'Maria Transportista',
    'Maria Transportista',
    false, true, true,
    '53587654321', '5678', 'available', 'motorcycle', 'MT002',
    NOW(), NOW(), 2, 2
),
(
    'Juan Express',
    'Juan Express',
    false, true, true,
    '53555555555', '9999', 'available', 'bicycle', 'JE003',
    NOW(), NOW(), 2, 2
),
(
    'Carlos Delivery',
    'Carlos Delivery',
    false, true, true,
    '53511111111', '0000', 'busy', 'car', 'CD004',
    NOW(), NOW(), 2, 2
);

-- Verificar que se crearon correctamente
SELECT 
    id,
    name,
    carrier_phone,
    carrier_pin,
    carrier_state,
    carrier_vehicle_type,
    is_delivery_carrier
FROM res_partner
WHERE is_delivery_carrier = true
ORDER BY id DESC
LIMIT 10;

-- Mensaje de confirmación
DO $$
DECLARE
    count_carriers INTEGER;
BEGIN
    SELECT COUNT(*) INTO count_carriers 
    FROM res_partner 
    WHERE is_delivery_carrier = true;
    
    RAISE NOTICE 'Total de transportistas creados: %', count_carriers;
    RAISE NOTICE '';
    RAISE NOTICE '✅ Transportista principal creado:';
    RAISE NOTICE '   Nombre: Pedro Delivery Test';
    RAISE NOTICE '   Teléfono: 53512345678';
    RAISE NOTICE '   PIN: 1234';
    RAISE NOTICE '';
    RAISE NOTICE 'Puedes probar el login con estos datos en Next.js';
END $$;
