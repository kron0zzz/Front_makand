# Notas

Este archivo es pa borrar luego, son cosas que deberíamos tener en cuenta.

---


## Modulos

- podríamos meter en shared todos los estilos? así no se repite el mismo archivo
- todos los cambiar estado deberían ser pa algo, no? por ejemplo que no se le pueda crear un proyecto a un cliente que esté inactivo. Se debería implementar esas validaciones en toda parte
- !!!!todas las acciones deberían tener mensajes de confirmación, faltan varias cosas pa ponerle esas alertas
- en todos los endpoint de table, se debe organizar el orden en DESC

- El rol de asesor si deja hacer algunas cosas pero le falta la posibilidad de registrar pedidos por ejemplo (tal vez gestinarlo también?)
#### orders

- la información del usuario no debería ser el correo, más bien el nombre del empleado para identificarlo fácilmente, o no?
- poner botón de editar en ver detalles
- entonces que se va a hacer con el precio dentro de detallles? se puede modificar completamente?
- en la info debe aparecer el peso total
- en el formulario, no se debe permitir registrar 2 veces la misma maquina, y además se debería mostrar un indicador de que x maquina está en mantenimiento, no disponible, etc
- el transporte va después de maquinaria, no antes.


- aparte de hacer los ajustes de arriba, falta entonces el editar pedido

### workspace
#### returns
- en lugar de que cada card de maquinaria tenga su propio botón de devolución, se debería agregar un botón global que abra una modal para seleccionar cuáles equipos se devolvieron, en que cantidad y en que fecha, de esta manera la devolución no se hace pensando en la maquina que se devolvió sino en la fecha
#### cuts
- por qué mierda no me deja cerrar un pedido si no hice un corte un día después de las devoluciones?, es decir, puede que yo haya devuelto todo el 11 pero si el corte lo hice el mismo 11, el sistema aparentemente exige que el corte se registre un día después para poder cerrar el pedido

### users 
- al editar un usuario y asignar una contraseña, esta queda en texto plano en la db, es decir, no se encripta

### tipos de cobro
- todo melo manito

### proveedores
- también se debería implementar lo que se hizo en clientes, que cuando se registre se pueda seleccionar si es persona natural o jurídica y según eso, cambie lo del nombre, tipo de documento y tales


### proyectos
- hay un error de lógica, pues el formulario de edición espera un dato de "departamento" que no existe en la base de datos(porque así lo definimos). lo que hice para resolver fue quitarle el required al campo en el formulario así que por ahora funciona.
- deberíamos distribuir mejor la vista de ver detalles

### facturas de compra
- hay que solucionar esa cuestión de los códigos de las maquinarias cuando se compren, porque por ahora está muy pobre la lógica

### roles
- al crear un usuario y seleccionar permisos, estos no se guardan, pero al editar un usuario si (el error está solo en el create) (ya quedó)

### subalquileres
- que porquería de lógica la de los subalquileres
- cuando voy a seleccionar una maquina, aparece una lista blanca 

### cargos
- todo melo

### estado de maquinaria
- melo

### categoría de maquinaria
- meloski

### mantenimientos
- la lógica de editar mantenimiento y de eliminar mantenimiento debe reforzarse, porque por ahora no cambia el estado de maquinaria ni nada, no tiene un carajo de lógica cabrón... mamabicho el que lo lea.
- este podría tener una lógica mejor, en este momento se está guardando en la tabla de stock el campo de "proxima revision". Podríamos implementar la funcionalidad de que al realizar un mantenimiento, se pueda asignar también una fecha de próximo mantenimiento para que funcione como recordatorio. cuando se haga el próximo mantenimiento después de esa fecha, entonces se quitará esa fecha de proxima revisión o se renovará dependiendo de qué haga el usuario.
- no sé si sea muy urgente, pero en la tabla se podría agrupar los mantenimientos por fecha y cuando se haga click en ver detalles se muestre todos los equipos que se les hizo mantenimiento en esa fecha (ahora que lo pienso no sé si sea buena idea, porque entonces cuando hayan 2 tipos de maquina con la misma fecha q)

### estado pedido
- melo (se quitó)


## Preguntas pa yuly

- en cuanto a los cortes, cuando se establece que van a ser quincenales o mensuales, esa quincena o mensualidad se hace de 15 en 15 de cada mes o se le suman 15 días desde que inició el pedido?
- hay solo quincenal/mensual o hay más periodos de tiempo?
- preguntar si la distribución de pedidos está bien (porque yeison habló de que se debe manejar todo desde proyectos)