
package com.busreservation;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BusController {

    private final List<Map<String, Object>> bookings =
            new CopyOnWriteArrayList<>();

    private final AtomicLong bookingCounter = new AtomicLong(1000);

    @GetMapping("/buses")
    public List<Map<String, Object>> getBuses() {
        List<Map<String, Object>> buses = new ArrayList<>();

        buses.add(Map.of(
                "id", 1,
                "name", "Express Travels",
                "departure", "08:00 AM",
                "arrival", "02:00 PM",
                "price", 650
        ));

        buses.add(Map.of(
                "id", 2,
                "name", "Green Line Bus",
                "departure", "10:30 AM",
                "arrival", "04:30 PM",
                "price", 750
        ));

        buses.add(Map.of(
                "id", 3,
                "name", "Royal Travels",
                "departure", "09:00 PM",
                "arrival", "03:00 AM",
                "price", 900
        ));

        return buses;
    }

    @PostMapping("/bookings")
    public Map<String, Object> createBooking(
            @RequestBody Map<String, Object> request) {

        String name = String.valueOf(request.getOrDefault("name", "")).trim();
        String phone = String.valueOf(request.getOrDefault("phone", "")).trim();

        if (name.isEmpty() || !phone.matches("[0-9]{10}")) {
            throw new IllegalArgumentException(
                    "Enter a passenger name and valid 10-digit phone number."
            );
        }

        int seats;
        int price;

        try {
            seats = Integer.parseInt(String.valueOf(request.get("seats")));
            price = Integer.parseInt(String.valueOf(request.get("price")));
        } catch (Exception exception) {
            throw new IllegalArgumentException("Invalid seat or price value.");
        }

        if (seats < 1 || seats > 4 || price < 1 || price > 10000) {
            throw new IllegalArgumentException("Invalid seat count or price.");
        }

        long id = bookingCounter.incrementAndGet();

        Map<String, Object> booking = new LinkedHashMap<>();
        booking.put("bookingId", "BUS" + id);
        booking.put("name", name);
        booking.put("phone", phone);
        booking.put("from", request.get("from"));
        booking.put("to", request.get("to"));
        booking.put("date", request.get("date"));
        booking.put("seats", seats);
        booking.put("total", seats * price);

        bookings.add(booking);

        return booking;
    }

    @GetMapping("/bookings")
    public List<Map<String, Object>> getBookings() {
        return new ArrayList<>(bookings);
    }
}
