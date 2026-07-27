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
- no solo debe haber proyectos, también clientes pero que sirva solo como filrtro
- el seleccionar maquinaria debe ser más cómodo, permitiendo filtrar
- entonces que se va a hacer con el precio dentro de detallles? se puede modificar completamente?
- para el front, ese descuento está muy raro
- en los detalles debe aparecer el peso total
- al crear un pedido, se debe validar que solo se puedan seleccionar maquinas disponibles, no que estén en mantenimiento
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
- todo melo

### estado pedido
- melo


