# Riotz

## Project Description

**Riotz** is a private bus tracking open-sourced web application built using Django. It provides users with an intuitive interface to search for available buses between two locations in Kerala, view their schedules, and see their routes on a map using OpenStreetMap. This was a project done by one of my friends [CLP](https://github.com/chethaslp) and I decided to give it a try for implementing a route visualisation. Check out his project too, [Wizmybus](https://github.com/chethaslp/wizmybus). Alr let's check out more abt this project below!

This project was developed for **FOSSathon**_(Hackathon conducted by FOSS @CEAL)_ during the college fest [Daksha Yanthra](https://www.instagram.com/dakshayanthra/) '25.

## Features

- **Search Buses by Route**
  - Users can enter a "From" and "To" location to find available private buses.
  
- **Bus Route Display**
  - OpenStreetMap integration to display bus routes and stops.
  - Click on a bus in the list to view its complete route.

- **Interactive UI**
  - Modern and simple design for seamless navigation.
  - Real-time updates when searching for buses.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/MTCodes01/Riotz.git
    ```
2. Navigate to the project directory:
    ```sh
    cd Wizmybus
    ```
3. Apply database migrations:
    ```sh
    python manage.py migrate
    ```
4. Start the development server:
    ```sh
    python manage.py runserver
    ```

## Usage

1. Open a web browser and go to:
```sh
http://127.0.0.1:8000/
```
2. Enter the "From" and "To" locations in the search fields.
```
Example:
  From: Kayamkulam
  To: Ernakulam
```
4. Click "Search" to find available buses.
5. Click on a bus to view its full route on the map.

## Directory Structure

wizmybus/
│── Wizmybus/
│   │── __pycache__/
│   │── asgi.py
│   │── settings.py
│   │── urls.py
│   │── wsgi.py
│── main/
│   │── __pycache__/
│   │── migrations/
│   │── static/
│   │── templates/
│   │── __init__.py
│   │── admin.py
│   │── apps.py
│   │── bus.json
│   │── models.py
│   │── tests.py
│   │── urls.py
│   │── views.py
│── db.sqlite3
│── manage.py
│── LICENSE
│── README

## Built With

- **Django** - Backend framework
- **HTML, CSS, JavaScript** - Frontend
- **OpenStreetMap & OpenRouteService** - Mapping & Routing
- **SQLite** - Database

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Added new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License.

<div align="center">Made for FOSSathon 🚀</div>
