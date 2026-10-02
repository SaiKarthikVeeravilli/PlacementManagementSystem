import React, { useEffect, useState } from "react";
import api from "../services/axios";
import "./StudentCalender.css";

const StudentCalendar = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchEvents = async () => {

      try {

        const response = await api.get("/events");

const today = new Date();
today.setHours(0, 0, 0, 0);

const upcomingEvents = (response.data.events || []).filter((event) => {
  const eventDate = new Date(event.date);
  eventDate.setHours(0, 0, 0, 0);

  return eventDate >= today;
});

setEvents(upcomingEvents);

      } catch (err) {

        console.log(err);

        setError("Failed to load calendar events");

      } finally {

        setLoading(false);

      }

    };

    fetchEvents();

  }, []);


  if (loading) {
    return <h2>Loading calendar...</h2>;
  }


  if (error) {
    return <h2>{error}</h2>;
  }


  return (

    <div className="student-calendar">

      <div className="calendar-title">

        <h1>Placement Calendar</h1>

        <p>
          Important placement events and schedules
        </p>

      </div>


      {events.length === 0 ? (

        <div className="no-events">
          <h2>No Events</h2>
          <p>
            There are no placement events available.
          </p>
        </div>

      ) : (

        <div className="events-grid">

          {events.map((event) => (

            <div
              className="event-card"
              key={event._id}
            >

              <div className="event-header">

                <h2>{event.title}</h2>

                <span>
                  {event.type}
                </span>

              </div>


              <p className="event-description">
                {event.description}
              </p>


              <p className="event-date">

                📅{" "}
                {new Date(event.date).toLocaleDateString()}

              </p>

            </div>

          ))}

        </div>

      )}

    </div>

  );

};


export default StudentCalendar;