# BitsionTestUI
This repository is for a Bitsion test

### Decisiones Técnicas

- Se implementa un interceptor para gestionar los encabezados y tokens de acceso auth al back
- Se utiliza CSS3 para las hojas de estilos
- Se utilizan guards para restringir el acceso a roles a funcionalidades específicas
- Se implementa paginación para listados de clientes
- Se gestionan los access token y refresh token y sus expiraciones guardados en LocalStorage (con más tiempo hubiera implementado HttpOnly cookies que es más seguro y previene CSRF y XSS)

## GlobalState

Se implementa una state management para Client de forma global, con la info de clientes recuperada y actualizada en signals y accedida mediante computed signals, junto con estados de error y loading.
También se implementa un segundo state management para los usuarios.

