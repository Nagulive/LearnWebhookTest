# Hall Booking Platform - Comprehensive Project Plan

This document outlines the remaining work required to take the initial cloud-native architectural skeleton and develop it into a fully functional, production-ready platform encompassing a Web API, React Web Portals, and a Mobile Application.

The work is broken down into specific tasks that can be assigned to developers or tackled in subsequent iterations.

---

## Epic 1: Security & Backend Hardening

Currently, the backend uses a skeleton authentication system. This epic focuses on securing the application for production.

*   **Task 1.1: Implement Secure Password Hashing:**
    *   Update `AuthController.cs` to use BCrypt or ASP.NET Core Identity's `PasswordHasher` instead of storing plain-text passwords.
*   **Task 1.2: Environment Variable Configuration:**
    *   Remove the hardcoded fallback JWT secret in `Program.cs`.
    *   Ensure all secrets (DB credentials, API keys) are strictly loaded via `appsettings.json` or Docker environment variables.
*   **Task 1.3: Advanced Authorization Policies:**
    *   Implement resource-based authorization. Ensure that a `HallOwner` can only update or delete *their own* halls, and a `Customer` can only view/cancel *their own* bookings.
*   **Task 1.4: Validation & Error Handling:**
    *   Add FluentValidation to validate all DTOs (e.g., ensure prices are positive, emails are valid).
    *   Implement a global exception handling middleware to return standard problem details responses.

---

## Epic 2: Third-Party Integrations

Replace the mock services with real integrations.

*   **Task 2.1: Payment Gateway Integration (Razorpay):**
    *   Implement `RazorpayPaymentService.cs` adhering to the `IPaymentService` interface.
    *   Create endpoints to generate Razorpay Order IDs and verify Webhook signatures upon payment completion.
*   **Task 2.2: Notification Services:**
    *   Implement `SendGridEmailService` or `SmtpEmailService` for email confirmations.
    *   Implement `TwilioSmsService` to send SMS alerts to customers upon successful booking and to owners upon receiving a request.
*   **Task 2.3: Location & Mapping Services:**
    *   Integrate Google Maps API (or Mapbox) in the frontend.
    *   Update the backend to accept Latitude/Longitude and utilize PostGIS spatial queries to allow users to search for halls "within X kilometers of me" in Kerala/Tamil Nadu.

---

## Epic 3: Frontend Web Portals Completion

Flesh out the React (Next.js) web application with interactive forms and state management.

*   **Task 3.1: Customer Booking Flow:**
    *   Build a detailed Hall view page with an image gallery and calendar component for selecting dates.
    *   Implement the checkout UI that integrates with the Razorpay payment gateway script.
*   **Task 3.2: Owner Management Forms:**
    *   Create a complex "Add/Edit Hall" form allowing owners to upload images (integrating with AWS S3 or Azure Blob Storage).
    *   Build an interactive calendar view for owners to see their bookings and manually block out dates.
*   **Task 3.3: Admin Workflow:**
    *   Enhance the Admin Dashboard to include user management (banning users) and detailed analytics charts (total bookings, revenue).
*   **Task 3.4: Global UI/UX:**
    *   Implement a global Authentication context to manage user login state across the application.
    *   Add responsive navigation menus, loading spinners, and toast notifications for success/error messages.

---

## Epic 4: Mobile Application Development

Develop a cross-platform mobile application utilizing the existing .NET Web API.

*   **Task 4.1: React Native / Flutter Initialization:**
    *   Scaffold a new mobile project.
    *   Configure the API client (Axios/Dio) to communicate with the .NET backend.
*   **Task 4.2: Customer Mobile Views:**
    *   Build the mobile-optimized home screen, search interface, and location-based discovery.
    *   Implement the mobile booking and payment flow.
*   **Task 4.3: Push Notifications:**
    *   Integrate Firebase Cloud Messaging (FCM) or Apple Push Notification Service (APNs) for mobile-specific real-time alerts.

---

## Epic 5: DevOps & Production Deployment

Prepare the application for a live cloud environment.

*   **Task 5.1: CI/CD Pipelines:**
    *   Create GitHub Actions or Azure DevOps pipelines to automatically run `dotnet test` and deploy the API and Next.js frontend to a cloud provider (e.g., Azure App Service, Vercel).
*   **Task 5.2: Production Database Setup:**
    *   Provision a managed PostgreSQL instance (e.g., Azure Database for PostgreSQL, Amazon RDS) and configure secure connection strings.
*   **Task 5.3: Domain & SSL:**
    *   Configure custom domains and SSL certificates for the production endpoints.
