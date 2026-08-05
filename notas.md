# Notas

Este archivo es pa borrar luego, son cosas que deberíamos tener en cuenta.

---


## Modulos

- podríamos meter en shared todos los estilos? así no se repite el mismo archivo
- las facturas en este momento están medio inservibles, como lo vamos a relacionar después?
- todos los cambiar estado deberían ser pa algo, no? por ejemplo que no se le pueda crear un proyecto a un cliente que esté inactivo. Se debería implementar esas validaciones en toda parte
- !!!!todas las acciones deberían tener mensajes de confirmación, faltan varias cosas pa ponerle esas alertas

#### orders

- la modal de ver detalle de orders podría hacerse horizontal, datos del pedido al lado izquierdo y la maquinaria al lado derecho, así no se tiene que hacer scroll
- la fecha en los detalles de pedido deberían mostrar hora y en la tabla debería ser más entendible
- la información del usuario no debería ser el correo, más bien el nombre del empleado para identificarlo fácilmente, o no?
- poner botón de editar en ver detalles
- entonces que se va a hacer con el precio dentro de detallles? se puede modificar completamente?
- en los detalles debe aparecer el peso total
- en el formulario, no se debe permitir registrar 2 veces la misma maquina, y además se debería mostrar un indicador de que x maquina está en mantenimiento, no disponible, etc

!!! IMPORTANTE: esta mierda de orders tiene mucha más lógica de la que creí, en especial con anular un pedido

### next

aparte de hacer los ajustes de arriba, falta entonces el editar pedido y anular


### users 
- al editar un usuario y asignar una contraseña, esta queda en texto plano en la db, es decir, no se encripta

### tipos de cobro
- todo melo manito


### proyectos
- hay un error de lógica, pues el formulario de edición espera un dato de "departamento" que no existe en la base de datos(porque así lo definimos). lo que hice para resolver fue quitarle el required al campo en el formulario así que por ahora funciona.
- deberíamos distribuir mejor la vista de ver detalles

### facturas de compra
- melo 

### roles
- al crear un usuario y seleccionar permisos, estos no se guardan, pero al editar un usuario si (el error está solo en el create) (ya quedó)

### subalquileres
- todo melo

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
- melo


