
import React, { useState } from "react";
import api from "../services/axios";
import "./AdminCalender.css";

const getTodayLocal = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const AdminCalendar = () => {

  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: "",
    type: "Other"
  });

  const [message, setMessage] = useState("");

  const today = getTodayLocal();


  const handleChange = (e) => {

    setEvent({
      ...event,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post(
        "/admin/events",
        event
      );

      setMessage(response.data.message);

      setEvent({
        title: "",
        description: "",
        date: "",
        type: "Other"
      });

    } catch (err) {

      console.log(err);

      setMessage(
        err.response?.data?.message ||
        "Failed to create event"
      );

    }

  };


  return (

    <div className="calendar-page">

      <div className="calendar-header">

        <h1>Placement Calendar</h1>

        <p>
          Create important placement events and schedules
        </p>

      </div>


      <div className="calendar-card">

        <h2>Create Event</h2>


        {message && (
          <div className="calendar-message">
            {message}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Event Title</label>

            <input
              type="text"
              name="title"
              placeholder="Enter event title"
              value={event.title}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>Description</label>

            <textarea
              name="description"
              placeholder="Enter event description"
              value={event.description}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-row">

            <div className="form-group">

              <label>Date</label>

              <input
                type="date"
                name="date"
                value={event.date}
                onChange={handleChange}
                min={today}
                required
              />

            </div>


            <div className="form-group">

              <label>Event Type</label>

              <select
                name="type"
                value={event.type}
                onChange={handleChange}
              >

                <option value="Interview">
                  Interview
                </option>

                <option value="Test">
                  Test
                </option>

                <option value="Placement Drive">
                  Placement Drive
                </option>

                <option value="Deadline">
                  Deadline
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

          </div>


          <button
            type="submit"
            className="create-event-btn"
          >
            Create Event
          </button>

        </form>

      </div>

    </div>

  );

};


export default AdminCalendar;

