# Notas

Este archivo es pa borrar luego, son cosas que deberíamos tener en cuenta.

---


## Modulos

- podríamos meter en shared todos los estilos? así no se repite el mismo archivo
- las facturas en este momento están medio inservibles, como lo vamos a relacionar después?
- todas las acciones deberían tener mensajes de confirmación
- todos los cambiar estado deberían ser pa algo, no? por ejemplo que no se le pueda crear un proyecto a un cliente que esté inactivo. Se debería implementar esas validaciones en toda parte

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

!!! IMPORTANTE: esta mierda de orders tiene mucha más lógica de la que creí, en especial con anular un pedido

### next

aparte de hacer los ajustes de arriba, falta entonces el editar pedido y anular


### users 
- los campos que se renderizan deben ser otros más(empleado y rol), en el back también se debe hacer el llamado
- al editar un usuario y asignar una contraseña, esta queda en texto plano en la db, es decir, no se encripta
- el estado debe ser switch

### tipos de cobro
- no funciona el eliminar
- el nombre del tipo de cobro debe ser unique


### proyectos
- hay un error de lógica, pues el formulario de edición espera un dato de "departamento" que no existe en la base de datos(porque así lo definimos). entonces tenemos dos opciones: 1= incluir el dato de departamento en la db, 2= modificar el formulario para que cargue el departamento según la ciudad seleccionada

### facturas de compra
- si hay un ver detalle, pero como puedo ver la imagen más de cerca? tal vez descargandola o abariendo una vista dedicada?

### roles
- el estado debe ser switch
- pasa algo con el ver detalle, no sé bien como fue que sara hizo esa lógica
- el nombre de los roles debe ser unique

### subalquileres
- estado debe ser switch

### cargos
- el nombre de los cargos debe ser unique

### estado de maquinaria
- el nombre del estado debe ser unique

### categoría de maquinaria
- el nombre de la categoría debe ser unique

### mantenimientos
- no se debe traer el id de la maquina sino el nombre
- la fecha debe tener el formato que ya está establecido en shared/utils/dateUtils.js
- las notas no deben estar en la tabla, para eso se debe crear un ver detalle de mantenimiento
- cuando se edita, el campo de la fecha queda vacío

### estado pedido
- el nombre del estado debe ser unique


