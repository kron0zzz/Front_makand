# Notas

Este archivo es para anotar todas las cosas que hay que corregir y que el agente de ia lo corrija

---


- Cargos melo



## roles
- el estado de roles en este momento se puede modificar libremente con el switch, pero en realidad el sistema debe validar que este rol no esté registrado con otro usuario, de ser así, no se debe permitir inactivar este y debe mostrar su respectiva alerta indicandolo con un mensaje descriptivo

## purchase_invoices
- en el formulario de creación de factura de compra, en el campo de proveedores, los proveedores que tengan un supplier_status=false deben aparecer opacos y no se deben permitir seleccionar
- cuando se añada maquinaria motorizada en el formularios de compra, el serial ya no debe incluir letras sino números únicamente, este campo de serial debe tener máximo 6 números para identificar cada stock(equipo). El formulario debe validar cuál fue el último numero serial registrado y si por ejemplo se establece que serán 3 equipos motorizados, se debe tomar como referencia el último registro de serial y poner la secuencia que sigue, de tal manera que si ya hay un serial "100434" registrado, el formulario pondrá de forma automática para los tres equipos en el campo de serial los seriales 100435, 100436 y así sucesivamente a menos que se seleccione el switch de serial manual. la idea es que todo esto lo haga el formulario.
- en el formulario cuando se seleccione maquinaria motorizada no debe aparecer el check de "¿propio?", sino que el formulario debe enviar automáticamente como true de forma que no aparezca en el formulario.

## projects
- en el formulario de proyectos, cuando se vaya a seleccionar un cliente, se debe validar su customer_status y si es false, en la lista este debe aparecer opaco y no se debe poder seleccionar.

## machinery
- cuando se añada maquinaria motorizada en el formulario de maquinaria, el serial, al igual que con las compras ya no debe incluir letras sino números únicamente, este campo de serial debe tener máximo 6 números para identificar cada stock(equipo). El formulario debe validar cuál fue el último numero serial registrado y si por ejemplo se establece que serán 3 equipos motorizados, se debe tomar como referencia el último registro de serial y poner la secuencia que sigue, de tal manera que si ya hay un serial "100434" registrado, el formulario pondrá de forma automática para los tres equipos en el campo de serial los seriales 100435, 100436 y así sucesivamente a menos que se seleccione el switch de serial manual. la idea es que todo esto lo haga el formulario.

## maintenances 
- en el formulario de mantenimientos, cuando se esté editando un mantenimiento en el formulario no deben aparecer los campos de maquinaria ni seleccionar equipos, solo debe aparecer un campo que no se pueda editar con el nombre de la maquinaria, el campo de fecha y el de notas se mantienen con la posibilidad de editar. claramente cuando el formulario sea para registro debe permanecer tal y como está.
- cuando elimine un mantenimiento, se debe agregar otra funcionalida desde el caso de uso y es que si elimino un mantenimiento, se debe cambiar el estado de la maquinaria a "en mantenimiento" nuevamente, ya que el registro de mantenimiento fue eliminado. 


## orders
- en el formulario de orders, en el campo de frecuencia de cortes no puede haber una opción de "sin frecuencia", solo deben haber las opciones de quincenal o mensual  y este campo debe ser obligatorio

### returns
- en las devoluciones, la fecha debe validar que no se pueda ingresar una fecha que ya fue cubierta por un corte

### cuts
- eliminar corte

### payments
- eliminar/anular pago

