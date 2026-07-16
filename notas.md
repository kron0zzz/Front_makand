# Notas

Este archivo es pa borrar luego, son cosas que deberíamos tener en cuenta.

---

- podríamos meter en shared todos los estilos? así no se repite el mismo archivo
- las facturas en este momento están medio inservibles, como lo vamos a relacionar después?





## Modulos

#### orders

- la modal de ver detalle de orders podría hacerse horizontal, datos del pedido al lado izquierdo y la maquinaria al lado derecho, así no se tiene que hacer scroll
- la fecha en los detalles de pedido deberían mostrar hora y en la tabla debería ser más entendible
- la información del usuario no debería ser el correo, más bien el nombre del empleado para identificarlo fácilmente, o no?
- poner botón de editar en ver detalles
- no solo debe haber proyectos, también clientes pero que sirva solo como filrtro
- el seleccionar maquinaria debe ser más cómodo, permitiendo filtrar
- entonces que se va a hacer con el precio dentro de detallles? se puede modificar completamente?

!!! IMPORTANTE: esta mierda de orders tiene mucha más lógica de la que creí, en especial con anular un pedido

### next

aparte de hacer los ajustes de arriba, falta entonces el editar pedido y anular


### users 
- los campos que se renderizan deben ser otros más, en el back también se debe hacer el llamado

### tipos de cobro
- no funciona el eliminar

### clientes
- no funciona el switch de cambio de estado (se está ejecutando una vuelta ahí dentro del customerPage en lugar de importarlo del hook y sara puso para que requiera permisos)

### proveedores
- no se traen algunos datos, por lo que no se muestran ni en detalle ni en formulario de edición (es porque se estan importando los datos de forma distinta ahora que se implementó la paginacion)
