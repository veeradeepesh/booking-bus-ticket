
const buses = [
    { id: 1, name: "Express Travels", departure: "08:00 AM", arrival: "02:00 PM", price: 650 },
    { id: 2, name: "Green Line Bus", departure: "10:30 AM", arrival: "04:30 PM", price: 750 },
    { id: 3, name: "Royal Travels", departure: "09:00 PM", arrival: "03:00 AM", price: 900 }
];

const searchForm = document.getElementById("searchForm");
const busResults = document.getElementById("busResults");
const message = document.getElementById("message");
const bookingSection = document.getElementById("bookingSection");
const bookingForm = document.getElementById("bookingForm");

let selectedBus = null;
let journey = {};

const today = new Date();
const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

document.getElementById("travelDate").min = localToday;

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const date = document.getElementById("travelDate").value;

    message.textContent = "";
    busResults.replaceChildren();
    bookingSection.hidden = true;
    document.getElementById("confirmation").textContent = "";

    if (from === to) {
        message.textContent = "From and To locations must be different.";
        return;
    }

    if (date < localToday) {
        message.textContent = "Please select today or a future date.";
        return;
    }

    journey = { from, to, date };

    buses.forEach(function (bus) {
        const card = document.createElement("div");
        card.className = "bus-card";

        const title = document.createElement("h3");
        title.textContent = bus.name;

        const route = document.createElement("p");
        route.textContent = `${from} → ${to}`;

        const time = document.createElement("p");
        time.textContent = `Departure: ${bus.departure} | Arrival: ${bus.arrival}`;

        const price = document.createElement("p");
        price.textContent = `Ticket price: ₹${bus.price} per seat`;

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Book This Bus";

        button.addEventListener("click", function () {
            selectedBus = bus;
            document.getElementById("selectedBus").textContent =
                `${bus.name} | ${from} to ${to} | ₹${bus.price} per seat`;

            bookingSection.hidden = false;
            document.getElementById("confirmation").textContent = "";
            bookingSection.scrollIntoView({ behavior: "smooth" });
        });

        card.append(title, route, time, price, button);
        busResults.appendChild(card);
    });
});

bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!selectedBus) {
        return;
    }

    const name = document.getElementById("passengerName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const seats = Number(document.getElementById("seats").value);

    if (!name || !/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a name and a valid 10-digit mobile number.");
        return;
    }

    const total = selectedBus.price * seats;
    const bookingId = "BUS" + Date.now().toString().slice(-8);

    const confirmation = document.getElementById("confirmation");
    confirmation.textContent =
        `Booking created! Booking ID: ${bookingId}. ` +
        `Passenger: ${name}. Route: ${journey.from} to ${journey.to}. ` +
        `Date: ${journey.date}. Seats: ${seats}. Total: ₹${total}. ` +
        `Demo only: this booking is not saved to a server and no payment was taken.`;

    bookingForm.reset();
});
