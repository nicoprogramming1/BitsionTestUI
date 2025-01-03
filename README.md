# BitsionTestUI
This repository is for a Bitsion test

### Decisiones Técnicas

- Se implementa un interceptor para gestionar los encabezados y tokens de acceso auth al back
- Se utiliza CSS3 para las hojas de estilos
- El main font es Montserrat y se definen 3 weights para la aplicación
- 

## Patterns

- Patrón Inmutable: no modificando directamente los datos existentes, sino creando copias nuevas con las actualizaciones requeridas. Ejemplo en el state management uso ...state
- SRP: se aplican los principios de responsabilidad única para métodos y funcionalidades

## GlobalState

Se implementa una state management para Client de forma global, con la info de clientes recuperada y actualizada en signals y accedida mediante computed signals, junto con estados de error y loading.
También se implementa un segundo state management para los usuarios.

