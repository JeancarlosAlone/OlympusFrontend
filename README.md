Olympus Hotel Management System – Frontend

Web application developed with Angular for managing hotel reservations, online payments, and internal administrative operations.

This system allows clients to make online room reservations with integrated payment processing, while also providing hotel staff with tools for operational control and service management.



 Technologies Used
- Angular
- TypeScript
- HTML5 & CSS3
- REST API integration
- Payment gateway integration (PayPal / Card processing)

 Core Features
- Online Reservation System
- Real-time room availability
- Dynamic reservation forms
- Selection of additional services (parking, complementary services, etc.)

Online Payment Processing
- Integration with payment gateways
- Reservation confirmation after successful payment
- Transaction data synchronization with backend

 Room & Service Management
- Room status control (available / reserved / occupied)
- Additional services assignment per reservation
- Reservation history tracking

 Administrative Control Panel
- Client management
- Reservation tracking
- Operational monitoring

System Architecture
The frontend follows a modular Angular architecture:

- Component-based UI structure
- Services for API communication
- Models for structured data handling
- Routing module for application navigation

The application communicates with a Spring Boot backend through RESTful APIs for business logic and database operations.



Installation & Execution
npm install
ng serve


Clone the repository:

```bash
git clone https://github.com/JeancarlosAlone/OlympusFrontend.git
