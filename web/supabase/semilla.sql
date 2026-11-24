-- 3 vacantes de EJEMPLO para probar /empleos. Ejecutar en Supabase: SQL Editor → Run.
-- Los salarios y condiciones son inventados: edítalos o bórralos desde el panel /admin (fase 4).
-- Las fechas varían para ver la etiqueta "Nueva" (menos de 3 días) en unas sí y en otras no.

insert into public.vacantes
  (titulo, slug, area, zona, jornada, horario, tipo_contrato, salario, resumen, descripcion, responsabilidades, requisitos, estado, creada_en)
values
(
  'Operario/a de limpieza institucional',
  'operario-de-limpieza-institucional',
  'Limpieza', 'La Paz', 'Tiempo completo', 'Lunes a viernes, 7:00 a 15:00', 'Plazo fijo (1 año)',
  'Bs 3.000 mensuales',
  'Mantén impecables las oficinas de una institución en el centro de La Paz, con un equipo fijo y supervisión constante.',
  'Buscamos una persona responsable para el equipo que atiende a una institución pública en el centro de La Paz. Trabajarás siempre en el mismo lugar, con compañeros fijos y una supervisora que te acompaña. Te damos capacitación, uniforme y equipo de protección desde el primer día.',
  array[
    'Limpiar oficinas, baños, pasillos y áreas comunes según el plan diario',
    'Separar los residuos en origen para su reciclaje',
    'Reponer insumos de baños y cocinas',
    'Informar a la supervisora cualquier daño o necesidad'
  ],
  array[
    'Mayor de 18 años',
    'Experiencia en limpieza (no excluyente: te capacitamos)',
    'Puntualidad y responsabilidad',
    'Disponibilidad para trabajar en el centro de La Paz'
  ],
  'activa', now()
),
(
  'Auxiliar de reciclaje',
  'auxiliar-de-reciclaje',
  'Reciclaje', 'El Alto', 'Medio tiempo', 'Lunes a sábado, 8:00 a 12:00', 'Eventual (3 meses, renovable)',
  'Bs 1.600 mensuales',
  'Apoya la separación y el registro de residuos reciclables en nuestro centro de acopio de El Alto.',
  'Te sumarás al área de reciclaje, donde clasificamos y registramos los residuos que recogemos de nuestros clientes institucionales. Es un trabajo de medio tiempo, ideal si estudias o tienes responsabilidades familiares por la tarde.',
  array[
    'Clasificar papel, cartón, plástico y vidrio',
    'Pesar y registrar los materiales del día',
    'Mantener ordenado y limpio el centro de acopio'
  ],
  array[
    'Mayor de 18 años',
    'Ganas de aprender sobre reciclaje',
    'Vivir en El Alto o cerca'
  ],
  'activa', now() - interval '1 day'
),
(
  'Supervisor/a de limpieza',
  'supervisor-de-limpieza',
  'Supervisión', 'La Paz', 'Tiempo completo', 'Lunes a viernes, 7:00 a 16:00', 'Indefinido',
  null,
  'Coordina a un equipo de 8 a 12 personas en varias instituciones y asegura la calidad del servicio.',
  'Serás el enlace entre nuestros clientes institucionales y el equipo de limpieza. Planificarás turnos, harás recorridos de control de calidad y acompañarás la capacitación del personal nuevo.',
  array[
    'Organizar turnos y tareas del equipo',
    'Revisar la calidad del servicio con listas de control',
    'Atender a los clientes y resolver sus pedidos',
    'Capacitar al personal nuevo en técnicas y seguridad'
  ],
  array[
    'Al menos 2 años de experiencia en limpieza o en coordinación de equipos',
    'Buena comunicación y trato con las personas',
    'Manejo básico de celular y hojas de cálculo',
    'Disponibilidad para moverse entre La Paz y El Alto'
  ],
  'activa', now() - interval '10 days'
)
on conflict (slug) do nothing;
