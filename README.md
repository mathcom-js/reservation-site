# Reservation-site

## To-Dos

- Make API more RESTful (After)
  - users/[id] : GET, To find a user with ID
  - users : POST, To make a new user
  - users/me : PUT, To edit a information
  - login: POST, to login with OAuth
- Exception handling when there is no session (After)
- Automatic redirect to /login or /index (Jun)
- Add loading State (Jun)
- Front-end features
  - Reservation (After)
  - Register shop (Min)
  - Edit profile (Min)
  - Show profile (Min)
  - Shop review (Min)
  - Browse shops (Gon)
- Additional OAuth: Naver (After)
- Logout Function (Gon)

## DUE

- 06/06
  - JUN: Complete API structure, MiddleWare
  - GON: Front-end features
  - MIN: Front-end features
- 06/13
  - JUN: Deploy, Inspection, Reservation
  - GON: Additional OAuth
  - MIN: Reservation

## PATCH NOTE

### 06-02

1.  Automatic routing depends on user's session - middleware
2.  Change and delete api as RESTful - codes are combined
3.  Add Kakao OAuth login - delete name login, change DB
4.  Make path more clean and delete some unused import - tsconfig
5.  Add loading state to prevent errors - Need to be a modularize
